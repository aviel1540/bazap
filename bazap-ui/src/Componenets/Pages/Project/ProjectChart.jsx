/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import ReactApexChart from 'react-apexcharts';

const ProjectChart = (props) => {
  const { data } = props
  const { totalDevices, totalWaiting, totalInWork, totalFinished, TotalOut } = data;
  const calculatePercent = (fromValue, ofValue) => {
    let percent = 0;
    if (fromValue !== 0) {
      percent = (ofValue / fromValue) * 100;
      percent = Math.ceil(percent);
    }
    return percent;
  }
  const percentArray = [calculatePercent(totalDevices, totalWaiting), calculatePercent(totalDevices, totalInWork), calculatePercent(totalDevices, totalFinished), calculatePercent(totalDevices, TotalOut)];
  const chartData = {
    series: percentArray,
    options: {
      chart: {
        height: 300,
        type: 'pie',
        fontFamily: 'Rubik, sans-serif', // Replace 'Your Body Font' with the actual font name
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
            },
            total: {
              show: true,
              label: 'סה"כ מכשירים',
              formatter: function () {
                return totalDevices
              }
            }
          }
        }
      },
      labels: ['ממתין לעבודה', 'בעבודה', 'הסתיים', 'הוחזר'],
      dataLabels: {
        enabled: true,
        // formatter: function (val, opts) {
        //   return opts.w.globals.labels[opts.seriesIndex] + ": " + val
        // }
      },
      colors: ['#F1BC00', '#5014D0', '#009EF7', '#47BE7D'],
    },


  };

  return (
    <ReactApexChart options={chartData.options} series={chartData.series} type="pie" height={250} />
  );
}

export default ProjectChart;