const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')
const pino = require('pino')
const https = require('https')

require('dotenv').config()
const GROQ_API_KEY = process.env.GROQ_API_KEY // ganti dengan key lo

async function getAIReply(text) {
    const body = JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
            {
                role: 'system',
                content: `Kamu adalah customer service AI untuk Hermawan AI Automation, 
                layanan automation bisnis berbasis Python, n8n, dan AI. 
                Jawab pertanyaan dengan ramah, singkat (max 5 kalimat), dalam bahasa Indonesia.
                Info bisnis:
                - Layanan: Telegram Bot, WhatsApp Bot, Web Scraping, Workflow Automation, API Integration
                - Harga mulai Rp 300.000
                - Kontak: hermawan170303@gmail.com
                - Portfolio: github.com/wannTech`
            },
            { role: 'user', content: text }
        ],
        max_tokens: 200
    })

    return new Promise((resolve) => {
        const options = {
            hostname: 'api.groq.com',
            path: '/openai/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            }
        }

        const req = https.request(options, (res) => {
            let data = ''
            res.on('data', chunk => data += chunk)
            res.on('end', () => {
                try {
                    const json = JSON.parse(data)
                    resolve(json.choices[0].message.content)
                } catch {
                    resolve('Maaf, ada gangguan sistem. Silakan coba lagi! 😊')
                }
            })
        })

        req.on('error', () => resolve('Maaf, ada gangguan sistem. Silakan coba lagi! 😊'))
        req.write(body)
        req.end()
    })
}

function getReply(text) {
    if (text.includes('harga') || text.includes('price')) {
        return `💰 *Daftar Harga Layanan:*\n\n` +
               `• Telegram Bot: Rp 800.000\n` +
               `• WhatsApp Bot: Rp 1.000.000\n` +
               `• Workflow Automation: Rp 500.000\n` +
               `• Web Scraping: Rp 300.000\n\n` +
               `Hubungi kami untuk konsultasi gratis! 😊`
    }

    if (text.includes('halo') || text.includes('hai') || text.includes('hello') || text === 'hi') {
        return `👋 Halo! Selamat datang di *Hermawan AI Automation*\n\n` +
               `Saya bisa membantu:\n` +
               `• Ketik *harga* - lihat daftar harga\n` +
               `• Ketik *layanan* - lihat layanan kami\n` +
               `• Ketik *portofolio* - lihat project kami\n` +
               `• Ketik *kontak* - hubungi langsung\n\n` +
               `Ada yang bisa saya bantu? 🤖`
    }

    if (text.includes('layanan') || text.includes('service')) {
        return `⚙️ *Layanan Kami:*\n\n` +
               `1. 🤖 AI Chatbot (Telegram & WhatsApp)\n` +
               `2. 🕷️ Web Scraping & Data Extraction\n` +
               `3. ⚙️ Workflow Automation (n8n)\n` +
               `4. 📊 Auto Reporting & Dashboard\n` +
               `5. 🔗 API Integration\n\n` +
               `Ketik *harga* untuk info harga!`
    }

    if (text.includes('portofolio') || text.includes('portfolio') || text.includes('project')) {
        return `📁 *Portfolio Kami:*\n\n` +
               `🔗 GitHub: github.com/wannTech\n` +
               `🌐 Website: wanntech.github.io\n\n` +
               `Project unggulan:\n` +
               `• AI Lead Generation Pipeline\n` +
               `• AI Customer Service Bot\n` +
               `• Web Scraper + AI Enrichment\n` +
               `• n8n Workflow Automation`
    }

    if (text.includes('kontak') || text.includes('contact') || text.includes('hubungi')) {
        return `📞 *Kontak Kami:*\n\n` +
               `📧 Email: hermawan170303@gmail.com\n` +
               `💼 LinkedIn: linkedin.com/in/hermawan-h-0a2bab356\n` +
               `🐙 GitHub: github.com/wannTech\n\n` +
               `Atau reply langsung ke pesan ini! 😊`
    }

    if (text.includes('terima kasih') || text.includes('thanks') || text.includes('makasih')) {
        return `😊 Sama-sama! Ada yang bisa saya bantu lagi?`
    }

    return null // null = pakai AI
}

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
            console.log('\n📱 Scan QR Code ini dengan WhatsApp lo:\n')
            qrcode.generate(qr, { small: true })
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('❌ Connection closed. Reconnecting:', shouldReconnect)
            if (shouldReconnect) connectToWhatsApp()
        } else if (connection === 'open') {
            console.log('✅ WhatsApp Bot Connected!\n')
        }
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return
        if (msg.key.fromMe) return

        const sender = msg.key.remoteJid
        const text = msg.message.conversation ||
                     msg.message.extendedTextMessage?.text || ''

        if (!text) return

        console.log(`📨 Pesan dari ${sender}: ${text}`)

        let reply = getReply(text.toLowerCase())

        if (!reply) {
            console.log('🤖 Asking Groq AI...')
            reply = await getAIReply(text)
        }

        await sock.sendMessage(sender, { text: reply })
        console.log(`✅ Reply terkirim ke ${sender}`)
    })

    return sock
}

console.log('🚀 Starting WhatsApp Bot...')
connectToWhatsApp()