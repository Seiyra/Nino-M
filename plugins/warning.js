let war = global.maxwarn || 3 // Default to 3 warnings if not set
let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {
  let who
  if (m.isGroup) {
    who = m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.quoted 
        ? m.quoted.sender 
        : false
  } else {
    who = m.chat
  }

  if (!who) throw `✳️ Tag or mention someone\n\n📌 Example: ${usedPrefix + command} @user`
  if (!(who in global.db.data.users)) throw `✳️ The user is not found in my database`

  let name = conn.getName(m.sender)
  let warn = global.db.data.users[who].warn || 0 // Default to 0 warnings

  if (warn < war) {
    global.db.data.users[who].warn += 1
    let currentWarns = global.db.data.users[who].warn

    await m.reply(
      `⚠️ *Warned User* ⚠️

▢ *Admin:* ${name}
▢ *User:* @${who.split`@`[0]}
▢ *Warns:* ${currentWarns}/${war}
▢ *Reason:* ${text || 'No reason provided'}`, 
      null, 
      { mentions: [who] }
    )

    await conn.sendMessage(
      who, 
      { text: `⚠️ *Caution* ⚠️
You have received a warning from an admin.

▢ *Warns:* ${currentWarns}/${war} 
If you receive *${war}* warnings, you will be automatically removed from the group.` } // Send as text message
    )

  } else if (warn >= war) {
    global.db.data.users[who].warn = 0 // Reset the warning count

    await m.reply(`⛔ The user exceeded the *${war}* warnings and will be removed.`)

    // Wait 3 seconds before removing
    await time(3000)

    await conn.groupParticipantsUpdate(m.chat, [who], 'remove')

    await conn.sendMessage(
      who, 
      { text: `♻️ You were removed from the group *${groupMetadata.subject}* because you have been warned *${war}* times.` } // Send as text message
    )
  }
}

handler.help = ['warn @user']
handler.tags = ['group']
handler.command = ['انذار'] // Arabic for "warn"
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

// Helper function to delay actions
const time = async ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
