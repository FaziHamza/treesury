import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subject, debounceTime, distinctUntilChanged, takeUntil, forkJoin } from 'rxjs';
import { TableColumn, TableConfig } from 'src/app/shared/components/table-advanced';
import { DepositService } from 'src/app/shared/services/deposit.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { DashboardChartData } from '../../data';
import { csvExport } from 'src/app/utility/util';

@Component({
  selector: 'app-cheque-aging-report',
  templateUrl: './cheque-aging-report.component.html',
  styleUrls: ['./cheque-aging-report.component.scss']
})
export class ChequeAgingReportComponent {
  constructor(private depositService: DepositService) { }
  datepickerInput: any;
  amountchange = new FormControl(null);
  phonenumber = new FormControl(null);
  unsubscribe = new Subject<void>();
  tableColumns: TableColumn[] = [];
  searchChequeNo: string = '';
  searchCustomerNo: string = '';
  loading = false;
  chequeList: any[] = [];
  lookupNames: string[] = [];
  totalAllRecordsCount = 0;
  page = 1;
  total = 0;
  limit = 6;
  sort: number = 1;
  startDate = '';
  tableConfig: TableConfig = {
    paging: true,
    filter: {
      Sort: 1,
      PageSize: this.limit,
    },
  };
  index: any
  totalrecord: any
  ageingdata: any
  ngOnInit() {
    this.initTableColumns();
    this.fetchData();
    this.fetchtable()

    this.amountchange.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        const text: string = value || '';
        if (text?.length >= 0 || (!text?.length && this.tableConfig.filter.ChequeNumber?.length)) {
          this.tableConfig.filter.ChequeNumber = text;
          this.page = 1;
          this.fetchtable()
        }
      });
    this.phonenumber.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        const text: string = value || '';
        if (text?.length >= 0 || (!text?.length && this.tableConfig.filter.Customer?.length)) {
          this.tableConfig.filter.Customer = text;
          this.page = 1;
          this.fetchtable()
        }
      });
  }
  fetchData() {

  }
  ngOnDestroy() { }
  initTableColumns() {
    this.tableColumns = [
      {
        key: 'no',
        label: 'No',

      },
      {
        key: 'customerName',
        label: 'Customer Name',

      },
      {
        key: 'overDueTotal',
        label: 'Over Due',
      },
      {
        key: 'ageing',
        label: '0-30',
      },
      {
        key: 'second',
        label: '31-60',
      },
      {
        key: 'three',
        label: '61-90',
      },
      {
        key: 'four',
        label: '91-120',
      },
      {
        key: 'five',
        label: '121-150',
      },
      {
        key: 'six',
        label: '151-180',
      },
      {
        key: 'last',
        label: '180+',
      },
    ];
  }
  fetchtable() {
    this.chequeList = [];
    this.tableConfig.filter.PageNo = this.page - 1;
    const api1$ = this.depositService.GetChequesAgingList(this.tableConfig.filter);
    const api2$ = this.depositService.GetChequesAgingGraph(this.tableConfig.filter);
    forkJoin([api1$, api2$]).subscribe(
      ([result1, result2]) => {
        if (result1) {
          this.chequeList = result1.data;
          this.totalrecord = result1.totalRecordCount
          this.updateTotalValues(this.chequeList)
          console.log(this.ageingdata);
          this.totalAllRecordsCount = result1.totalRecordCount;
          this.total = result1.totalRecordCount;
        }
        if (result2) {
          this.data = result2;
          if (this.data.ageing) {
            this.barChartData.labels = this.data.ageing.map((item: any) => item.translations[0].lookupName);
            this.updateChart();
          }

        }
      },
      error => {
        console.error(error);
      },
      () => {
        this.loading = false;
      },
    );

  }

  onPageChange(page: number) {
    this.page = page;
    this.fetchtable()
  }

  removeSearchChequeNo() {
    this.searchChequeNo = '';
    this.sort = 1;
    this.fetchData();
  }
  searchCheque(event: any) {
    const text = event.target.value;
    if (text.length >= 2) {
      this.searchChequeNo = text;
      this.page = 0;
      this.fetchData();
    }
    if (text.length == 0) {
      this.fetchData();
    }
  }
  removeSearchCustomerNo() {
    this.searchCustomerNo = '';
    this.sort = 1;
    this.fetchData();
  }
  searchCustomer(event: any) {
    const text = event.target.value;
    if (text.length >= 2) {
      this.searchCustomerNo = text;
      this.page = 0;
      this.fetchData();
    }
    if (text.length == 0) {
      this.fetchData();
    }
  }
  onDateValueChange(event: any) {
    var pipe = new DatePipe('en-US');
    this.startDate = pipe.transform(event) || '';
    console.log(this.startDate);
    this.tableConfig.filter.CollectionDate = this.startDate;
    this.fetchtable()
  }
  onDueDateValueChange(event: any) {
    var pipe = new DatePipe('en-US');
    this.startDate = pipe.transform(event) || '';
    this.fetchData();
  }
  removeCollectionDateFilter() {
    (this.startDate = '');
    if (this.datepickerInput)
      this.datepickerInput = '';
    this.fetchtable()
  }
  validateInput(event: any) {
    const enteredValue = event.target.value;
    const pattern = /^[0-9]*\.?[0-9]*$/; // Regex pattern to allow numbers and decimal point
    if (!pattern.test(enteredValue)) {
      event.target.value = enteredValue.replace(/[^0-9.]/g, ''); // Remove any invalid characters
    }
  }
  totalAgeing: any;
  totalSecond: any;
  totalThree: any;
  totalFour: any;
  totalFive: any;
  totalSix: any;
  totalLast: any;
  totalValues: any; // Array to store the total values
  calculateTotalValue(rows: any[], columnIndex: number, columnName: string): string {
    let total = 0;
    if (columnName === 'overDueTotal') {
      for (const row of rows) {
        total += row[columnName];
      }
    } else {
      for (const row of rows) {
        total += row.ageing[columnIndex].amount;
      }
    }
    return total.toFixed(3);
  }

  updateTotalValues(rows: any[]): void {
    const currencySymbol = ' JOD'; // Replace 'JOD' with your desired currency symbol
    this.totalValues = {
      'customerName': 'Total:',
      'overDueTotal': this.calculateTotalValue(rows, 0, 'overDueTotal') + currencySymbol,
      'ageing': this.calculateTotalValue(rows, 0, 'ageing') + currencySymbol,
      'second': this.calculateTotalValue(rows, 1, 'second') + currencySymbol,
      'three': this.calculateTotalValue(rows, 2, 'three') + currencySymbol,
      'four': this.calculateTotalValue(rows, 3, 'four') + currencySymbol,
      'five': this.calculateTotalValue(rows, 4, 'five') + currencySymbol,
      'six': this.calculateTotalValue(rows, 5, 'six') + currencySymbol,
      'last': this.calculateTotalValue(rows, 6, 'last') + currencySymbol
    };
  }


  //chart

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
        formatter: (value: any) => {
          return value || '';
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const formattedValue = value.toLocaleString(); // Convert to thousand separator format
            return `${context.label}: ${formattedValue} JOD`;
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
        // ticks: {
        //   callback: (tickValue: string | number) => {
        //     if (typeof tickValue === 'number') {
        //       return tickValue >= 1000 ? `${tickValue / 1000}k` : tickValue;
        //     }
        //     return tickValue;
        //   }
        // },
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
    labels: [],
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

  ngAfterViewInit() {
    this.initChart();
  }
  onResize() {
    const barThickness = this.getBarThickness();
    this.barChartData.datasets[0].barThickness = barThickness;
    this.barChartData.datasets[1].barThickness = barThickness;
    if (this.chart)
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

  }

  private updateChart() {
    if (!this.chart) {
      return;
    }
    const defaultAmount = 0;
    const defaultCollectedAmount = 0;

    this.barChartData.datasets[0].data = [];
    this.barChartData.datasets[1].data = [];

    for (let i = 0; i < (this.data?.ageing).length; i++) {
      const totalAmount = this.data?.ageing[i]?.totalAmount || defaultAmount;
      const collectedAmount = this.data?.ageing[i]?.collectedAmount || defaultCollectedAmount;

      this.barChartData.datasets[0].data.push(totalAmount);
      this.barChartData.datasets[1].data.push(collectedAmount);
    }
    this.chart.update();
  }
  exportToExcel() {
    const header = [
      'No',
      'Customer Name',
      'Over Due ',
      '0-30',
      '31-60',
      '61-90',
      '91-120',
      '121-150',
      '151-180',
      '180+',
    ];
    const data = (this.chequeList || []).reduce(
      (acc, item) => {
        acc.push([
          item.customerId,
          item.customerName,
          `${item.overDueTotal} JOD`,
          `${item.ageing?.[0]?.amount} JOD`,
          `${item.ageing?.[1]?.amount} JOD`,
          `${item.ageing?.[2]?.amount} JOD`,
          `${item.ageing?.[3]?.amount} JOD`,
          `${item.ageing?.[4]?.amount} JOD`,
          `${item.ageing?.[5]?.amount} JOD`,
          `${item.ageing?.[6]?.amount} JOD`,
        ]);
        return acc;
      },
      [header]
    );
    if (data?.length > 1) {
      data.push([
        '',
        'Total',
        `${this.totalValues?.overDueTotal}`,
        `${this.totalValues?.ageing}`,
        `${this.totalValues?.second}`,
        `${this.totalValues?.three}`,
        `${this.totalValues?.four}`,
        `${this.totalValues?.five}`,
        `${this.totalValues?.six}`,
        `${this.totalValues?.last}`,
      ]);
    }
    csvExport('Cheques Aging Report', data);
  }
}

