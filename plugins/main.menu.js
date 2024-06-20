import fs from 'fs'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'

// Define global variables
global.botname = 'ᴛʜᴇ Nino-ʙᴏᴛ'
global.premium = 'true'
global.packname = 'Nino┃ᴮᴼᵀ' 
global.author = '@Elta' 
global.menuvid = 'https://i.imgur.com/id9QGXO.mp4'

const { levelling } = '../lib/levelling.js'

let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, isPrems }) => {
    try {
        let vn = './Menu.png'
        let pp = imagen4
        let img = await (await fetch('https://telegra.ph/.')).buffer()
        let d = new Date(new Date + 3600000)
        let locale = 'ar'
        let week = d.toLocaleDateString(locale, { weekday: 'long' })
        let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
        let _uptime = process.uptime() * 1000
        let uptime = clockString(_uptime)
        let user = global.db.data.users[m.sender]
        let { money, joincount } = global.db.data.users[m.sender]
        let { exp, limit, level, role } = global.db.data.users[m.sender]
        let { min, xp, max } = xpRange(level, global.multiplier)
        let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length 
        let more = String.fromCharCode(8206)
        let readMore = more.repeat(850)   
        let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]

        let str = `
🔥☠️🔏☠️━━ **Games** ━━☠️🔏☠️🔥

🎮 *.ص  Ⓛ*
🎮 *.س*
🎮 *.كت*
🎮 *.تع*
🎮 *.اول*

💡🂱❣️✓ ━━ **Others** ━━✓❣️🂱💡

🎯 *.play* (search for a song)
🎯 *.@* (to tag everyone)
🎯 *.hidetag* (to tag by a message instead of @)
🎯 *.ttt* (to play tic tac toe)
🎯 *.Myping* (to know your ping)
🎯 *.owner* (to see who made me)

👑┑━━━ **Owner Properties** ━━━┍👑
*❗⇆ Owner-Number  ↯*
❗ [Owner WhatsApp](https://wa.me/+96176337375)
👑┙━━━ **Owner Properties** ━━━┕👑

`.trim()

        let buttonMessage = {
            image: pp,
            caption: str,
            mentions: [m.sender],
            footer: global.botname,
            headerType: 4,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    showAdAttribution: true,
                    mediaType: 'VIDEO',
                    mediaUrl: null,
                    title: global.botname,
                    body: null,
                    thumbnail: img,
                    sourceUrl: global.menuvid
                }
            }
        }

        conn.sendMessage(m.chat, buttonMessage, { quoted: m })
        // await conn.sendFile(m.chat, vn, 'menu.mp3', null, m, true, { type: 'audioMessage', ptt: true })
    } catch (e) {
        conn.reply(m.chat, '[❗خطاء❗]', m)
    }
}

handler.command = /^(help|الاوامر|menu|أوامر|menu|اوامر)$/i
handler.exp = 20
handler.fail = null
export default handler

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
