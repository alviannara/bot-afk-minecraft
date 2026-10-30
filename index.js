const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// Web server mini untuk memancing UptimeRobot
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Bot AFK Minecraft Anda sedang online!');
});
app.listen(PORT, () => {
  console.log(`Web server mendengarkan pada port ${PORT}`);
});

// Logika Utama Bot Minecraft
function createMinecraftBot() {
  const bot = mineflayer.createBot({
    host: 'society.playserver.pro', // Ganti dengan IP/Domain Server Minecraft Anda
    port: 25575,                // Ganti jika port server berbeda (Default: 25565)
    username: 'Bot_AFK', // Nama karakter bot di dalam game
    version: '26.3'           // Sesuaikan dengan versi server Minecraft Anda
  });

  bot.on('spawn', () => {
    console.log('Bot berhasil masuk ke dalam server Minecraft.');
  });

  // Fitur Anti-Disconnect (Otomatis login ulang jika DC atau dikick)
  bot.on('end', (reason) => {
    console.log(`Bot terputus karena: ${reason}. Mencoba masuk kembali dalam 10 detik...`);
    setTimeout(() => {
      createMinecraftBot();
    }, 10000);
  });

  bot.on('error', (err) => console.log('Terjadi error pada bot:', err));
}

createMinecraftBot();
