import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardChartData } from '../../data';

@Component({
  selector: 'app-dashboard-cheque-chart',
  templateUrl: './dashboard-cheque-chart.component.html',
  styleUrls: ['./dashboard-cheque-chart.component.scss']
})
export class DashboardChequeChartComponent implements AfterViewInit {
  @Output() dataUpdated = new EventEmitter<any>();
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  barChartPlugins = [DataLabelsPlugin];
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 30,
        },
      },
      datalabels: {
        font: {
          size: 8,
        },
        formatter: (value:any) => {
          return value || '';
        },
      },
      tooltip: {
        callbacks: {
          label: (context:any) => {
            const value = context.raw;
            const formattedValue = value.toLocaleString(); // Convert to thousand separator format
            return `${context.label}: ${formattedValue} JOD`;

            // return `${context.label}: ${context.raw} JOD`;
          },
        },
      },
    },
    scales: {
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: (tickValue: string | number) => {
            if (typeof tickValue === 'number') {
              return tickValue >= 1000 ? `${tickValue / 1000}k` : tickValue;
            }
            return tickValue;
          }
        },
        border: {
          display: false,
        },
      },
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          padding: 20,
        },
      },
      x1: {
        grid: {
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };
  barChartData: ChartData<'bar'> = {
    labels: [
      '580k',
      '800k',
      '200k',
      '1M',
      '600k',
      '800k',
      '980k',
      '800k',
    ],
    datasets: [
      {
        data: [],
        label: 'PDC',
        datalabels: {
          color: '#FFFFFF',
        },
        backgroundColor: '#D9D9D9',
        borderColor: '#D9D9D9',
        borderSkipped: false,
        borderRadius: {
          topLeft: 32,
          topRight: 32,
          bottomLeft: 32,
          bottomRight: 32,
        },
        barThickness: this.getBarThickness(),
      },
      {
        data: [],
        label: 'Collected',
        datalabels: {
          color: '#FFFFFF',
        },
        backgroundColor: '#DC3545',
        borderColor: '#DC3545',
        borderSkipped: false,
        borderRadius: {
          topLeft: 32,
          topRight: 32,
          bottomLeft: 32,
          bottomRight: 32,
        },
        barThickness: this.getBarThickness(),
      },
    ],
  };
  selectedYearValue = new Date();
  data: any = {};
  constructor() { }
  ngAfterViewInit() {
    this.initChart();
  }
  onResize() {
    const barThickness = this.getBarThickness();
    this.barChartData.datasets[0].barThickness = barThickness;
    this.barChartData.datasets[1].barThickness = barThickness;
    if(this.chart)
      this.chart.update();
  }
  getBarThickness() {
    return window.innerWidth < 620 ? 14 : 32;
  }
  selectYearItem() {
    this.initChart();
  }

  private initChart() {
    const filter: any = {};
    if (this.selectedYearValue) {
      filter.year = this.selectedYearValue.getFullYear();
    } else {
      filter.year = new Date().getFullYear();
    }
    this.data = DashboardChartData;
    this.updateChart();
    // this.apiService.getPromissoryNotesPerYear(filter).subscribe((result) => {
    //   if (result?.isSuccess) {
    //     this.data = result.data || {};
    //     this.dataUpdated.emit(this.data);
    //   }
    //   this.updateChart();
    // });
  }

  private updateChart() {
    if (!this.chart) {
      return;
    }
    this.barChartData.datasets[0].data = [
      this.data?.january?.collected || 0,
      this.data?.february?.collected || 0,
      this.data?.march?.collected || 0,
      this.data?.april?.collected || 0,
      this.data?.may?.collected || 0,
      this.data?.june?.collected || 0,
      this.data?.july?.collected || 0,
      this.data?.august?.collected || 0
    ];
    this.barChartData.datasets[1].data = [
      this.data?.january?.uncollected || 0,
      this.data?.february?.uncollected || 0,
      this.data?.march?.uncollected || 0,
      this.data?.april?.uncollected || 0,
      this.data?.may?.uncollected || 0,
      this.data?.june?.uncollected || 0,
      this.data?.july?.uncollected || 0,
      this.data?.august?.uncollected || 0
    ];
    this.chart.update();
  }
}
