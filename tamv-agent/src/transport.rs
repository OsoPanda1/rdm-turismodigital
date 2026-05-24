use anyhow::Result;
use tokio::sync::mpsc;

use crate::protocol::Envelope;

pub struct Transport {
    #[allow(dead_code)]
    interface: String,
    rx: mpsc::Receiver<Envelope>,
    #[allow(dead_code)]
    tx: mpsc::Sender<Envelope>,
}

impl Transport {
    pub fn new(interface: String) -> Self {
        let (tx, rx) = mpsc::channel(256);
        Self { interface, rx, tx }
    }

    pub async fn broadcast(&mut self, _envelope: Envelope) -> Result<()> {
        Ok(())
    }

    pub async fn recv(&mut self) -> Option<Envelope> {
        self.rx.recv().await
    }

    pub async fn send_to(_target_id: u16, _envelope: Envelope) -> Result<()> {
        Ok(())
    }
}
