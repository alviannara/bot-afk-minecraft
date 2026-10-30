# Gunakan versi Node.js yang stabil
FROM node:18

# Tentukan direktori kerja di dalam kontainer
WORKDIR /app

# Salin file package.json dan instal dependensi
COPY package*.json ./
RUN npm install

# Salin seluruh kode bot Anda
COPY . .

# Buka port 3000 (sesuai kode Express kita)
EXPOSE 3000

# Jalankan bot
CMD ["npm", "start"]
