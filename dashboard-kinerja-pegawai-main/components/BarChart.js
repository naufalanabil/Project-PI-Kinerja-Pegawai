import { Bar } from 'react-chartjs-2';

// Registrasi Chart.js sekarang ditangani secara terpusat di _app.js

const BarChart = ({ chartData }) => {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Jumlah Karyawan',
        data: chartData.data,
        backgroundColor: ['#4A55A2', '#7895CB', '#A0BFE0'],
        borderColor: '#FFFFFF',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribusi Karyawan per Departemen',
        font: { size: 18 },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
