import {
  AfterContentInit,
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  TemplateRef,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { cloneDeep, get } from 'lodash';
import { faArrowUpLong, faArrowDownLong } from '@fortawesome/free-solid-svg-icons';

import { TableColumn, TableConfig, TableSort  } from './table-advanced-interfaces';
import { TableAdvancedColumnDirective } from './table-advanced.directives';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-advanced',
  templateUrl: './table-advanced.component.html',
  styleUrls: ['./table-advanced.component.scss'],
})
export class TableAdvancedComponent implements OnInit, AfterContentInit, OnChanges {
  @Input() config: TableConfig = {};
  @Input() loading = false;
  @Input() page: number = 1;
  @Input() pageCount: number = 1;
  @Input() limit: number = 6;
  @Input() total: number = 0;
  @Input() columns: TableColumn[] = [];
  @Input() sort: TableSort = { column: null, direction: false };
  @Input() data: any[] = [];
  @Input() link: string = '';
  @Input() tablefoot: any[] = []
  @Output() pageUpdated = new EventEmitter<number>();
  @Output() sortUpdated = new EventEmitter();
  @Output() selectedData = new EventEmitter();

  @ContentChildren(TableAdvancedColumnDirective)
  templateColumnRefs!: QueryList<TableAdvancedColumnDirective>;

  columnTemplates!: { [key: string]: TemplateRef<any> };
  tempData: any[] = [];
  temptablefoot:any[] =[]
  faArrowUpLong = faArrowUpLong;
  faArrowDownLong = faArrowDownLong;
  constructor(private router: Router) { }
  ngOnInit() {
   
    
    if (this.config.initSort) {
      this.sort = this.config.initSort;
    }
  }

  ngAfterContentInit() {
    this.columnTemplates = this.templateColumnRefs.reduce(
      (acc: any, cur: TableAdvancedColumnDirective) => {
        acc[cur.name] = cur.template;
        return acc;
      },
      {},
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.tempData = cloneDeep(this.data || []);
    }
    if (changes['tablefoot']) {
      this.temptablefoot = cloneDeep(this.tablefoot || []);
      console.log('  this.temptablefoot',  this.temptablefoot);
      
    }
  }

  isSortColumnMatch(column: TableColumn) {
    return this.sort?.column === column.key;
  }

  onSort(column: TableColumn) {
    if (!column.canSort || !this.tempData.length) {
      return;
    }
    if (this.isSortColumnMatch(column)) {
      if (this.sort.direction === 'asc') {
        this.sort.direction = 'desc';
        this.sort.column = column.key;
      } else if (this.sort.direction === 'desc') {
        this.sort.direction = false;
        this.sort.column = null;
      } else {
        this.sort.direction = 'asc';
        this.sort.column = column.key;
      }
    } else {
      this.sort.direction = 'asc';
      this.sort.column = column.key;
    }
    this.sortUpdated.emit(this.sort);
  }

  onPageChange(page: number) {
    this.pageUpdated.emit(page);
  }

  getItemValue(item: any, key: string) {
    return get(item, key);
  }

  getColumnByKey(key: string) {
    return this.columns.find(s => s.key === key);
  }
  gotoPage(id: any, column: any) {
    if (this.link) {
      if (column.key != 'action')
        this.router.navigate([this.link, id]);
    }
  }
  selecteddata: any[] = [];

  checkAllCheckBox(ev: any) {
    if (ev.target.checked) {
      this.selecteddata = cloneDeep(this.tempData);
    } else {
      this.selecteddata = [];
    }
    this.tempData.forEach(x => (x.checked = ev.target.checked));
    this.selectedData.emit(this.selecteddata);
  }

  getSelectedItem(data: any, event: any) {
    if (event.target.checked) {
      this.selecteddata.push(data);
    } else {
      let index = this.selecteddata.indexOf(data);
      this.selecteddata.splice(index, 1);
    }
    this.selectedData.emit(this.selecteddata);
  }

  isAllCheckBoxChecked() {
    return this.tempData.every(p => p.checked);
  }

  getfooterByKey(key: string) {
    
    return this.columns.find(s => s.key === key);
  }
}
