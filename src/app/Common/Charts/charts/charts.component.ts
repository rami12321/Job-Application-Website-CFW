import { Component, OnInit, inject } from '@angular/core';
import { YouthServiceService } from '../../../Services/YouthService/youth-service.service';
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { EmployerService } from '../../../Services/employer-service/employer-services.service';
import { JobRequestService } from '../../../Services/JobRequestService/job-request-service.service';

@Component({
  standalone: true,
  selector: 'app-youth-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class YouthChartComponent implements OnInit {
  private youthService = inject(YouthServiceService);
  private jobRequestService = inject(JobRequestService);

  constructor() {
    // Register required Chart.js components
    Chart.register(
      PieController,
      ArcElement,
      Tooltip,
      Legend,
      BarController,
      LineController,
      CategoryScale,
      LinearScale,
      BarElement,
      LineElement,
      PointElement
    );
  }

  private shortenEducationLevel(level: string): string {
    if (level.includes('University')) {
      return 'University Degree';
    } else if (level.includes('Short Term Course')) {
      return 'Short Term Course';
    } else if (level.includes('Technical Baccalaureate')) {
      return 'Technical Baccalaureate';
    } else if (level.includes('Higher Technical Degree')) {
      return 'Higher Technical Degree';
    } else {
      return level; // Fallback to original level if no match
    }
  }
  ngOnInit() {
    this.youthService.getAllYouth().subscribe((youths) => {
      const totalYouths = youths.length;
      const createdAtData = this.getCreatedAtDistribution(youths);
      const sortedDates = Object.keys(createdAtData).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
      const sortedCounts = sortedDates.map((date) => createdAtData[date]);

      // Map original education levels to shortened ones
      const shortenedEducationLevels = youths.map((youth) => ({
        ...youth,
        educationLevel: this.shortenEducationLevel(youth.educationLevel),
      }));

      // Gender Distribution
      const genderData = this.getDistribution(youths, 'gender');
      const genderPercentages = this.getPercentageDistribution(
        Object.values(genderData),
        totalYouths
      );

      // Nationality Distribution
      const nationalityData = this.getDistribution(youths, 'nationality');
      const nationalityPercentages = this.getPercentageDistribution(
        Object.values(nationalityData),
        totalYouths
      );
      const ageData = this.getAgeDistribution(youths);
      const agePercentage = this.getPercentageDistribution(
        Object.values(ageData),
        totalYouths
      );
      const educationLevelData = this.getDistribution(
        shortenedEducationLevels,
        'educationLevel'
      );
      const educationLevelPercentage = this.getPercentageDistribution(
        Object.values(educationLevelData),
        totalYouths
      );

      // Area Distribution
      const areaData = this.getDistribution(youths, 'area');
      const areaPercentages = this.getPercentageDistribution(
        Object.values(areaData),
        totalYouths
      );

      // Beneficiary Distribution
      const beneficiaryData = this.getDistribution(youths, 'beneficiary');
      const beneficiaryPercentages = this.getPercentageDistribution(
        Object.values(beneficiaryData),
        totalYouths
      );

      // Job Opportunity Source Distribution
      const jobSourceData = this.getDistribution(
        youths,
        'jobOpportunitySource'
      );
      const jobSourcePercentages = this.getPercentageDistribution(
        Object.values(jobSourceData),
        totalYouths
      );

      // Create Charts
      this.createPieChart('genderChart', {
        labels: this.appendPercentagesToLabels(
          Object.keys(genderData),
          genderPercentages
        ),
        datasets: [
          {
            label: 'Gender Distribution',
            data: Object.values(genderData),
            backgroundColor: ['#FF6384', '#36A2EB'],
          },
        ],
      });
      this.createBarChart('ageChart', {
        labels: this.appendPercentagesToLabels(
          Object.keys(ageData),
          agePercentage
        ),
        datasets: [
          {
            label: 'Age Distribution',
            data: Object.values(ageData),
            backgroundColor: ['#FF6384', '#36A2EB'],
          },
        ],
      });
      this.createPieChart('educationLevelChart', {
        labels: this.appendPercentagesToLabels(
          Object.keys(educationLevelData),
          educationLevelPercentage
        ),
        datasets: [
          {
            label: 'EducationLevel Distribution',
            data: Object.values(educationLevelData),
            backgroundColor: ['#FF6384', '#36A2EB', '#9966FF', '#36A2EB'],
          },
        ],
      });

      this.createBarChart('nationalityChart', {
        labels: this.appendPercentagesToLabels(
          Object.keys(nationalityData),
          nationalityPercentages
        ),
        datasets: [
          {
            label: 'Nationality Distribution',
            data: Object.values(nationalityData),
            backgroundColor: ['#FFCE56', '#4BC0C0', '#9966FF', '#36A2EB'],
          },
        ],
      });

      this.createBarChart('areaChart', {
        labels: this.appendPercentagesToLabels(
          Object.keys(areaData),
          areaPercentages
        ),
        datasets: [
          {
            label: 'Area Distribution',
            data: Object.values(areaData),
            backgroundColor: '#9966FF',
          },
        ],
      });



      this.createPieChart('beneficiaryChart', {
        labels: this.appendPercentagesToLabels(
          Object.keys(beneficiaryData),
          beneficiaryPercentages
        ),
        datasets: [
          {
            label: 'Beneficiary Distribution',
            data: Object.values(beneficiaryData),
            backgroundColor: ['#36A2EB', '#9966FF', '#FF6384'],
          },
        ],
      });

      this.createBarChart('jobSourceChart', {
        labels: this.appendPercentagesToLabels(
          Object.keys(jobSourceData),
          jobSourcePercentages
        ),
        datasets: [
          {
            label: 'Job Opportunity Source Distribution',
            data: Object.values(jobSourceData),
            backgroundColor: '#FFCE56',
          },
        ],
      });

      this.createLineChart('createdAtChart', {
        labels: sortedDates,
        datasets: [
          {
            label: 'Youths Created Over Time',
            data: sortedCounts,
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.4, // Smoother lines
          },
        ],
      });
    });

    this.jobRequestService.getAllJobs().subscribe((jobs) => {
      const totalJobs = jobs.length;

      // Category Distribution
      const categoryData = this.getDistribution(jobs, 'category');
      const categoryPercentages = this.getPercentageDistribution(
        Object.values(categoryData),
        totalJobs
      );

      this.createPieChart('categoryChart', {
        labels: this.appendPercentagesToLabels(
          Object.keys(categoryData),
          categoryPercentages
        ),
        datasets: [
          {
            label: 'Category Distribution',
            data: Object.values(categoryData),
            backgroundColor: [
              '#4BC0C0', '#FF6384', '#FFCE56', '#36A2EB', '#FF9F40', '#FFCD56',
              '#4BC0C0', '#F1A7C4', '#5A9EC9', '#A1C6D6', '#D1A4F7', '#FF77A9'
            ]
                      },
        ],
      });
    });
  }

  // Generic method to get distribution
  private getDistribution(
    youths: any[],
    field: string
  ): Record<string, number> {
    return youths.reduce((acc, youth) => {
      acc[youth[field]] = (acc[youth[field]] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getCreatedAtDistribution(youths: any[]): { [key: string]: number } {
    const distribution: { [key: string]: number } = {};
    youths.forEach((youth) => {
      const date = new Date(youth.createdAt).toLocaleDateString();
      distribution[date] = (distribution[date] || 0) + 1;
    });
    return distribution;
  }

  private getAgeDistribution(youths: any[]): Record<string, number> {
    const currentYear = new Date().getFullYear();
    return youths.reduce((acc, youth) => {
      const birthYear = new Date(youth.dob).getFullYear(); // Assuming dob is the date of birth
      const age = currentYear - birthYear;
      const ageGroup = this.getAgeGroup(age); // Get age group (e.g., 18-20, 21-23, etc.)
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getAgeGroup(age: number): string {
    const lowerLimit = Math.floor(age / 2) * 2; // Round down to nearest even number
    const upperLimit = lowerLimit + 2; // Set upper limit for 2-year range
    return `${lowerLimit}-${upperLimit}`;
  }

  private getPercentageDistribution(values: number[], total: number): number[] {
    return values.map((value) =>
      parseFloat(((value / total) * 100).toFixed(1))
    ); // Convert to number after formatting
  }

  private appendPercentagesToLabels(
    labels: string[],
    percentages: number[]
  ): string[] {
    return labels.map((label, index) => `${label} (${percentages[index]}%)`);
  }

  private createPieChart(canvasId: string, chartData: any) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie', // Use 'pie' type for gender and education distribution
      data: chartData,
    });
  }

  private createBarChart(canvasId: string, chartData: any) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar', // Use 'bar' type for age distribution
      data: chartData,
    });
  }
  private createLineChart(canvasId: string, chartData: any) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Youths',
            },
          },
        },
      },
    });
  }
}
