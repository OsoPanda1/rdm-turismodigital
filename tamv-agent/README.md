# tamv-agent

Binario único en Rust para operar malla TAMV sin nube, con gossip antientropía, cadena 1→206→1 con HMAC y persistencia local.

## Estado actual

Este módulo implementa la base operativa:

- Carga de `config.toml` homogéneo por nodo.
- Persistencia atómica de `state.json`.
- Envoltorio de mensajes (`HELLO`, `STATE_SYNC`, `CHAIN_STEP`, `CHAIN_REPORT`) con firma HMAC.
- Loop asíncrono sobre Tokio para gossip, heartbeat y recepción.
- Capa de transporte abstracta para conectar BLE/Wi‑Fi mesh.

## Uso

```bash
cp config.example.toml config.toml
cargo run
```

El archivo `config.toml` es lo único que varía entre repositorios/nodos.
