# Remote Dorm Monitoring App📱
Disusun oleh Kelompok 9 K02 yang beranggotakan :
- Michelle Lim / 18221052
- Esther Regina / 18221086
- Razan Aditya Putra / 18221132
- Dzikri Muhammad Raditya Putra / 18221144
- Angela Geraldine Hasian Panjaitan / 18221158

## Penjelasan Singkat
Sistem Remote Dorm Monitoring adalah sistem yang memungkinkan penghuni kos untuk mengetahui beberapa informasi kamar kos seperti temperatur ruangan, kebisingan ruangan, dan status kondisi pintu pada website. Selain penghuni kos, pemilik kos juga dapat memantau temperatur, kebisingan, dan status kondisi pintu pada aplikasi. Dengan adanya sistem remote dorm monitoring, beberapa hal seperti tingkat kebisingan yang tidak terkontrol sistem ventilasi yang tidak memadai, dan keamanan ruangan kamar kos dapat diatasi.


## Cara menjalankan aplikasi (aplikasi dirancang hanya untuk pemilik kos)
1. Pastikan emulator sudah ter-install pada lingkungan pengembangan. Untuk Android, Anda dapat menggunakan Android Studio dan untuk iOS, Anda bisa menggunakan Xcode.
2. Jalankan ```npm install``` untuk mengunduh dan menginstal semua dependensi yang diperlukan oleh proyek dari file ```package.json```.
3. Jalankan command ```npm run andorid``` pada terminal untuk mengompilasi source dan membangun aplikasi pada emulator android. Pastikan emulator sudah berjalan sebelum menjalankan perintah ini.
4. **Untuk menjalankan aplikasi pada iOS dengan Xcode**:
   - **Buka proyek di Xcode**: Buka file `.xcworkspace` dari direktori proyek Anda di Xcode.
   - **Pilih perangkat atau emulator**: Di Xcode, pilih perangkat fisik atau emulator iOS yang ingin Anda gunakan dari daftar perangkat yang tersedia.
   - **Instal dependensi iOS**: Buka terminal di direktori proyek Anda dan jalankan `npx pod-install` untuk menginstal semua dependensi CocoaPods yang diperlukan untuk proyek iOS.
   - **Jalankan aplikasi**: Klik tombol 'Run' (ikon segitiga hijau) di Xcode atau gunakan shortcut `Cmd + R` untuk mengompilasi dan menjalankan aplikasi pada perangkat atau emulator iOS yang dipilih.


> **Login sebagai pemilik kos:**
> - 📧 **Username:** admin@gmail.com
> - 🔑 **Password:** admin123


## Cara menjalankan website (website dirancang hanya untuk penghuni kos)
1. Jalankan ```npm install``` untuk mengunduh dan menginstal semua dependensi yang diperlukan oleh proyek dari file ```package.json```.
2. Jalankan command ```npm run dev``` pada terminal untuk menjalankan web secara lokal.
3. Buka ```localhost:3000``` pada web browser

> **Login sebagai salah satu penghuni kos:**
> - 📧 **Username:** penghuni@gmail.com
> - 🔑 **Password:** penghuni123


## Akses pengguna berdasarkan use case
 Fitur               | Pemilik Kos   | Penghuni Kos |
|--------------------|-------------------------|--------------|
| Melakukan log in    | Yes                |Yes|
|Data temperatur real time kamar penghuni kos|Yes|Yes|
|Data kebisingan real time kamar penghuni kos|Yes|Yes|
|Data kondisi pintu real time kamar penghuni kos|Yes|Yes|
|Data historis|Yes|Yes|
|Melakukan personalisasi atas kamar|No|Yes|
|Menerima email peringatan|Yes|No|
|Melihat data pelanggaran seluruh penghuni kos|Yes|No|
