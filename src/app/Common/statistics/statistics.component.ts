import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  standalone:true,
})
export class StatisticsComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.loadCharts();
  }

  loadCharts() {
    // Bar Chart
    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
          {
            label: 'Jobs Applied',
            data: [10, 15, 7, 20, 25],
            backgroundColor: '#60A5FA',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });

    // Pie Chart
    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Job Opportunities', 'Trainings', 'Scholarships', 'Internships'],
        datasets: [
          {
            data: [30, 25, 20, 25],
            backgroundColor: ['#93C5FD', '#60A5FA', '#3B82F6', '#2563EB'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
    new Chart('beneficiaryChart', {
      type: 'doughnut',
      data: {
        labels: ['Youth (18-25)', 'Adults (26-30)'],
        datasets: [
          {
            data: [50, 30],
            backgroundColor: ['#F87171', '#4ADE80', '#60A5FA', '#FACC15', '#A78BFA']
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

}
