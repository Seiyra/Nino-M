let unbanPluginHandler = async (m, { conn, text, isAdmin }) => {
  let chat = global.db.data.chats[m.chat];

  // Ensure only admins can use this command
  if (!isAdmin) return m.reply('❌ هذا الأمر مخصص للمشرفين فقط.');

  // Check if the command is not banned
  if (!chat.bannedPlugins) chat.bannedPlugins = [];
  if (!chat.bannedPlugins.includes('messi')) {
    return m.reply('❌ أمر  ليس محظورًا.');
  }

  // Unban the command
  chat.bannedPlugins = chat.bannedPlugins.filter(cmd => cmd !== 'messi');
  m.reply('✅ تم رفع الحظر عن الأمر  في هذه المجموعة.');
};

unbanPluginHandler.help = ['unbanplugin'];
unbanPluginHandler.tags = ['group'];
unbanPluginHandler.command = /^unbanplugin$/i;
unbanPluginHandler.admin = true; // Only admins can execute this command
unbanPluginHandler.group = true; // Only works in group chats

export default unbanPluginHandler;
