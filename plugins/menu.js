// Import necessary modules
import { promises as fsPromises, readFileSync } from "fs";
import { join } from "path";
import { xpRange } from "../lib/levelling.js";
import moment from "moment-timezone";
import os from "os";

// Define menus
const menus = {
    gamemenu: `
    ✦ ───『 *Games* 』─── ⚝
    🎮 *.ص* Ⓛ (For images)
    🎮 *.س* (For questions)
    🎮 *.تع* (تعداد)
    🎮 *.كت* (For writing)
    🎮 *.<كت<رقم بالعربي او انجليزي* (For writing a larger number)
    🎮 *.مكت تبدا مسابقة كت*
    🎮 *.سكت تنهي مسابقة كت*
    ╰──────────⳹`,
    othersmenu: `
    ✦ ───『 *Others* 』─── ⚝
    🎯 *.مخفي* (For hidden)
    🎯 *.طرد* (For kicking)
    🎯 *.ملصق* (For stickers)
    🎯 *.ملصق* <input|input>
    🎯 *.رابط* (For the group link)
    ╰──────────⳹`
};

// Define bot name
const botname = "Ｎｉｎｏ－Ｂｏｔ";

// Main handler function
const handler = async (m, { conn, command, text, args, usedPrefix }) => {
    try {
        let glb = global.db.data.users;
        let usrs = glb[m.sender];
        let tag = `@${m.sender.split("@")[0]}`;
        let mode = global.opts["self"] ? "Private" : "Public";

        let { age, exp, limit, level, role, registered, credit } = glb[m.sender];
        let { min, xp, max } = xpRange(level, global.multiplier);
        let name = await conn.getName(m.sender);
        let premium = glb[m.sender].premiumTime;
        let prems = `${premium > 0 ? "Premium" : "Free"}`;
        let platform = os.platform();

        let ucpn = `${ucapan()}`;

        let _uptime = process.uptime() * 1000;
        let _muptime;
        if (process.send) {
            process.send("uptime");
            _muptime = await new Promise(resolve => {
                process.once("message", resolve);
                setTimeout(resolve, 1000);
            }) * 1000;
        }
        let muptime = clockString(_muptime);
        let uptime = clockString(_uptime);

        let totalfeatures = Object.values(global.plugins).filter((v) => v.help && v.tags).length;
        let totalreg = Object.keys(glb).length;

        conn.gurumenu = conn.gurumenu ? conn.gurumenu : {};

        global.fcontact = {
            key: { fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: 'status@broadcast' },
            message: {
                contactMessage: {
                    displayName: `${name}`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };

        const infoText = `
        ${botname} 
        Hii ${name} Senpai

        *${ucpn}* 

        乂───『 *U S E R*』───乂
        *  *Rank:* *User.*
        ⛥ *Owner:* *Elta/+96176337375*
        ╰──────────⳹

        ╭───────⳹
        │ *1.* Games Menu
        │ *2.* Others Menu
        ╰───────⳹
    `;

        // React to the message
        await conn.sendMessage(m.chat, { react: { text: '🌀', key: m.key } });

        const { result, key, timeout } = await conn.sendMessage(m.chat, { video: { url: menuvid }, caption: infoText.trim(), gifPlayback: true, gifAttribution: 0 }, { quoted: fcontact });

        conn.gurumenu[m.sender] = {
            result,
            key,
            timeout: setTimeout(() => {
                conn.sendMessage(m.chat, { delete: key });
                delete conn.gurumenu[m.sender];
            }, 150 * 1000),
        };
    } catch (err) {
        console.error(err);
        m.reply('An error occurred while processing your request.');
    }
};

// Before handler function to catch user responses
handler.before = async (m, { conn }) => {
    try {
        conn.gurumenu = conn.gurumenu ? conn.gurumenu : {};
        if (m.isBaileys || !(m.sender in conn.gurumenu)) return;
        const { result, key, timeout } = conn.gurumenu[m.sender];
        if (!m.quoted || m.quoted.id !== key.id || !m.text) return;
        const choice = m.text.trim();

        const sendMenu = async (menuName) => {
            await conn.sendMessage(m.chat, { image: { url: 'https://i.imgur.com/MzQELlJ.jpeg' }, caption: menus[menuName] }, { quoted: fcontact });
        };

        const menuOptions = {
            "1": "gamemenu",
            "2": "othersmenu"
        };

        if (menuOptions[choice]) {
            await sendMenu(menuOptions[choice]);
        } else {
            m.reply('Invalid choice. Please reply with a valid number.');
        }

        // Add reaction to the message
        await conn.sendMessage(m.chat, { react: { text: '👍', key: m.key } });
    } catch (err) {
        console.error(err);
        m.reply('An error occurred while processing your request.');
    }
};

// Register the handler
handler.help = ["menu"];
handler.tags = ["main"];
handler.command = ['menu','اوامر'];
handler.limit = true;

export default handler;

// Utility functions
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
    let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
    return [h, " H ", m, " M ", s, " S "].map(v => v.toString().padStart(2, 0)).join("");
}

function clockStringP(ms) {
    let ye = isNaN(ms) ? "--" : Math.floor(ms / 31104000000) % 10;
    let mo = isNaN(ms) ? "--" : Math.floor(ms / 2592000000) % 12;
    let d = isNaN(ms) ? "--" : Math.floor(ms / 86400000) % 30;
    let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000) % 24;
    let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
    return [ye, " *Years 🗓️*\n", mo, " *Month 🌙*\n", d, " *Days ☀️*\n", h, " *Hours 🕐*\n", m, " *Minute ⏰*\n", s, " *Second ⏱️*"].map(v => v.toString().padStart(2, 0)).join("");
}

function ucapan() {
    const time = moment.tz("Asia/Kolkata").format("HH");
    let res = "Good morning ☀️";
    if (time >= 4 && time < 10) res = "Good Morning 🌄";
    else if (time >= 10 && time < 15) res = "Good Afternoon ☀️";
    else if (time >= 15 && time < 18) res = "Good Afternoon 🌇";
    else if (time >= 18) res = "Good Night 🌙";
    return res;
}
