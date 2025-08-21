const { default: makeWASocket, DisconnectReason, jidDecode, proto, getContentType, useMultiFileAuthState, downloadContentFromMessage } = require("@whiskeysockets/baileys")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const readline = require("readline");
const PhoneNumber = require('awesome-phonenumber')
const chalk = require('chalk')

const question = (text) => { const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); return new Promise((resolve) => { rl.question(text, resolve) }) };

//~~~~~Membuat Koneksi~~~~~//
async function StartHazelXmichie() {
const { state, saveCreds } = await useMultiFileAuthState("session")
const HazelXmichie = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: false,
auth: state,
connectTimeoutMs: 60000,
defaultQueryTimeoutMs: 0,
keepAliveIntervalMs: 10000,
emitOwnEvents: true,
fireInitQueries: true,
generateHighQualityLinkPreview: true,
syncFullHistory: true,
markOnlineOnConnect: true,
browser: ["Ubuntu", "Chrome", "20.0.04"],
});

//~~~~~Password Protection~~~~~//
if (!HazelXmichie.authState.creds.registered) {
  const correctAnswer = 'hazeloffc' 
  let attempts = 0
  const maxAttempts = 3
  let verified = false
  
  while (attempts < maxAttempts && !verified) {
    const answer = await question(chalk.yellow.bold('Masukkan password untuk menggunakan bot:\n'))
    if (answer.toLowerCase() === correctAnswer) {
      verified = true
      console.log(chalk.green.bold('Password benar! Silahkan lanjutkan.'))
    } else {
      attempts++
      if (attempts < maxAttempts) {
        console.log(chalk.red.bold(`Password salah! Kesempatan tersisa: ${maxAttempts - attempts}`))
      } else {
        console.log(chalk.red.bold('Password salah! Kesempatan habis.'))
        process.exit()
      }
    }
  }
  
  const phoneNumber = await question('Masukan Nomor Bot :\n');
  
  let code = await HazelXmichie.requestPairingCode(phoneNumber, "MICHIELV");
  
  code = code?.match(/.{1,4}/g)?.join("-") || code;
  console.log(`Pairing Kode Anda :`, code);
}

const contacts = {};

HazelXmichie.ev.on('contacts.update', updates => {
  for (const update of updates) {
    contacts[update.id] = {...contacts[update.id], ...update};
  }
});

HazelXmichie.ev.on('messages.upsert', async chatUpdate => {
try {
mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
if (!HazelXmichie.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return

const m = smsg(HazelXmichie, mek, contacts)
const pushname = m.pushName || 'Unknown'
const budy = (typeof m.text === 'string' ? m.text : '')

if (m.message && m.isGroup) {
    try {
        const groupMetadata = await HazelXmichie.groupMetadata(m.chat);
        const groupName = groupMetadata.subject || 'Unknown Group';
        console.log(`
┌────────── [ GROUP CHAT LOG ] ──────────┐
│ 🕒 Time      : ${chalk.green(new Date().toISOString().slice(0, 19).replace('T', ' '))}
│ 📝 Message   : ${chalk.blue(budy || m.mtype)}
│ 👤 Sender    : ${chalk.magenta(pushname)} (${chalk.cyan(m.sender)})
│ 🏠 Group     : ${chalk.yellow(groupName)} (${chalk.cyan(m.chat)})
└────────────────────────────────────────┘
    `);
    } catch (err) {
        console.log('Error fetching group metadata:', err);
    }
} else if (m.message && !m.isGroup) {
    console.log(`
┌───────── [ PRIVATE CHAT LOG ] ─────────┐
│ 🕒 Time      : ${chalk.green(new Date().toISOString().slice(0, 19).replace('T', ' '))}
│ 📝 Message   : ${chalk.blue(budy || m.mtype)}
│ 👤 Sender    : ${chalk.magenta(pushname)} (${chalk.cyan(m.sender)})
└────────────────────────────────────────┘
    `);
}

require("./case")(HazelXmichie, m, chatUpdate, contacts)
} catch (err) {
console.log(err)
}
})

HazelXmichie.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

HazelXmichie.getName = async (jid, withoutContact = false) => {
id = HazelXmichie.decodeJid(jid)
withoutContact = HazelXmichie.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) {
  try {
    v = await HazelXmichie.groupMetadata(id) || {};
    return v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international');
  } catch (err) {
    return PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international');
  }
} else {
  v = id === '0@s.whatsapp.net' ? {
    id,
    name: 'WhatsApp'
  } : id === HazelXmichie.decodeJid(HazelXmichie.user.id) ?
  HazelXmichie.user :
  (contacts[id] || {});
  return (withoutContact ? '' : v.name) || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
}
}

HazelXmichie.public = false

HazelXmichie.serializeM = (m) => smsg(HazelXmichie, m, contacts);

//~~~~~Memeriksa Koneksi~~~~~//
HazelXmichie.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update;
if (connection === 'close') {
let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
if (reason === DisconnectReason.badSession || reason === DisconnectReason.connectionClosed || reason === DisconnectReason.connectionLost || reason === DisconnectReason.connectionReplaced || reason === DisconnectReason.restartRequired || reason === DisconnectReason.timedOut) {
StartHazelXmichie();
} else if (reason === DisconnectReason.loggedOut) {
console.log('Logged out from WhatsApp');
} else {
HazelXmichie.end(`Unknown DisconnectReason: ${reason}|${connection}`);
}
} else if (connection === 'open') {
console.log('[Connected] ' + JSON.stringify(HazelXmichie.user.id, null, 2));
}
});

//~~~~~Menyimpan Session~~~~~//
HazelXmichie.ev.on('creds.update', saveCreds)

HazelXmichie.sendText = (jid, text, quoted = '', options) => HazelXmichie.sendMessage(jid, { text: text, ...options }, { quoted })

HazelXmichie.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

return HazelXmichie
}

StartHazelXmichie()

function smsg(HazelXmichie, m, contacts) {
if (!m) return m
let M = proto.WebMessageInfo
if (m.key) {
m.id = m.key.id
m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
m.chat = m.key.remoteJid
m.fromMe = m.key.fromMe
m.isGroup = m.chat.endsWith('@g.us')
m.sender = HazelXmichie.decodeJid(m.fromMe && HazelXmichie.user.id || m.participant || m.key.participant || m.chat || '')
if (m.isGroup) m.participant = HazelXmichie.decodeJid(m.key.participant) || ''
}
if (m.message) {
m.mtype = getContentType(m.message)
m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype])
m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text
let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
if (m.quoted) {
let type = getContentType(quoted)
m.quoted = m.quoted[type]
if (['productMessage'].includes(type)) {
type = getContentType(m.quoted)
m.quoted = m.quoted[type]
}
if (typeof m.quoted === 'string') m.quoted = {
text: m.quoted
}
m.quoted.mtype = type
m.quoted.id = m.msg.contextInfo.stanzaId
m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
m.quoted.sender = HazelXmichie.decodeJid(m.msg.contextInfo.participant)
m.quoted.fromMe = m.quoted.sender === HazelXmichie.decodeJid(HazelXmichie.user.id)
m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
m.getQuotedObj = m.getQuotedMessage = async () => {
if (!m.quoted.id) return false

return m.quoted;
}
let vM = m.quoted.fakeObj = M.fromObject({
key: {
remoteJid: m.quoted.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id
},
message: quoted,
...(m.isGroup ? { participant: m.quoted.sender } : {})
})
m.quoted.delete = () => HazelXmichie.sendMessage(m.quoted.chat, { delete: vM.key })
m.quoted.copyNForward = (jid, forceForward = false, options = {}) => HazelXmichie.copyNForward(jid, vM, forceForward, options)
m.quoted.download = () => HazelXmichie.downloadMediaMessage(m.quoted)
}
}
if (m.msg.url) m.download = () => HazelXmichie.downloadMediaMessage(m.msg)
m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
m.reply = (text, chatId = m.chat, options = {}) => Buffer.isBuffer(text) ? HazelXmichie.sendMedia(chatId, text, 'file', '', m, { ...options }) : HazelXmichie.sendText(chatId, text, m, { ...options })
m.copy = () => smsg(HazelXmichie, M.fromObject(M.toObject(m)))
m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => HazelXmichie.copyNForward(jid, m, forceForward, options)

return m
}

//~~~~~Status Diperbarui~~~~~//
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
