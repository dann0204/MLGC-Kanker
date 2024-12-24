# Gunakan Node.js 20 sebagai base image
FROM node:18

# Atur direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh kode aplikasi
COPY . .

# Expose port aplikasi
EXPOSE 8080

# Jalankan server
CMD ["npm", "start"]
