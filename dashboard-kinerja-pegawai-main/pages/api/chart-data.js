// File: pages/api/chart-data.js

import path from 'path';
import fs from 'fs';
import Papa from 'papaparse';

export default function handler(req, res) {
  // Tentukan path ke file CSV di dalam folder /data
  const filePath = path.join(process.cwd(), 'data', 'WA_Fn-UseC_-HR-Employee-Attrition.csv');
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse CSV menjadi JSON
    const parsedData = Papa.parse(fileContents, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true, // Skip baris kosong
    }).data;

    // Filter data yang valid
    const validData = parsedData.filter(row => 
      row.Department && 
      row.JobSatisfaction && 
      row.PerformanceRating && 
      row.MonthlyIncome
    );

    console.log('Valid data count:', validData.length); // Debug log

    // --- OLAH DATA UNTUK SETIAP GRAFIK ---

    // 1. Data untuk Grafik Batang (Jumlah Karyawan per Departemen)
    const departmentCounts = validData.reduce((acc, row) => {
      acc[row.Department] = (acc[row.Department] || 0) + 1;
      return acc;
    }, {});

    const departmentData = {
      labels: Object.keys(departmentCounts),
      data: Object.values(departmentCounts),
    };

    // 2. Data untuk Grafik Pie (Tingkat Kepuasan Kerja)
    const satisfactionCounts = validData.reduce((acc, row) => {
      acc[row.JobSatisfaction] = (acc[row.JobSatisfaction] || 0) + 1;
      return acc;
    }, {});

    const satisfactionData = {
      labels: ['1: Kurang Puas', '2: Cukup', '3: Puas', '4: Sangat Puas'],
      data: [
        satisfactionCounts[1] || 0,
        satisfactionCounts[2] || 0,
        satisfactionCounts[3] || 0,
        satisfactionCounts[4] || 0,
      ],
    };

    // 3. Data untuk Box Plot (Kinerja vs Gaji)
    const performanceIncome = {
      '3': [], // Rating 'Baik'
      '4': [], // Rating 'Sangat Baik'
    };

    validData.forEach(row => {
      const rating = String(row.PerformanceRating);
      const income = Number(row.MonthlyIncome);
      
      if (rating && income && performanceIncome[rating]) {
        performanceIncome[rating].push(income);
      }
    });

    console.log('Performance Income:', {
      '3': performanceIncome['3'].length,
      '4': performanceIncome['4'].length
    }); // Debug log

    const boxPlotData = {
      labels: ['Baik (3)', 'Sangat Baik (4)'],
      data: [performanceIncome['3'], performanceIncome['4']],
    };

    // Kirim semua data yang sudah diolah dalam satu response JSON
    res.status(200).json({
      departmentData,
      satisfactionData,
      boxPlotData,
      // Tambahkan raw data untuk K-Means
      kmeansData: {
        rawData: validData
      },
      debug: {
        totalRows: parsedData.length,
        validRows: validData.length,
        boxPlotCounts: {
          rating3: performanceIncome['3'].length,
          rating4: performanceIncome['4'].length
        }
      }
    });

  } catch (error) {
    console.error('Error reading or processing file:', error);
    res.status(500).json({ message: 'Gagal memproses data', error: error.message });
  }
}