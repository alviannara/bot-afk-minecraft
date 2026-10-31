const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// ==========================================
// 1. WEB SERVER MINI (UNTUK UPTIMEROBOT)
// ==========================================
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Bot AFK Minecraft Anti-Banned Aktif!');
});
app.listen(PORT, () => {
  console.log(`[Web Server] Mendengarkan pada port ${PORT}`);
});

// ==========================================
// 2. LOGIKA UTAMA BOT MINECRAFT ANTI-DETEKSI
// ==========================================
function createMinecraftBot() {
  console.log('[Bot] Mencoba menghubungkan ke server...');

  // Memuat data versi 26.3 secara manual untuk kestabilan protokol
  const mcData = require('minecraft-data')('26.3');

  const bot = mineflayer.createBot({
    host: 'society.playserver.pro', // Alamat server Anda
    port: 43439,                    // Port asli server Anda
    username: 'BotAni',     // Nama karakter bot
    version: '26.1'                 // Versi server game Anda
  });

  // Event saat bot sukses masuk ke dalam server
  bot.on('spawn', () => {
    console.log('[Bot] SUKSES! Bot telah masuk ke dalam server Minecraft.');
    
    // Perbaikan paket internal khusus untuk protokol server v26.3
    bot.on('physicsTick', () => {
      if (bot._client) {
        try {
          bot._client.write('tick_end', {});
        } catch (e) {}
      }
    });

    // --- FITUR 1: ANTI-AFK DETECTION (GERAKAN ACAK MANUSIA) ---
    // Mengatur interval acak antara 12 hingga 25 detik agar tidak berpola monoton
    const randomMovementInterval = () => {
      if (bot && bot.entity) {
        // A. Simulasi menggerakkan kepala secara acak (merubah arah pandang yaw & pitch)
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI;
        bot.look(yaw, pitch, false);

        // B. Simulasi melompat secara acak (50% kemungkinan setiap interval)
        if (Math.random() > 0.5) {
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 400);
        }
        
        console.log('[Anti-AFK] Bot melakukan simulasi aktivitas fisik acak.');
      }
      
      // Mengatur ulang waktu jeda berikutnya secara acak
      const nextDelay = Math.floor(Math.random() * 13000) + 12000;
      setTimeout(randomMovementInterval, nextDelay);
    };

    // Jalankan fitur gerakan acak pertama kali setelah spawn
    setTimeout(randomMovementInterval, 10000);
  });

  // --- FITUR 2: OTOMATIS MERESPON CHAT (SIMULASI INTERAKSI) ---
  bot.on('chat', (username, message) => {
    // Abaikan jika pesan berasal dari akun bot itu sendiri
    if (username === bot.username) return;

    const lowerMessage = message.toLowerCase();
    
    // Deteksi jika ada pemain atau sistem yang mendeteksi bot/AFK di obrolan
    if (lowerMessage.includes('afk') || lowerMessage.includes('bot') || lowerMessage.includes(bot.username.toLowerCase())) {
      console.log(`[Chat Monitor] Mendengar pesan dari ${username}: "${message}"`);
      
      // Memberikan jeda 2-4 detik sebelum membalas agar terlihat seperti mengetik manual
      const replyDelay = Math.floor(Math.random() * 2000) + 2000;
      
      setTimeout(() => {
        const replies = [
          'saya sedang stand-by menjaga area farm.',
          'aman, lagi AFK sebentar.',
          'karakter ini stand-by dulu ya.'
        ];
        // Memilih salah satu balasan acak
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        bot.chat(randomReply);
      }, replyDelay);
    }
  });

  // Event jika bot terputus (Anti-Disconnect otomatis login ulang)
  bot.on('end', (reason) => {
    console.log(`[Bot] Terputus dari server karena: ${reason}`);
    console.log('[Bot] Menunggu 20 detik sebelum mencoba masuk kembali...');
    setTimeout(() => {
      createMinecraftBot();
    }, 20000);
  });

  // Menangkap error agar sistem Render tidak crash terhenti
  bot.on('error', (err) => {
    console.log('[Bot Error] Terjadi kesalahan:', err.message);
  });
}

// Jalankan sistem bot
createMinecraftBot();
