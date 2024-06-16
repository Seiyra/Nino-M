let handler = async (m, { conn }) => {
  try {
    // Record the start time
    let startTime = Date.now();

    // Send a message and wait for the response
    await conn.sendMessage(m.chat, { text: 'Pinging...' });

    // Record the end time when the response is received
    let endTime = Date.now();

    // Calculate the ping time
    let ping = endTime - startTime;

    // Send the ping result back to the chat
    await conn.sendMessage(m.chat, { text: `Pong! Your current ping is ${ping}ms.` });
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: `❌ *Error:* ${error.message}` });
  }
};
handler.help = ['ping'];
handler.tags = ['info'];
handler.command = /^(ping)$/i;

export default handler;
