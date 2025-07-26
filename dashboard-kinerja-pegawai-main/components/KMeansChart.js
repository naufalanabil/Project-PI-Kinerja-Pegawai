import { Scatter } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

// Fungsi untuk menghitung jarak Euclidean
const euclideanDistance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
};

// Algoritma K-Means
const kmeans = (data, k = 3, maxIterations = 100) => {
  if (data.length === 0) return { clusters: [], centroids: [] };

  // Inisialisasi centroid secara random
  const centroids = [];
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * data.length);
    centroids.push({ ...data[randomIndex] });
  }

  let clusters = [];
  let iteration = 0;

  while (iteration < maxIterations) {
    // Assign setiap point ke cluster terdekat
    clusters = Array(k).fill().map(() => []);
    
    data.forEach(point => {
      let minDistance = Infinity;
      let closestCentroid = 0;
      
      centroids.forEach((centroid, index) => {
        const distance = euclideanDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = index;
        }
      });
      
      clusters[closestCentroid].push(point);
    });

    // Update centroids
    let centroidsChanged = false;
    centroids.forEach((centroid, index) => {
      if (clusters[index].length > 0) {
        const newCentroid = {
          x: clusters[index].reduce((sum, point) => sum + point.x, 0) / clusters[index].length,
          y: clusters[index].reduce((sum, point) => sum + point.y, 0) / clusters[index].length
        };
        
        if (Math.abs(newCentroid.x - centroid.x) > 0.001 || 
            Math.abs(newCentroid.y - centroid.y) > 0.001) {
          centroidsChanged = true;
        }
        
        centroids[index] = newCentroid;
      }
    });

    if (!centroidsChanged) break;
    iteration++;
  }

  return { clusters, centroids, iterations: iteration };
};

const KMeansChart = ({ chartData }) => {
  const [clusterData, setClusterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kValue, setKValue] = useState(3);

  useEffect(() => {
    const processKMeansData = () => {
      try {
        if (!chartData || !chartData.rawData || chartData.rawData.length === 0) {
          setLoading(false);
          return;
        }

        // Siapkan data untuk clustering (JobSatisfaction vs MonthlyIncome)
        const points = chartData.rawData.map(row => ({
          x: row.JobSatisfaction,
          y: row.MonthlyIncome,
          department: row.Department,
          performance: row.PerformanceRating
        }));

        // Jalankan K-Means
        const result = kmeans(points, kValue);
        
        // Siapkan data untuk Chart.js
        const colors = [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ];

        const datasets = result.clusters.map((cluster, index) => ({
          label: `Cluster ${index + 1}`,
          data: cluster,
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length].replace('0.6', '1'),
          borderWidth: 1,
          pointRadius: 4,
        }));

        // Tambahkan centroids
        datasets.push({
          label: 'Centroids',
          data: result.centroids,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 2,
          pointRadius: 8,
          pointStyle: 'cross'
        });

        setClusterData({
          datasets,
          clusters: result.clusters,
          centroids: result.centroids,
          iterations: result.iterations
        });
        setLoading(false);
      } catch (error) {
        console.error('Error processing K-Means data:', error);
        setLoading(false);
      }
    };

    processKMeansData();
  }, [chartData, kValue]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Memproses K-Means clustering...</p>
        </div>
      </div>
    );
  }

  if (!clusterData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">Data clustering tidak tersedia</p>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `K-Means Clustering: Kepuasan Kerja vs Gaji (K=${kValue})`,
        font: { size: 18 },
      },
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return context[0].dataset.label;
          },
          label: function(context) {
            const point = context.raw;
            return [
              `Kepuasan: ${point.x}`,
              `Gaji: $${point.y?.toLocaleString() || 'N/A'}`,
              `Dept: ${point.department || 'N/A'}`,
              `Performance: ${point.performance || 'N/A'}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Job Satisfaction (1-4)'
        },
        min: 0.5,
        max: 4.5,
        ticks: {
          stepSize: 1
        }
      },
      y: {
        title: {
          display: true,
          text: 'Monthly Income (USD)'
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div>
      {/* Kontrol K Value */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium">Jumlah Cluster (K):</label>
        <select 
          value={kValue} 
          onChange={(e) => setKValue(parseInt(e.target.value))}
          className="border rounded px-3 py-1"
        >
          {[2, 3, 4, 5].map(k => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <span className="text-sm text-gray-600">
          Konvergen dalam {clusterData.iterations} iterasi
        </span>
      </div>

      {/* Scatter Plot */}
      <div style={{ height: '500px' }}>
        <Scatter data={clusterData} options={options} />
      </div>
      
      {/* Analisis Cluster */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusterData.clusters.map((cluster, index) => {
          if (cluster.length === 0) return null;
          
          const avgSatisfaction = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length;
          const avgIncome = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length;
          const deptCounts = cluster.reduce((acc, p) => {
            acc[p.department] = (acc[p.department] || 0) + 1;
            return acc;
          }, {});
          const topDept = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0];
          
          return (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                Cluster {index + 1} ({cluster.length} pegawai)
              </h4>
              <div className="text-sm space-y-1">
                <div>Rata-rata Kepuasan: <span className="font-medium">{avgSatisfaction.toFixed(1)}</span></div>
                <div>Rata-rata Gaji: <span className="font-medium">${avgIncome.toLocaleString()}</span></div>
                <div>Departemen Dominan: <span className="font-medium">{topDept?.[0]} ({topDept?.[1]})</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KMeansChart;