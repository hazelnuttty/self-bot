global.owner = ['6285183131924'];
global.saluran = 'https://example.com';
global.bot = "6285183131924"
global.namabot = "MICHIE - SELF BOT" 
global.namaown = "HAZEL BUKAN TUKANG BAK"
global.idch = "120363403378232838@newsletter"

let fs = require('fs')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
