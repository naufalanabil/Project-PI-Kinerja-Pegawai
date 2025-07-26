import { Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

const BoxPlotChart = ({ chartData }) => {
  const [processedData, setProcessedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processBoxPlotData = () => {
      try {
        if (!chartData || !chartData.data || chartData.data.length === 0) {
          setLoading(false);
          return;
        }

        // Hitung statistik untuk setiap grup
        const stats = chartData.data.map((dataArray, index) => {
          if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return { min: 0, q1: 0, median: 0, q3: 0, max: 0, mean: 0 };
          }

          const sorted = [...dataArray].sort((a, b) => a - b);
          const n = sorted.length;
          
          const min = sorted[0];
          const max = sorted[n - 1];
          const q1 = sorted[Math.floor(n * 0.25)];
          const median = sorted[Math.floor(n * 0.5)];
          const q3 = sorted[Math.floor(n * 0.75)];
          const mean = sorted.reduce((sum, val) => sum + val, 0) / n;

          return { min, q1, median, q3, max, mean };
        });

        // Buat data untuk visualization sebagai bar chart dengan error bars
        const barData = {
          labels: chartData.labels || ['Baik (3)', 'Sangat Baik (4)'],
          datasets: [
            {
              label: 'Rata-rata Gaji',
              data: stats.map(stat => stat.mean),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'Median Gaji',
              data: stats.map(stat => stat.median),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            }
          ],
        };

        // Simpan stats untuk ditampilkan
        setProcessedData({ barData, stats });
        setLoading(false);
      } catch (error) {
        console.error('Error processing box plot data:', error);
        setLoading(false);
      }
    };

    // Delay sedikit untuk memastikan komponen sudah mounted
    const timer = setTimeout(processBoxPlotData, 100);
    return () => clearTimeout(timer);
  }, [chartData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Memproses data box plot...</p>
        </div>
      </div>
    );
  }

  if (!processedData) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-600">Data box plot tidak tersedia</p>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Hubungan Kinerja dan Gaji (Rata-rata & Median)',
        font: { size: 18 },
      },
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const index = context.dataIndex;
            const stat = processedData.stats[index];
            return [
              `Min: $${stat.min.toLocaleString()}`,
              `Q1: $${stat.q1.toLocaleString()}`,
              `Median: $${stat.median.toLocaleString()}`,
              `Q3: $${stat.q3.toLocaleString()}`,
              `Max: $${stat.max.toLocaleString()}`,
              `Mean: $${stat.mean.toLocaleString()}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Gaji Bulanan (USD)'
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Rating Kinerja'
        }
      }
    }
  };

  return (
    <div>
      <div style={{ height: '400px' }}>
        <Bar data={processedData.barData} options={options} />
      </div>
      
      {/* Tampilkan statistik detail */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {processedData.stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">
              {chartData.labels[index]} - Statistik Detail
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Minimum: <span className="font-medium">${stat.min.toLocaleString()}</span></div>
              <div>Q1: <span className="font-medium">${stat.q1.toLocaleString()}</span></div>
              <div>Median: <span className="font-medium">${stat.median.toLocaleString()}</span></div>
              <div>Q3: <span className="font-medium">${stat.q3.toLocaleString()}</span></div>
              <div>Maximum: <span className="font-medium">${stat.max.toLocaleString()}</span></div>
              <div>Mean: <span className="font-medium">${stat.mean.toLocaleString()}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxPlotChart;