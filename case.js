require('./config');
const fs = require('fs');
const util = require('util')
const { exec } = require("child_process")
const os = require('os')
const { runtime, formatp, isUrl, downloadContentFromMessage } = require('./lib/functions')

module.exports = async (HazelXmichie, m) => {
try {
const body = (
(m.mtype === 'conversation' && m.message.conversation) ||
(m.mtype === 'imageMessage' && m.message.imageMessage.caption) ||
(m.mtype === 'documentMessage' && m.message.documentMessage.caption) ||
(m.mtype === 'videoMessage' && m.message.videoMessage.caption) ||
(m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text) ||
(m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ||
(m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId)
) ? (
(m.mtype === 'conversation' && m.message.conversation) ||
(m.mtype === 'imageMessage' && m.message.imageMessage.caption) ||
(m.mtype === 'documentMessage' && m.message.documentMessage.caption) ||
(m.mtype === 'videoMessage' && m.message.videoMessage.caption) ||
(m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text) ||
(m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ||
(m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId)
) : '';
global.userSpam = global.userSpam || {};
global.userBlocked = global.userBlocked || {};
global.groupWarned = global.groupWarned || {};
const spamWindow = 2 * 1000; // dalam 2 detik
const spamLimit = 3; // maksimal 3x cmd
const blockTime = 10 * 1000; // ban 10 detik
const now = Date.now();
const sender = m.sender;
const isPrivateChat = m.chat.endsWith('@s.whatsapp.net');
const biyuzxn = m.isGroup;
if (global.userBlocked[sender]) return;
if (!global.userSpam[sender]) global.userSpam[sender] = [];
global.userSpam[sender].push(now);
global.userSpam[sender] = global.userSpam[sender].filter(ts => now - ts <= spamWindow);
if (isPrivateChat && global.userSpam[sender].length >= spamLimit) {
  global.userBlocked[sender] = true;
  global.userSpam[sender] = [];
  await m.reply('🚫 Kamu terlalu cepat kirim perintah!\nBot akan nge-block kamu selama 10 detik... santai dulu ya.');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await HazelXmichie.updateBlockStatus(sender, 'block');
  console.log(`[ANTI-SPAM] ${sender} diblokir karena spam di private chat.`);
  setTimeout(async () => {
// buat unblock
    await HazelXmichie.updateBlockStatus(sender, 'unblock');
    delete global.userBlocked[sender];
    console.log(`[ANTI-SPAM] ${sender} sudah di-unblock otomatis.`);
  }, blockTime);
}
if (biyuzxn && global.userSpam[sender].length >= spamLimit) {
  const warnKey = `${m.chat}|${sender}`;
  if (!global.groupWarned[warnKey]) {
    global.groupWarned[warnKey] = true;
    await m.reply('⚠️ Kamu terlalu cepat kirim command!\nCooldown 10 detik dulu ya biar gak dianggap spam.');
    setTimeout(() => delete global.groupWarned[warnKey], blockTime);
  }
}
const budy = (typeof m.text === 'string') ? m.text : '';
const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1)
const text = q = args.join(" ")
const senderJid = m.key.fromMe ? (HazelXmichie.user.id.split(':')[0]+'@s.whatsapp.net' || HazelXmichie.user.id) : (m.key.participant || m.key.remoteJid)
const botNumber = await HazelXmichie.decodeJid(HazelXmichie.user.id)
const senderNumber = senderJid.split('@')[0]
const isCreator = (m && m.sender && [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)) || false;
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)

//~~~~~Fitur Case~~~~~//
switch(command) {
case "rvo": case "readviewonce": case "•": {
if (!m.quoted) return m.reply("Balas pesan view once dengan command ini")
let msg = m.quoted.message
    let type = Object.keys(msg)[0]
if (!msg[type].viewOnce) return m.reply("Pesan itu bukan viewonce!")
let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : type == 'videoMessage' ? 'video' : 'audio')
    let buffer = Buffer.from([])
    for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk])
    }
    if (/video/.test(type)) {
        return HazelXmichie.sendMessage(m.chat, {video: buffer, caption: msg[type].caption || ""}, {quoted: m})
    } else if (/image/.test(type)) {
        return HazelXmichie.sendMessage(m.chat, {image: buffer, caption: msg[type].caption || ""}, {quoted: m})
    } else if (/audio/.test(type)) {
        return HazelXmichie.sendMessage(m.chat, {audio: buffer, mimetype: "audio/mpeg", ptt: true}, {quoted: m})
    } 
}
break
case 'ping':
case 'botstatus':
case 'statusbot': {
    const used = process.memoryUsage();
    const cpus = os.cpus().map(cpu => {
        cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
        return cpu;
    });

    const cpu = cpus.reduce((last, cpu, _, { length }) => {
        last.total += cpu.total;
        last.speed += cpu.speed / length;
        last.times.user += cpu.times.user;
        last.times.nice += cpu.times.nice;
        last.times.sys += cpu.times.sys;
        last.times.idle += cpu.times.idle;
        last.times.irq += cpu.times.irq;
        return last;
    }, {
        speed: 0,
        total: 0,
        times: {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0
        }
    });

    // hitung latency
    let old = performance.now();
    let neww = performance.now();
    let latensi = neww - old;

    // grafik ping dinamis
    const latencyValue = latensi.toFixed(4);
    const good = Math.min(100, 100 - Math.min(latensi * 1000, 100)); // misal ping 0.010s -> good 90
    const bad = 100 - good;

    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
        type: 'doughnut',
        data: {
            datasets: [{
                data: [good, bad],
                backgroundColor: ['#26AC00', 'red'],
                borderWidth: 0
            }],
            labels: ['Good', 'Bad']
        },
        options: {
            circumference: Math.PI,
            rotation: Math.PI,
            cutoutPercentage: 75,
            legend: { display: false },
            plugins: {
                datalabels: {
                    color: '#404040',
                    anchor: 'end',
                    align: 'end',
                    formatter: (val) => `${val.toFixed(0)}%`,
                    font: { size: 25, weight: 'bold' }
                },
                doughnutlabel: {
                    labels: [
                        { text: 'Ping Status', font: { size: 20 } },
                        { text: `${latencyValue}s`, color: '#000', font: { size: 25, weight: 'bold' } }
                    ]
                }
            }
        }
    }))}`;

    // teks hasil
    let teks = `*˗ˏˋ 𝗛𝗲𝗶𝗶𝗶 ${pushname}~ ˎˊ˗*
𝗚𝗶𝗺𝗮𝗻𝗮 𝗸𝗮𝗯𝗮𝗿𝗻𝘆𝗮𝗮? 𝗦𝗲𝗺𝗼𝗴𝗮 𝗯𝗮𝗶𝗸-𝗯𝗮𝗶𝗸 𝗮𝗷𝗮 𝘆𝗮𝗮~  
𝗞𝗼𝗸 𝘁𝗶𝗯𝗮-𝘁𝗶𝗯𝗮 𝗻𝗴𝗲𝘁𝗶𝗸 *${prefix}ping* 𝘀𝗶𝗶?  
𝗣𝗲𝗻𝗴𝗲𝗻 𝗽𝗲𝗿𝗵𝗮𝘁𝗶𝗮𝗻 𝗱𝗮𝗿𝗶 𝗮𝗸𝘂 𝘆𝗮?

*✦ 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦 ✦*

✧ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲 : *${latensi.toFixed(4)} 𝘀𝗲𝗰*  
✧ 𝗨𝗽𝘁𝗶𝗺𝗲        : *${runtime(process.uptime())}*  
  𝗔𝗸𝘂 𝘂𝗱𝗮𝗵 𝗵𝗶𝗱𝘂𝗽 𝘀𝗲𝗹𝗮𝗺𝗮 𝗶𝘁𝘂 𝗹𝗼𝗵𝗵

*✦ 𝗦𝗘𝗥𝗩𝗘𝗥 𝗣𝗘𝗥𝗙𝗢𝗥𝗠𝗔𝗡𝗖𝗘 ✦*

✧ 𝗥𝗔𝗠 𝗨𝘀𝗲𝗱      : *${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}*  
✧ 𝗖𝗣𝗨 𝗠𝗼𝗱𝗲𝗹     : *${cpus[0].model.trim()}*  
✧ 𝗖𝗣𝗨 𝗦𝗽𝗲𝗲𝗱     : *${cpu.speed.toFixed(2)} 𝗠𝗛𝘇*  
  𝗘𝗵 𝗶𝗻𝗶 𝗸𝗲𝗻𝗰𝗮𝗻𝗴 𝗲𝗻𝗴𝗴𝗮 𝘀𝗶𝗵?  
✧ 𝗖𝗣𝗨 𝗖𝗼𝗿𝗲𝘀     : *${cpus.length} 𝗰𝗼𝗿𝗲(𝘀)*  

*✦ 𝗖𝗣𝗨 𝗨𝗧𝗜𝗟𝗜𝗭𝗔𝗧𝗜𝗢𝗡 ✦*

${Object.keys(cpu.times).map(type => `✧ ${type.toLowerCase().padEnd(6)} : *${(100 * cpu.times[type] / cpu.total).toFixed(2)}%*`).join('\n')}

> 𝗗𝗶𝗸𝗲𝗿𝗷𝗮𝗶𝗻 𝗱𝗲𝗻𝗴𝗮𝗻 𝘀𝗮𝘆𝗮𝗻𝗴 𝗱𝗮𝗿𝗶 𝗯𝗼𝘁 𝗺𝘂~
`.trim();

    await HazelXmichie.sendMessage(m.chat, {
        text: teks,
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: 'SYSTEM MONITOR',
                body: `Response: ${latensi.toFixed(4)} sec`,
                thumbnailUrl: chartUrl,
                sourceUrl: global.saluran,
                mediaType: 1,
                renderLargerThumbnail: true,
                newsletterJid: '120363400302831857@newsletter',
                serverMessageId: 20,
                newsletterName: 'MICHIE-MD'
            }
        }
    }, { quoted: m });
}
break
case 'ambilsw': case "sw": {
    if (m.isGroup) return m.reply("❌ Command ini hanya bisa digunakan di chat pribadi!");

    const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quotedMessage) return m.reply("📌 Balas pesan gambar/video yang ingin diambil!");

    if (quotedMessage.imageMessage) {
        let imageUrl = await HazelXmichie.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
        return HazelXmichie.sendMessage(m.chat, { image: { url: imageUrl } }, { quoted: m });
    }

    if (quotedMessage.videoMessage) {
        let videoUrl = await HazelXmichie.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
        return HazelXmichie.sendMessage(m.chat, { video: { url: videoUrl } }, { quoted: m });
    }

    return m.reply("❌ Hanya bisa mengambil gambar atau video dari pesan yang dikutip!");
}
break
case 'join': {
if (!isCreator) return m.reply("Perintah ini hanya untuk owner bot!")
if (!text) return m.reply(`Contoh ${prefix+command} linkgc`)
if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return m.reply('Link Invalid!')
let result = args[0].split('https://chat.whatsapp.com/')[1]
await HazelXmichie.groupAcceptInvite(result)
await m.reply(`sukses kak`)
}
break
default:
}
} catch (err) {
console.log(util.format(err))
}
}

//~~~~~Status Diperbarui~~~~~//
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
