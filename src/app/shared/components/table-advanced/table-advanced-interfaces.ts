export interface TableConfig {
  paging?: boolean;
  initSort?: any;
  filter?: any;
}

export interface TableSort {
  column: string | null;
  direction: boolean | 'asc' | 'desc';
}

export interface TableColumn {
  key: string;
  label: string;
  canSort?: boolean;
}
