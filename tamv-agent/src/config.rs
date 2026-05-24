use std::fs;

use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentConfig {
    pub node: NodeConfig,
    pub mesh: MeshConfig,
    pub agent: RuntimeConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeConfig {
    pub id: u16,
    pub next_id: u16,
    pub prev_id: u16,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MeshConfig {
    pub interface: String,
    pub gossip_interval_ms: u64,
    pub secret_key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RuntimeConfig {
    pub retry_limit: u32,
    pub chain_timeout_ms: u64,
}

impl AgentConfig {
    pub fn load(path: &str) -> Result<Self> {
        let raw = fs::read_to_string(path)?;
        let cfg = toml::from_str::<Self>(&raw)?;
        Ok(cfg)
    }
}
