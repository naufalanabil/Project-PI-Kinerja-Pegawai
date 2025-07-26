# Dashboard Kinerja Pegawai

Proyek ini adalah dashboard interaktif untuk memvisualisasikan data kinerja pegawai menggunakan Next.js dan Chart.js.

## Fitur

- Visualisasi jumlah karyawan per departemen (Grafik Batang).
- Visualisasi tingkat kepuasan kerja (Grafik Pie).
- Visualisasi hubungan antara kinerja dan gaji (Box Plot).

## Setup Proyek

1.  **Install Dependensi**
    Pastikan Anda memiliki Node.js terinstal. Kemudian, jalankan perintah berikut di terminal:
    ```bash
    npm install
    ```

2.  **Siapkan Data**
    Pastikan file `WA_Fn-UseC_-HR-Employee-Attrition.csv` berada di dalam folder `data`. File ini harus berisi kolom seperti `Department`, `JobSatisfaction`, `PerformanceRating`, dan `MonthlyIncome`.

3.  **Jalankan Proyek**
    Untuk menjalankan server pengembangan, gunakan perintah:
    ```bash
    npm run dev
    ```
    Buka browser Anda dan kunjungi [http://localhost:3000](http://localhost:3000).

## Struktur Proyek

-   `/pages/index.js`: Halaman utama dashboard yang menampilkan semua grafik.
-   `/pages/api/chart-data.js`: API endpoint yang membaca dan memproses data dari file CSV.
-   `/components`: Berisi komponen-komponen React untuk setiap jenis grafik (Bar, Pie, Box Plot).
-   `/data`: Berisi file data CSV.
-   `/styles`: Berisi file styling global.
