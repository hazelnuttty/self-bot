require('./config');
const fs = require('fs');
const util = require('util');
const os = require('os');
const { exec } = require("child_process");
const { performance } = require('perf_hooks');
const { downloadMediaMessage, downloadContentFromMessage } = require('@whiskeysockets/baileys');

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
      case 'menu':
      case 'zelmenu':
      case 'menuawal': {
        await HazelXmichie.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key } });

        // Default values jika global variable tidak ada
        const botName = global.namabot || 'HazelBot';
        const ownerName = global.namaown || global.own || 'HazelXmichie';
        const ownerNumber = global.owner ? global.owner[0] : '6285183131924';

        let uptime = runtime(process.uptime());

        let menuText = `*ʜᴀʟᴏ ${pushname}.*  
ɴᴀᴍᴀ ꜱᴀʏᴀ ᴀᴅᴀʟᴀʜ *${botName}*, ꜱᴀʏᴀ ᴀᴅᴀʟᴀʜ ᴀꜱɪꜱꜱᴛᴇɴ ʏᴀɴɢ ꜱɪᴀᴘ ᴍᴇʟᴀʏᴀɴɪ ᴋᴀᴍᴜ 24ᴊᴀᴍ

┏━⭓ *ʙᴏᴛ ɪɴғᴏ*
┃◦ ɴᴀᴍᴀ : *${botName}*
┃◦ ᴠᴇʀꜱɪ : *0.0.8*
┃◦ ᴛʏᴘᴇ : *ᴄᴀꜱᴇ*
┃◦ ᴍᴏᴅᴇ : *ꜱᴇʟғ*
┃◦ ʀᴜɴᴛɪᴍᴇ : *${uptime}*
┗━━━━━━━━━━━

┏━⭓ *ᴍᴇɴᴜ ᴘɪʟɪʜᴀɴ*
┃◦ ${prefix}ʀᴠᴏ
┃◦ ${prefix}sᴘᴀᴍᴘᴀɪʀ
┃◦ ${prefix}sᴘᴀᴍᴄᴀʟʟ
┃◦ ${prefix}ᴘɪɴɢ
┃◦ ${prefix}ɢᴇᴛsᴡ
┃◦ ${prefix}ᴏᴄʀ
┃◦ ${prefix}ɢᴇᴛᴘᴘ
┗━━━━━━━━━━━
✘ ᴄʀᴇᴀᴛᴏʀ: *${ownerName}*
✘ ɴᴏᴍᴏʀ: *${ownerNumber}*
ᴊɪᴋᴀ ᴀᴅᴀ ᴍᴀꜱᴀʟᴀʜ, ꜱɪʟᴀᴋᴀɴ ᴋᴇᴛɪᴋ *.ᴏᴡɴᴇʀ*`;

        await HazelXmichie.sendMessage(m.chat, {
          text: menuText,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            externalAdReply: {
              title: `${botName}`,
              body: `${ownerNumber}`,
              thumbnail: fs.readFileSync('./media/michie.jpg'), 
              sourceUrl: `https://whatsapp.com/channel/0029VbAPj3U1Hsq2RJSlef2a`,
              mediaType: 1,
              renderLargerThumbnail: true,
              mentionedJid: [m.sender]
            }
          }
        }, { quoted: m });
      }
      break;
      
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

        let old = performance.now();
        let neww = performance.now();
        let latensi = neww - old;

        let teks = `*˗ˏˋ 𝗛𝗲𝗶𝗶𝗶 ${pushname}~ ˎˊ˗*
𝗚𝗶𝗺𝗮𝗻𝗮 𝗸𝗮𝗯𝗮𝗿𝗻𝘆𝗮𝗮? 𝗦𝗲𝗺𝗼𝗴𝗮 𝗯𝗮𝗶𝗸-𝗯𝗮𝗶𝗸 𝗮𝗷𝗰 𝘆𝗮𝗮~  
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

        await HazelXmichie.sendMessage(m.chat, { text: teks }, { quoted: m });
        break;
      }
      
      case 'getpp': {
        let userss = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        
        // Jika tidak ada user yang disebutkan/dibalas, gunakan sender
        if (!userss || userss === '@s.whatsapp.net') {
            userss = m.sender;
        }
        
        let ghosst = userss;
        try {
            var ppuser = await HazelXmichie.profilePictureUrl(ghosst, 'image');
        } catch (err) {
            var ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60';
        }
        
        HazelXmichie.sendMessage(m.chat, { 
            image: { url: ppuser },
            caption: `Profile picture dari @${ghosst.split('@')[0]}`,
            mentions: [ghosst]
        }, { quoted: m });
      }
      break;
      
      case '🐦':
      case 'rvo':
      case 'readviewonce': {
        if (!m.quoted) return reply("Balas pesan view once dengan command ini");
        
        let msg = m.quoted.message;
        let type = Object.keys(msg)[0];
        if (!msg[type].viewOnce) return reply("Pesan itu bukan viewonce!");
        
        try {
          let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : type == 'videoMessage' ? 'video' : 'audio');
          let buffer = Buffer.from([]);
          for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
          }
          
          if (/video/.test(type)) {
            return HazelXmichie.sendMessage(m.chat, {video: buffer, caption: msg[type].caption || ""}, {quoted: m});
          } else if (/image/.test(type)) {
            return HazelXmichie.sendMessage(m.chat, {image: buffer, caption: msg[type].caption || ""}, {quoted: m});
          } else if (/audio/.test(type)) {
            return HazelXmichie.sendMessage(m.chat, {audio: buffer, mimetype: "audio/mpeg", ptt: true}, {quoted: m});
          }
        } catch (error) {
          console.error(error);
          reply("Terjadi error saat memproses view once");
        }
      }
      break;
      
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

      case 'spam-pairing': 
      case 'spampair': {
        if (!text) return reply(`*Example:* ${prefix + command} +628xxxxxx|150`);
        
        reply("Tunggu sebentar...");
        let [peenis, pepekk = "200"] = text.split("|");
        let target = peenis.replace(/[^0-9]/g, '').trim();
        
        // Hanya untuk owner bot
        if (!isCreator) return reply("Perintah ini hanya untuk owner bot");
        
        try {
          let { default: makeWaSocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
          let { state } = await useMultiFileAuthState('pepek');
          let { version } = await fetchLatestBaileysVersion();
          let pino = require("pino");
          let sucked = await makeWaSocket({ auth: state, version, logger: pino({ level: 'fatal' }) });
          
          let prc;
          for (let i = 0; i < pepekk; i++) {
            await sleep(1500);
            prc = await sucked.requestPairingCode(target);
            console.log(`_Succes Spam Pairing Code - Number : ${target} - Code : ${prc}_`);
          }
          
          await sleep(15000);
          reply(`Spam pairing code selesai. Kode terakhir: ${prc}`);
        } catch (error) {
          console.error(error);
          reply("Terjadi error saat melakukan spam pairing code");
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
