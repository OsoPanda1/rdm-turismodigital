use anyhow::Result;
use base64::{engine::general_purpose::STANDARD, Engine};
use hmac::{Hmac, Mac};
use sha2::Sha256;

type HmacSha256 = Hmac<Sha256>;

#[derive(Clone)]
pub struct Signer {
    key: Vec<u8>,
}

impl Signer {
    pub fn from_base64(input: &str) -> Result<Self> {
        let key = STANDARD.decode(input)?;
        Ok(Self { key })
    }

    pub fn sign(&self, payload: &[u8]) -> Result<String> {
        let mut mac = HmacSha256::new_from_slice(&self.key)?;
        mac.update(payload);
        Ok(hex::encode(mac.finalize().into_bytes()))
    }

    pub fn verify(&self, payload: &[u8], signature_hex: &str) -> Result<bool> {
        let expected = self.sign(payload)?;
        Ok(expected == signature_hex)
    }
}
