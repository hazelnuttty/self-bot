global.owner = ["6285183131924"] 
global.bot = "6285220154383"
global.namabot = "MICHIE - SELF BOT" 
global.namaown = "HAZEL BUKAN TUKANG BAK"

let fs = require('fs')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
