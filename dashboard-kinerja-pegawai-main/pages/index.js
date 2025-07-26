// File: pages/index.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import BoxPlotChart from '../components/BoxPlotChart';

// --- INI BAGIAN YANG HILANG ---
// Kita harus import komponen KMeansChart sebelum bisa dipake
import KMeansChart from '../components/KMeansChart';
// -----------------------------

export default function Home() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/chart-data');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setChartData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Head>
        <title>Dashboard Kinerja Pegawai</title>
        <meta name="description" content="Dashboard untuk monitoring kinerja pegawai" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Dashboard Monitoring Kinerja Pegawai
        </h1>

        {chartData && (
          <div className="space-y-6">
            {/* Row 1: Bar Chart dan Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <BarChart chartData={chartData.departmentData} />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <PieChart chartData={chartData.satisfactionData} />
              </div>
            </div>

            {/* Row 2: Box Plot (Ini sekarang harusnya sudah tidak loading lama) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <BoxPlotChart chartData={chartData.boxPlotData} />
            </div>

            {/* Row 3: K-Means Clustering */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <KMeansChart chartData={chartData.kmeansData} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}