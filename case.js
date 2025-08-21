/*
Base Whatsapp Bot
By HazelXmichie Archive

Youtube: @HikariArchive
*/
require('./config');
const fs = require('fs');
const util = require('util');
const os = require('os');
const { exec } = require("child_process");
const { performance } = require('perf_hooks');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

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
    ) || '';

    const budy = (typeof m.text === 'string') ? m.text : '';
    const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
    const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const text = q = args.join(" ");
    const sender = m.key.fromMe ? (HazelXmichie.user.id.split(':')[0]+'@s.whatsapp.net' || HazelXmichie.user.id) : (m.key.participant || m.key.remoteJid);
    const botNumber = await HazelXmichie.decodeJid(HazelXmichie.user.id);
    const senderNumber = sender.split('@')[0];
    const isCreator = (m && m.sender && [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)) || false;
    const pushname = m.pushName || `${senderNumber}`;
    const isBot = botNumber.includes(senderNumber);

    // Helper functions
    const reply = (text) => HazelXmichie.sendMessage(m.chat, { text }, { quoted: m });
    const runtime = function(seconds) {
      seconds = Number(seconds);
      var d = Math.floor(seconds / (3600 * 24));
      var h = Math.floor(seconds % (3600 * 24) / 3600);
      var m = Math.floor(seconds % 3600 / 60);
      var s = Math.floor(seconds % 60);
      var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
      var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
      return dDisplay + hDisplay + mDisplay + sDisplay;
    };
    const formatp = function(bytes) {
      if (bytes == 0) return '0 Bytes';
      var k = 1024;
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    //~~~~~Fitur Case~~~~~//
    switch(command) {
      case 'ping':
      case 'botstatus':
      case 'statusbot': {
        // Hapus pengecekan registrasi di sini
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

        let old = performance.now();
        let neww = performance.now();
        let latensi = neww - old;

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
              thumbnailUrl: 'https://files.catbox.moe/aq5icp.png',
              sourceUrl: global.saluran || 'https://github.com',
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m });
        break;
      }

      case 'getsw':
      case 'ambilsw':
      case 'sw': {
        if (m.isGroup) return reply("❌ command ini cuma bisa di chat pribadi yaa~");

        const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMsg) return reply("📌 balas status gambar/video yang mau diambil dong~");

        try {
          if (quotedMsg.imageMessage) {
            const img = await downloadMediaMessage({ message: { imageMessage: quotedMsg.imageMessage } }, "buffer", {}, { reuploadRequest: HazelXmichie });
            return HazelXmichie.sendMessage(m.chat, { image: img, caption: "nih statusnyaa~ 🖼️" }, { quoted: m });
          }

          if (quotedMsg.videoMessage) {
            const vid = await downloadMediaMessage({ message: { videoMessage: quotedMsg.videoMessage } }, "buffer", {}, { reuploadRequest: HazelXmichie });
            return HazelXmichie.sendMessage(m.chat, { video: vid, caption: "nih status videonyaa~ 🎥" }, { quoted: m });
          }

          return reply("❌ cuma bisa ambil gambar atau video aja yaa 😿");
        } catch (e) {
          console.error(e);
          reply("ada error pas ambil statusnyaa 😿");
        }
        break;
      }

      case 'spamcall': {
        if (!isCreator) return reply("Perintah ini hanya untuk owner bot");
        if (!text) return reply("Example use:\n\nspamcall 62xxx|jumlah\nor reply/tag someone.\n\nExample:\nspamcall 62895640071400|1000");
        
        let targetNumber = text.split("|")[0];
        let jumlahSpam = text.split("|")[1] ? parseInt(text.split("|")[1]) : 500;
        let isTarget = m.mentionedJid[0] ? 
            m.mentionedJid[0] : 
            m.quoted ? 
                m.quoted.sender : 
                targetNumber.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        
        if (isNaN(jumlahSpam) || jumlahSpam <= 0) jumlahSpam = 500; 
        
        reply(`*LOADING*-\n- \`${jumlahSpam} CALL\` - PROCESS SENDING, PLEASE WAIT WHILE *BOT IS STILL WORKING* > MORTAL PROCESS...`);
        await sleep(1000);
        
        for (let i = 0; i < jumlahSpam; i++) {
          try {
            await HazelXmichie.sendCall(isTarget, {});
            await sleep(1000);
          } catch (error) {
            console.error('Failed to send call:', error);
          }
        }
        break;
      }

      default:
        // Do nothing for unhandled commands
    }
  } catch (err) {
    console.log(util.format(err));
  }
};

//~~~~~Status Diperbarui~~~~~//
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update ${__filename}`);
  delete require.cache[file];
  require(file);
});
