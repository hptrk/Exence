import { ChartConfiguration } from 'chart.js';

export const createCustomBackgroundPlugin = (isDarkTheme: boolean) => ({
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart: any, args: any, options: any) => {
    const { ctx } = chart;
    const radius = 30; // Border radius
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = isDarkTheme ? '#151828' : '#fff4f0';

    // Draw rounded rectangle
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(chart.width - radius, 0);
    ctx.quadraticCurveTo(chart.width, 0, chart.width, radius);
    ctx.lineTo(chart.width, chart.height - radius);
    ctx.quadraticCurveTo(
      chart.width,
      chart.height,
      chart.width - radius,
      chart.height
    );
    ctx.lineTo(radius, chart.height);
    ctx.quadraticCurveTo(0, chart.height, 0, chart.height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
});

export const getLineChartData = (data: number[], labels: string[]) => ({
  labels,
  datasets: [
    {
      data,
      backgroundColor: 'rgba(222, 222, 247, 0.2)',
      borderColor: '#C9C9F2',
      pointBackgroundColor: '#C9C9F2',
      pointBorderColor: '#C9C9F2',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#C9C9F2',
      fill: 'origin',
      borderWidth: 4,
    },
  ],
});

export const lineChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: { top: 30, left: 30, right: 30, bottom: 30 },
  },
  animations: {
    tension: {
      duration: 2000,
    },
    backgroundColor: {
      duration: 0,
    },
  },
  elements: {
    line: {
      tension: 0.3, // Smoothen the line
    },
  },
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      display: false, // Hide X-axis labels
    },
    y: {
      ticks: {},
      beginAtZero: true,
    },
  },
};
