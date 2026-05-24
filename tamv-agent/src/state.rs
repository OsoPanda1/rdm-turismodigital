use std::collections::BTreeMap;
use std::fs;
use std::path::{Path, PathBuf};

use anyhow::Result;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum NodeStatus {
    Up,
    Down,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeRecord {
    pub status: NodeStatus,
    pub last_seen: Option<DateTime<Utc>>,
    pub chain_seen: Option<u64>,
    pub break_meta: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PersistentState {
    pub local_id: u16,
    pub current_round: u64,
    pub registry: BTreeMap<u16, NodeRecord>,
}

pub struct StateStore {
    pub path: PathBuf,
    pub state: PersistentState,
}

impl StateStore {
    pub fn load_or_create(path: impl AsRef<Path>, local_id: u16) -> Result<Self> {
        let path = path.as_ref().to_path_buf();
        if path.exists() {
            let raw = fs::read_to_string(&path)?;
            let state = serde_json::from_str::<PersistentState>(&raw)?;
            return Ok(Self { path, state });
        }

        let state = PersistentState { local_id, current_round: 0, registry: BTreeMap::new() };
        let store = Self { path, state };
        store.persist_atomic()?;
        Ok(store)
    }

    pub fn touch(&mut self, id: u16, status: NodeStatus, last_seen: DateTime<Utc>) {
        let entry = self.state.registry.entry(id).or_insert(NodeRecord {
            status: NodeStatus::Unknown,
            last_seen: None,
            chain_seen: None,
            break_meta: None,
        });
        entry.status = status;
        entry.last_seen = Some(last_seen);
    }

    pub fn mark_chain_seen(&mut self, id: u16, round_id: u64) {
        let entry = self.state.registry.entry(id).or_insert(NodeRecord {
            status: NodeStatus::Unknown,
            last_seen: None,
            chain_seen: None,
            break_meta: None,
        });
        entry.chain_seen = Some(round_id);
    }

    pub fn snapshot_registry(&self, limit: usize) -> Vec<(u16, NodeRecord)> {
        self.state.registry.iter().take(limit).map(|(id, r)| (*id, r.clone())).collect()
    }

    pub fn merge_registry(&mut self, incoming: Vec<(u16, NodeRecord)>) {
        for (id, remote) in incoming {
            self.state.registry.entry(id).and_modify(|local| {
                if remote.last_seen > local.last_seen {
                    *local = remote.clone();
                }
            }).or_insert(remote);
        }
    }

    pub fn persist_atomic(&self) -> Result<()> {
        let tmp = self.path.with_extension("json.tmp");
        let data = serde_json::to_vec_pretty(&self.state)?;
        fs::write(&tmp, data)?;
        fs::rename(&tmp, &self.path)?;
        Ok(())
    }
}
