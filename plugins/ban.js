let banPluginHandler = async (m, { conn, text, isAdmin }) => {
  let chat = global.db.data.chats[m.chat];

  // Ensure only admins can use this command
  if (!isAdmin) return m.reply('❌ هذا الأمر مخصص للمشرفين فقط.');

  // Check if the command is already banned
  if (!chat.bannedPlugins) chat.bannedPlugins = [];
  if (chat.bannedPlugins.includes('messi')) {
    return m.reply('❌ أمر  محظور بالفعل.');
  }

  // Ban the command
  chat.bannedPlugins.push('messi');
  m.reply('✅ تم حظر الأمر  في هذه المجموعة.');
};

banPluginHandler.help = ['banplugin'];
banPluginHandler.tags = ['group'];
banPluginHandler.command = /^banplugin$/i;
banPluginHandler.admin = true; // Only admins can execute this command
banPluginHandler.group = true; // Only works in group chats

export default banPluginHandler;
