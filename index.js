const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// ==========================================
// 1. WEB SERVER MINI (UNTUK UPTIMEROBOT)
// ==========================================
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Bot AFK Minecraft Render Online dan Aktif!');
});
app.listen(PORT, () => {
  console.log(`[Web Server] Mendengarkan pada port ${PORT}`);
});

// ==========================================
// 2. LOGIKA UTAMA BOT MINECRAFT
// ==========================================
function createMinecraftBot() {
  console.log('[Bot] Mencoba menghubungkan ke server...');

  const bot = mineflayer.createBot({
    host: 'society.playserver.pro', // <--- GANTI DENGAN IP/DOMAIN SERVER ANDA
    port: 43439,                      // <--- Ganti jika server menggunakan port berbeda
    username: 'Bot_AFK',       // Nama bot di dalam game
    
    // BARIS VERSION DIHAPUS SENGAJA
    // Biarkan Mineflayer mendeteksi versi protokol server secara otomatis
  });

  // Event saat bot berhasil masuk ke dalam game
  bot.on('spawn', () => {
    console.log('[Bot] SUKSES! Bot telah masuk ke dalam server Minecraft.');
    
    // Perbaikan khusus untuk protokol Minecraft terbaru (v26.3+)
    // Mengirim paket 'tick_end' secara berkala agar tidak terputus/ditolak server
    bot.on('physicsTick', () => {
      if (bot._client) {
        try {
          bot._client.write('tick_end', {});
        } catch (e) {
          // Mengabaikan error jika paket belum didukung oleh versi server tertentu
        }
      }
    });
  });

  // Event jika bot otomatis terputus dari server (Anti-Disconnect)
  bot.on('end', (reason) => {
    console.log(`[Bot] Terputus dari server karena: ${reason}`);
    console.log('[Bot] Menunggu 15 detik sebelum mencoba masuk kembali...');
    setTimeout(() => {
      createMinecraftBot();
    }, 15000);
  });

  // Menangkap error agar aplikasi di Render tidak crash total
  bot.on('error', (err) => {
    console.log('[Bot Error] Terjadi kesalahan sistem:', err.message);
  });
}

// Jalankan fungsi bot pertama kali
createMinecraftBot();
