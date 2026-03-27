# IPFS / Decentralized Storage APIs

> Content-addressed storage for pinning files and data to IPFS.

---

## NFT.Storage

| | |
|---|---|
| **Base URL** | `https://api.nft.storage` |
| **Env Var** | `NFT_STORAGE_API_KEY` |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `POST /upload` | Upload content to IPFS |

---

## Pinata

| | |
|---|---|
| **Base URL** | `https://api.pinata.cloud` |
| **Env Var** | `PINATA_JWT` |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `POST /pinning/pinFileToIPFS` | Pin file to IPFS |
| `POST /pinning/pinByHash` | Pin by content hash |
