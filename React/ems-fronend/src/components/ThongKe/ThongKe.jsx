
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getThongKeDT, getThongKeLP, getThongKeDV } from '../../services/ThanhToanService';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Typography } from '@mui/joy';
// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Import CSS file riêng
import './ThongKe.css';

const ThongKe = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('month'); // Chế độ xem cho biểu đồ doanh thu
  const [roomViewMode, setRoomViewMode] = useState('month'); // Chế độ xem cho loại phòng
  const [serviceViewMode, setServiceViewMode] = useState('month'); // Chế độ xem cho dịch vụ
  const [selectedRoomMonth, setSelectedRoomMonth] = useState('');
  const [selectedRoomYear, setSelectedRoomYear] = useState('');
  const [selectedServiceMonth, setSelectedServiceMonth] = useState('');
  const [selectedServiceYear, setSelectedServiceYear] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const [revenueResponse, roomTypeResponse, serviceResponse] = await Promise.all([
        getThongKeDT(),
        getThongKeLP(),
        getThongKeDV(),
      ]);
      console.log('Room types data:', roomTypeResponse.data);
      console.log('Services data:', serviceResponse.data);
      setStats(revenueResponse.data);
      setRoomTypes(roomTypeResponse.data);
      setServices(serviceResponse.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return <div className="loading">Loading...</div>;

  if (!stats || stats.length === 0) return <div className="no-data">No data available</div>;

  // Nhóm dữ liệu doanh thu dựa trên viewMode (cho biểu đồ cột)
  const groupedStats = stats.reduce((acc, row) => {
    const year = row[0];
    const month = row[1];
    const key = viewMode === 'month' ? `${month}/${year}` : `${year}`;

    if (!acc[key]) {
      acc[key] = {
        label: key,
        totalPayment: 0,
        roomRevenue: 0,
        serviceRevenue: 0,
        surcharge: 0,
      };
    }
    acc[key].totalPayment += row[2] || 0;
    acc[key].roomRevenue += row[3] || 0;
    acc[key].serviceRevenue += row[4] || 0;
    acc[key].surcharge += row[5] || 0;
    return acc;
  }, {});

  const chartDataArray = Object.values(groupedStats);
  const labels = chartDataArray.map(item => item.label);
  const totalPaymentData = chartDataArray.map(item => item.totalPayment);
  const roomRevenueData = chartDataArray.map(item => item.roomRevenue);
  const serviceRevenueData = chartDataArray.map(item => item.serviceRevenue);
  const surchargeData = chartDataArray.map(item => item.surcharge);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Tổng tiền',
        data: totalPaymentData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tổng tiền phòng',
        data: roomRevenueData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tổng tiền dịch vụ',
        data: serviceRevenueData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tổng tiền phụ thu',
        data: surchargeData,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          boxWidth: 20,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toLocaleString()} VND`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString() + ' VND';
          },
        },
      },
    },
  };

  // Dữ liệu cho biểu đồ tổng hợp loại phòng (không phân loại thời gian)
  const getTotalPieChartData = () => {
    const groupedData = roomTypes.reduce((acc, row) => {
      const roomType = row[2];
      const count = row[3];
      if (!acc[roomType]) {
        acc[roomType] = 0;
      }
      acc[roomType] += count || 0;
      return acc;
    }, {});

    const chartData = Object.entries(groupedData).map(([roomType, count]) => [roomType, count]);

    return {
      label: 'Tổng hợp',
      data: {
        labels: chartData.map(item => item[0]),
        datasets: [
          {
            label: 'Số lượng phòng',
            data: chartData.map(item => item[1]),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      hasData: chartData.length > 0,
    };
  };

  // Dữ liệu cho biểu đồ loại phòng
  const getPieChartData = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const periods = [];

    if (selectedRoomYear && !selectedRoomMonth) {
      // Nếu chỉ chọn năm, hiển thị dữ liệu của cả năm đó
      periods.push({
        year: parseInt(selectedRoomYear),
        label: `Năm ${selectedRoomYear}`,
      });
    } else if (selectedRoomMonth && selectedRoomYear) {
      // Nếu chọn cả tháng và năm, hiển thị dữ liệu của tháng đó
      periods.push({
        year: parseInt(selectedRoomYear),
        month: parseInt(selectedRoomMonth),
        label: `Tháng ${selectedRoomMonth}/${selectedRoomYear}`,
      });
    } else {
      // Nếu không chọn, hiển thị 3 khoảng thời gian gần nhất
      if (roomViewMode === 'month') {
        for (let i = 2; i >= 0; i--) {
          let month = currentMonth - i;
          let year = currentYear;
          if (month <= 0) {
            month += 12;
            year -= 1;
          }
          periods.push({ year, month, label: `Tháng ${month}/${year}` });
        }
      } else {
        for (let i = 2; i >= 0; i--) {
          const year = currentYear - i;
          periods.push({ year, label: `Năm ${year}` });
        }
      }
    }

    return periods.map(period => {
      const filteredData = roomTypes.filter(row => {
        const rowYear = row[0];
        const rowMonth = row[1];
        if (selectedRoomYear && !selectedRoomMonth) {
          return rowYear === period.year;
        } else if (selectedRoomMonth && selectedRoomYear) {
          return rowYear === period.year && rowMonth === period.month;
        }
        if (roomViewMode === 'month') {
          return rowYear === period.year && rowMonth === period.month;
        } else {
          return rowYear === period.year;
        }
      });

      const groupedData = filteredData.reduce((acc, row) => {
        const roomType = row[2];
        const count = row[3];
        if (!acc[roomType]) {
          acc[roomType] = 0;
        }
        acc[roomType] += count || 0;
        return acc;
      }, {});

      const chartData = Object.entries(groupedData).map(([roomType, count]) => [roomType, count]);

      return {
        label: period.label,
        data: {
          labels: chartData.map(item => item[0]),
          datasets: [
            {
              label: 'Số lượng phòng',
              data: chartData.map(item => item[1]),
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        hasData: chartData.length > 0,
      };
    });
  };

  // Dữ liệu cho biểu đồ tổng hợp dịch vụ (không phân loại thời gian)
  const getTotalServicePieChartData = () => {
    const groupedData = services.reduce((acc, row) => {
      const serviceName = row[2];
      const count = row[3];
      if (serviceName && !isNaN(count)) {
        if (!acc[serviceName]) {
          acc[serviceName] = 0;
        }
        acc[serviceName] += count || 0;
      }
      return acc;
    }, {});

    let chartData = Object.entries(groupedData).sort((a, b) => b[1] - a[1]);
    const top5 = chartData.slice(0, 5);
    const others = chartData.slice(5);
    const othersTotal = others.reduce((sum, [, count]) => sum + count, 0);

    if (others.length > 0) {
      top5.push(['Các dịch vụ khác', othersTotal]);
    }

    return {
      label: 'Tổng hợp',
      data: {
        labels: top5.map(item => item[0]),
        datasets: [
          {
            label: 'Số lượng sử dụng',
            data: top5.map(item => item[1]),
            backgroundColor: [
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(201, 203, 207, 0.6)',
            ],
            borderColor: [
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(201, 203, 207, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      hasData: top5.length > 0,
    };
  };

  // Dữ liệu cho biểu đồ dịch vụ
  const getServicePieChartData = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const periods = [];

    if (selectedServiceYear && !selectedServiceMonth) {
      // Nếu chỉ chọn năm, hiển thị dữ liệu của cả năm đó
      periods.push({
        year: parseInt(selectedServiceYear),
        label: `Năm ${selectedServiceYear}`,
      });
    } else if (selectedServiceMonth && selectedServiceYear) {
      // Nếu chọn cả tháng và năm, hiển thị dữ liệu của tháng đó
      periods.push({
        year: parseInt(selectedServiceYear),
        month: parseInt(selectedServiceMonth),
        label: `Tháng ${selectedServiceMonth}/${selectedServiceYear}`,
      });
    } else {
      // Nếu không chọn, hiển thị 3 khoảng thời gian gần nhất
      if (serviceViewMode === 'month') {
        for (let i = 2; i >= 0; i--) {
          let month = currentMonth - i;
          let year = currentYear;
          if (month <= 0) {
            month += 12;
            year -= 1;
          }
          periods.push({ year, month, label: `Tháng ${month}/${year}` });
        }
      } else {
        for (let i = 2; i >= 0; i--) {
          const year = currentYear - i;
          periods.push({ year, label: `Năm ${year}` });
        }
      }
    }

    return periods.map(period => {
      const filteredData = services.filter(row => {
        const rowYear = row[0];
        const rowMonth = row[1];
        if (selectedServiceYear && !selectedServiceMonth) {
          return rowYear === period.year;
        } else if (selectedServiceMonth && selectedServiceYear) {
          return rowYear === period.year && rowMonth === period.month;
        }
        if (serviceViewMode === 'month') {
          return rowYear === period.year && rowMonth === period.month;
        } else {
          return rowYear === period.year;
        }
      });

      const groupedData = filteredData.reduce((acc, row) => {
        const serviceName = row[2];
        const count = row[3];
        if (serviceName && !isNaN(count)) {
          if (!acc[serviceName]) {
            acc[serviceName] = 0;
          }
          acc[serviceName] += count || 0;
        }
        return acc;
      }, {});

      let chartData = Object.entries(groupedData).sort((a, b) => b[1] - a[1]);
      const top5 = chartData.slice(0, 5);
      const others = chartData.slice(5);
      const othersTotal = others.reduce((sum, [, count]) => sum + count, 0);

      if (others.length > 0) {
        top5.push(['Các dịch vụ khác', othersTotal]);
      }

      return {
        label: period.label,
        data: {
          labels: top5.map(item => item[0]),
          datasets: [
            {
              label: 'Số lượng sử dụng',
              data: top5.map(item => item[1]),
              backgroundColor: [
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(201, 203, 207, 0.6)',
              ],
              borderColor: [
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(201, 203, 207, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        hasData: top5.length > 0,
      };
    });
  };

  const totalPieChart = getTotalPieChartData();
  const pieCharts = getPieChartData();
  const totalServicePieChart = getTotalServicePieChartData();
  const servicePieCharts = getServicePieChartData();

  const getRoomLegend = () => {
    const chart = totalPieChart;
    if (chart && chart.data && chart.data.datasets && chart.data.datasets.length > 0) {
      const dataset = chart.data.datasets[0];
      return dataset.data.map((value, index) => ({
        label: chart.data.labels[index] || `Loại phòng ${index + 1}`,
        color: dataset.backgroundColor[index % dataset.backgroundColor.length],
      }));
    }
    return [];
  };

  const getServiceLegend = () => {
    const chart = totalServicePieChart;
    if (chart && chart.data && chart.data.datasets && chart.data.datasets.length > 0) {
      const dataset = chart.data.datasets[0];
      return dataset.data.map((value, index) => ({
        label: chart.data.labels[index] || `Dịch vụ ${index + 1}`,
        color: dataset.backgroundColor[index % dataset.backgroundColor.length],
      }));
    }
    return [];
  };

  const roomLegendItems = getRoomLegend();
  const serviceLegendItems = getServiceLegend();

  const pieOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        align: 'center',
        font: {
          size: 14,
        },
        padding: {
          top: 5,
          bottom: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  });

  // Lấy danh sách năm duy nhất từ dữ liệu
  const roomYears = [...new Set(roomTypes.map(row => row[0]))].sort((a, b) => b - a);
  const serviceYears = [...new Set(services.map(row => row[0]))].sort((a, b) => b - a);

  // Hàm định dạng số tiền
  const formatCurrency = (value) => {
    return value ? value.toLocaleString('vi-VN') + ' VND' : '0 VND';
  };

  // Hàm xuất Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1. Sheet Doanh thu
    const revenueData = [];
    const years = [...new Set(stats.map(row => row[0]))].sort((a, b) => a - b);

    // Tổng hợp tất cả các năm
    const totalRevenue = stats.reduce((acc, row) => {
      acc.totalPayment = (acc.totalPayment || 0) + (row[2] || 0);
      acc.roomRevenue = (acc.roomRevenue || 0) + (row[3] || 0);
      acc.serviceRevenue = (acc.serviceRevenue || 0) + (row[4] || 0);
      acc.surcharge = (acc.surcharge || 0) + (row[5] || 0);
      return acc;
    }, {});
    revenueData.push(['Thống kê doanh thu - Tổng hợp']);
    revenueData.push(['', 'Tổng', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']);
    revenueData.push(['Tổng tiền', formatCurrency(totalRevenue.totalPayment), ...Array(12).fill('')]);
    revenueData.push(['Tổng tiền phòng', formatCurrency(totalRevenue.roomRevenue), ...Array(12).fill('')]);
    revenueData.push(['Tổng tiền dịch vụ', formatCurrency(totalRevenue.serviceRevenue), ...Array(12).fill('')]);
    revenueData.push(['Tổng tiền phụ thu', formatCurrency(totalRevenue.surcharge), ...Array(12).fill('')]);
    revenueData.push([]);

    // Dữ liệu theo từng năm
    years.forEach(year => {
      const yearData = stats.filter(row => row[0] === year);
      const yearTotal = yearData.reduce((acc, row) => {
        acc.totalPayment = (acc.totalPayment || 0) + (row[2] || 0);
        acc.roomRevenue = (acc.roomRevenue || 0) + (row[3] || 0);
        acc.serviceRevenue = (acc.serviceRevenue || 0) + (row[4] || 0);
        acc.surcharge = (acc.surcharge || 0) + (row[5] || 0);
        return acc;
      }, {});
      const monthData = Array(12).fill(0).map((_, month) => {
        const monthStats = yearData.filter(row => row[1] === month + 1);
        return monthStats.reduce((acc, row) => ({
          totalPayment: (acc.totalPayment || 0) + (row[2] || 0),
          roomRevenue: (acc.roomRevenue || 0) + (row[3] || 0),
          serviceRevenue: (acc.serviceRevenue || 0) + (row[4] || 0),
          surcharge: (acc.surcharge || 0) + (row[5] || 0),
        }), {});
      });

      revenueData.push([`Thống kê doanh thu - Năm ${year}`]);
      revenueData.push(['', 'Tổng', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']);
      revenueData.push(['Tổng tiền', formatCurrency(yearTotal.totalPayment), ...monthData.map(m => formatCurrency(m.totalPayment))]);
      revenueData.push(['Tổng tiền phòng', formatCurrency(yearTotal.roomRevenue), ...monthData.map(m => formatCurrency(m.roomRevenue))]);
      revenueData.push(['Tổng tiền dịch vụ', formatCurrency(yearTotal.serviceRevenue), ...monthData.map(m => formatCurrency(m.serviceRevenue))]);
      revenueData.push(['Tổng tiền phụ thu', formatCurrency(yearTotal.surcharge), ...monthData.map(m => formatCurrency(m.surcharge))]);
      revenueData.push([]);
    });

    const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);
    XLSX.utils.book_append_sheet(wb, revenueSheet, 'Doanh thu');

    // 2. Sheet Loại phòng
    const roomData = [];
    const roomTypesList = [...new Set(roomTypes.map(row => row[2]))];

    // Tổng hợp tất cả các năm
    const totalRoomData = roomTypes.reduce((acc, row) => {
      const roomType = row[2];
      const count = row[3];
      if (!acc[roomType]) {
        acc[roomType] = 0;
      }
      acc[roomType] += count || 0;
      return acc;
    }, {});
    roomData.push(['Thống kê loại phòng - Tổng hợp']);
    roomData.push(['', 'Tổng', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']);
    roomTypesList.forEach(roomType => {
      roomData.push([roomType, totalRoomData[roomType] || 0, ...Array(12).fill('')]);
    });
    roomData.push([]);

    roomYears.forEach(year => {
      const yearData = roomTypes.filter(row => row[0] === year);
      const yearTotal = yearData.reduce((acc, row) => {
        const roomType = row[2];
        const count = row[3];
        if (!acc[roomType]) {
          acc[roomType] = 0;
        }
        acc[roomType] += count || 0;
        return acc;
      }, {});
      const monthData = Array(12).fill(0).map((_, month) => {
        const monthStats = yearData.filter(row => row[1] === month + 1);
        return monthStats.reduce((acc, row) => {
          const roomType = row[2];
          const count = row[3];
          if (!acc[roomType]) {
            acc[roomType] = 0;
          }
          acc[roomType] += count || 0;
          return acc;
        }, {});
      });

      roomData.push([`Thống kê loại phòng - Năm ${year}`]);
      roomData.push(['', 'Tổng', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']);
      roomTypesList.forEach(roomType => {
        roomData.push([roomType, yearTotal[roomType] || 0, ...Array(12).fill(0).map((_, i) => monthData[i][roomType] || 0)]);
      });
      roomData.push([]);
    });

    const roomSheet = XLSX.utils.aoa_to_sheet(roomData);
    XLSX.utils.book_append_sheet(wb, roomSheet, 'Loại phòng');

    // 3. Sheet Dịch vụ
    const serviceData = [];
    const serviceNames = [...new Set(services.map(row => row[2]))];

    // Tổng hợp tất cả các năm
    const totalServiceData = services.reduce((acc, row) => {
      const serviceName = row[2];
      const count = row[3];
      if (serviceName && !isNaN(count)) {
        if (!acc[serviceName]) {
          acc[serviceName] = 0;
        }
        acc[serviceName] += count || 0;
      }
      return acc;
    }, {});
    serviceData.push(['Thống kê dịch vụ - Tổng hợp']);
    serviceData.push(['', 'Tổng', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']);
    serviceNames.forEach(serviceName => {
      serviceData.push([serviceName, totalServiceData[serviceName] || 0, ...Array(12).fill('')]);
    });
    serviceData.push([]);

    serviceYears.forEach(year => {
      const yearData = services.filter(row => row[0] === year);
      const yearTotal = yearData.reduce((acc, row) => {
        const serviceName = row[2];
        const count = row[3];
        if (serviceName && !isNaN(count)) {
          if (!acc[serviceName]) {
            acc[serviceName] = 0;
          }
          acc[serviceName] += count || 0;
        }
        return acc;
      }, {});
      const monthData = Array(12).fill(0).map((_, month) => {
        const monthStats = yearData.filter(row => row[1] === month + 1);
        return monthStats.reduce((acc, row) => {
          const serviceName = row[2];
          const count = row[3];
          if (serviceName && !isNaN(count)) {
            if (!acc[serviceName]) {
              acc[serviceName] = 0;
            }
            acc[serviceName] += count || 0;
          }
          return acc;
        }, {});
      });

      serviceData.push([`Thống kê dịch vụ - Năm ${year}`]);
      serviceData.push(['', 'Tổng', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']);
      serviceNames.forEach(serviceName => {
        serviceData.push([serviceName, yearTotal[serviceName] || 0, ...Array(12).fill(0).map((_, i) => monthData[i][serviceName] || 0)]);
      });
      serviceData.push([]);
    });

    const serviceSheet = XLSX.utils.aoa_to_sheet(serviceData);
    XLSX.utils.book_append_sheet(wb, serviceSheet, 'Dịch vụ');

    // Xuất file Excel
    XLSX.writeFile(wb, 'ThongKe.xlsx');
  };

  return (
    <div className="thong-ke-container">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '20px',
        }}
      >
        <Typography
          color="primary"
          level="title-sm"
          variant="plain"
          sx={{ cursor: 'pointer' }}
          startDecorator={<DownloadIcon />}
          onClick={exportToExcel}
        >
          Xuất file Excel
        </Typography>
      </Box>
      <h2 className="pie-title1">Thống kê doanh thu</h2>
      <div>
        <p>
          Chế độ xem doanh thu:
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <option value="month">Theo tháng</option>
            <option value="year">Theo năm</option>
          </select>
        </p>
      </div>
      <Bar data={chartData} options={options} />
      <div className="pie-charts-container">
        <h2 className="pie-title">Thống kê loại phòng</h2>
        <div className="select-container">
          <div>
            <p>
              Chế độ xem loại phòng:
              <select value={roomViewMode} onChange={(e) => setRoomViewMode(e.target.value)}>
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
              </select>
              <select value={selectedRoomMonth} onChange={(e) => setSelectedRoomMonth(e.target.value)}>
                <option value="">Chọn tháng</option>
                {[...new Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select value={selectedRoomYear} onChange={(e) => {
                setSelectedRoomYear(e.target.value);
                setSelectedRoomMonth(''); // Reset tháng khi chọn năm
              }}>
                <option value="">Chọn năm</option>
                {roomYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </p>
          </div>
        </div>
        <div className="charts-wrapper">
          <div className="total-chart">
            {totalPieChart.hasData ? (
              <div>
                <Pie data={totalPieChart.data} options={pieOptions('Tổng hợp')} />
              </div>
            ) : (
              <div className="no-data">
                Không có dữ liệu tổng hợp
              </div>
            )}
          </div>
          <div className="chart-container">
            {pieCharts.map((chart, index) => (
              <div key={index} className="chart-item">
                {chart.hasData ? (
                  <div>
                    <Pie data={chart.data} options={pieOptions(chart.label)} />
                  </div>
                ) : (
                  <div className="no-data">
                    Không có dữ liệu cho {chart.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {roomLegendItems.length > 0 && (
          <div className="legend-container">
            {roomLegendItems.map((item, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="pie-charts-container">
        <h2 className="pie-title">Thống kê dịch vụ</h2>
        <div className="select-container">
          <div>
            <p>
              Chế độ xem dịch vụ:
              <select value={serviceViewMode} onChange={(e) => setServiceViewMode(e.target.value)}>
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
              </select>
              <select value={selectedServiceMonth} onChange={(e) => setSelectedServiceMonth(e.target.value)}>
                <option value="">Chọn tháng</option>
                {[...new Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select value={selectedServiceYear} onChange={(e) => {
                setSelectedServiceYear(e.target.value);
                setSelectedServiceMonth(''); // Reset tháng khi chọn năm
              }}>
                <option value="">Chọn năm</option>
                {serviceYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </p>
          </div>
        </div>
        <div className="charts-wrapper">
          <div className="total-chart">
            {totalServicePieChart.hasData ? (
              <div>
                <Pie data={totalServicePieChart.data} options={pieOptions('Tổng hợp')} />
              </div>
            ) : (
              <div className="no-data">
                Không có dữ liệu tổng hợp
              </div>
            )}
          </div>
          <div className="chart-container">
            {servicePieCharts.map((chart, index) => (
              <div key={index} className="chart-item">
                {chart.hasData ? (
                  <div>
                    <Pie data={chart.data} options={pieOptions(chart.label)} />
                  </div>
                ) : (
                  <div className="no-data">
                    Không có dữ liệu cho {chart.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {serviceLegendItems.length > 0 && (
          <div className="legend-container">
            {serviceLegendItems.map((item, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThongKe;