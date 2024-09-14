let unbanHandler = async (m) => {
  let chat = global.db.data.chats[m.chat];
  if (!chat.isBanned) {
    m.reply('هذه المجموعة ليست محظورة من استعمال البوت.');
  } else {
    chat.isBanned = false;
    m.reply('تم رفع الحظر عن استعمال البوت في هذه المجموعة. يمكنك الآن استخدامه مرة أخرى!');
  }
};

unbanHandler.help = ['unban'];
unbanHandler.tags = ['owner'];
unbanHandler.command = /^unban$/i;
unbanHandler.admin = true;

export default unbanHandler;
