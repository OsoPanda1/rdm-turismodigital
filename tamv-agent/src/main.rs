mod config;
mod protocol;
mod security;
mod state;
mod transport;

use std::sync::Arc;
use std::time::Duration;

use anyhow::Result;
use chrono::Utc;
use config::AgentConfig;
use protocol::{Envelope, MessagePayload};
use security::Signer;
use state::{NodeStatus, PersistentState, StateStore};
use tokio::sync::Mutex;
use tokio::time::interval;
use transport::Transport;

#[tokio::main]
async fn main() -> Result<()> {
    let config = AgentConfig::load("config.toml")?;
    let state_store = StateStore::load_or_create("state.json", config.node.id)?;
    let state_store = Arc::new(Mutex::new(state_store));
    let signer = Signer::from_base64(&config.mesh.secret_key)?;
    let mut transport = Transport::new(config.mesh.interface.clone());

    send_hello(&config, &signer, &mut transport).await?;

    let gossip_every = Duration::from_millis(config.mesh.gossip_interval_ms);
    let mut gossip_tick = interval(gossip_every);
    let mut heartbeat_tick = interval(Duration::from_secs(2));

    loop {
        tokio::select! {
            _ = gossip_tick.tick() => {
                let envelope = Envelope::new(
                    config.node.id,
                    MessagePayload::StateSync {
                        version: Utc::now().timestamp_millis() as u64,
                        partial_state: state_store.lock().await.snapshot_registry(8),
                    },
                    &signer,
                )?;
                transport.broadcast(envelope).await?;
            }
            _ = heartbeat_tick.tick() => {
                let now = Utc::now();
                let mut store = state_store.lock().await;
                store.touch(config.node.id, NodeStatus::Up, now);
                store.persist_atomic()?;
            }
            inbound = transport.recv() => {
                if let Some(message) = inbound {
                    process_message(&config, &signer, state_store.clone(), message).await?;
                }
            }
            _ = tokio::signal::ctrl_c() => {
                break;
            }
        }
    }

    Ok(())
}

async fn send_hello(config: &AgentConfig, signer: &Signer, transport: &mut Transport) -> Result<()> {
    let envelope = Envelope::new(config.node.id, MessagePayload::Hello, signer)?;
    transport.broadcast(envelope).await
}

async fn process_message(
    config: &AgentConfig,
    signer: &Signer,
    state: Arc<Mutex<StateStore>>,
    envelope: Envelope,
) -> Result<()> {
    if !envelope.verify(signer)? {
        return Ok(());
    }

    let now = Utc::now();
    {
        let mut store = state.lock().await;
        store.touch(envelope.from_id, NodeStatus::Up, now);

        match envelope.payload {
            MessagePayload::Hello => {}
            MessagePayload::StateSync { partial_state, .. } => {
                store.merge_registry(partial_state);
            }
            MessagePayload::ChainStep {
                chain_start,
                round_id,
                path,
                ..
            } => {
                store.mark_chain_seen(envelope.from_id, round_id);
                if config.node.next_id == chain_start {
                    let report = Envelope::new(
                        config.node.id,
                        MessagePayload::ChainReport {
                            round_id,
                            path,
                            complete_cycle: true,
                            breaks: Vec::new(),
                        },
                        signer,
                    )?;
                    drop(store);
                    return transport::Transport::send_to(config.node.prev_id, report).await;
                }
            }
            MessagePayload::ChainReport { .. } => {}
        }

        store.persist_atomic()?;
    }

    Ok(())
}
