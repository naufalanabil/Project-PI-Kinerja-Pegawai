import { Pie } from 'react-chartjs-2';

// Registrasi Chart.js sekarang ditangani secara terpusat di _app.js

const PieChart = ({ chartData }) => {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Persentase',
        data: chartData.data,
        backgroundColor: ['#E67E22', '#F1C40F', '#2ECC71', '#3498DB'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Tingkat Kepuasan Kerja Karyawan',
        font: { size: 18 },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
