global.owner = ['62851****']; // no lu
global.saluran = 'https://example.com';
global.bot = "62851***" // ganti no lu
global.namabot = "MICHIE - SELF BOT" // nama bot lu
global.namaown = "HAZEL BUKAN TUKANG BAK" // nama lu
global.idch = "120363403378232838@newsletter" // idch lu

let fs = require('fs')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
