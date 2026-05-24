use anyhow::Result;
use chrono::Utc;
use rand::Rng;
use serde::{Deserialize, Serialize};

use crate::security::Signer;
use crate::state::NodeRecord;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Envelope {
    pub from_id: u16,
    pub timestamp: i64,
    pub nonce: u64,
    pub payload: MessagePayload,
    pub signature: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum MessagePayload {
    Hello,
    StateSync { version: u64, partial_state: Vec<(u16, NodeRecord)> },
    ChainStep { chain_start: u16, current: u16, next: u16, round_id: u64, path: Vec<u16> },
    ChainReport { round_id: u64, path: Vec<u16>, complete_cycle: bool, breaks: Vec<String> },
}

impl Envelope {
    pub fn new(from_id: u16, payload: MessagePayload, signer: &Signer) -> Result<Self> {
        let timestamp = Utc::now().timestamp_millis();
        let nonce = rand::thread_rng().gen_range(1..u64::MAX);
        let content = serde_json::to_vec(&(from_id, timestamp, nonce, &payload))?;
        let signature = signer.sign(&content)?;

        Ok(Self {
            from_id,
            timestamp,
            nonce,
            payload,
            signature,
        })
    }

    pub fn verify(&self, signer: &Signer) -> Result<bool> {
        let content = serde_json::to_vec(&(self.from_id, self.timestamp, self.nonce, &self.payload))?;
        signer.verify(&content, &self.signature)
    }
}
