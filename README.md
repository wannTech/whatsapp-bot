# 🤖 WhatsApp AI Bot

Bot WhatsApp otomatis dengan AI fallback menggunakan Baileys + Groq AI. Bot ini bisa menjawab pertanyaan pelanggan secara otomatis, dan untuk pertanyaan yang tidak dikenali, AI akan merespons secara natural.

## ✨ Features

- **Auto-reply FAQ** — Jawab pertanyaan umum (harga, layanan, portfolio, kontak) secara instan
- **Groq AI Fallback** — Pertanyaan di luar FAQ dijawab AI secara natural (Llama 3.1)
- **Auto-reconnect** — Bot otomatis reconnect kalau koneksi putus
- **Multi-message support** — Handle text biasa dan extended text message
- **Session persistent** — Tidak perlu scan QR ulang setelah login pertama

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| WhatsApp Connection | Baileys (@whiskeysockets/baileys) |
| AI Engine | Groq API (Llama 3.1-8b-instant) |
| Runtime | Node.js |
| QR Generator | qrcode-terminal |

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v18+
- Groq API Key (gratis di [console.groq.com](https://console.groq.com))
- Nomor WhatsApp aktif

### Installation

```bash
git clone https://github.com/wannTech/whatsapp-bot
cd whatsapp-bot
npm install
```

### Environment Variables

Buat file `.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Run

```bash
node index.js
```

Scan QR code yang muncul di terminal dengan WhatsApp HP lo:
1. Buka WhatsApp → **⋮** → **Linked Devices**
2. Klik **Link a Device**
3. Scan QR code

## 💬 Demo

```
User: halo
Bot:  👋 Halo! Selamat datang di Hermawan AI Automation
      • Ketik harga - lihat daftar harga
      • Ketik layanan - lihat layanan kami

User: berapa harga telegram bot?
Bot:  💰 Daftar Harga Layanan:
      • Telegram Bot: Rp 800.000
      • WhatsApp Bot: Rp 1.000.000

User: apakah bisa integrasi dengan CRM?
Bot:  [Groq AI] Tentu! Kami bisa mengintegrasikan bot dengan CRM 
      seperti HubSpot, Salesforce, atau Airtable...
```

## 📁 Project Structure

```
whatsapp-bot/
├── index.js          # Main bot logic
├── .env              # API keys (tidak di-commit)
├── .env.example      # Template environment variables
├── auth_info/        # Session WhatsApp (auto-generated)
├── package.json
└── README.md
```

## 🎯 Use Cases

- **Customer Service** — Auto-reply FAQ pelanggan 24/7
- **Marketing** — Broadcast info produk/promo
- **Lead Generation** — Kumpulkan data calon pelanggan
- **Order Management** — Notifikasi status pesanan otomatis

## 🔗 Links

- **Portfolio:** [wanntech.github.io](https://wanntech.github.io)
- **LinkedIn:** [linkedin.com/in/hermawan-h-0a2bab356](https://linkedin.com/in/hermawan-h-0a2bab356)
- **Email:** hermawan170303@gmail.com

---

Built with ❤️ by [Hermawan](https://wanntech.github.io) | AI Automation Specialist
