import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchComponent),
      multi: true,
    },
  ],
})
export class SearchComponent implements ControlValueAccessor {
  @Input() placeholder = '';

  faSearch = faSearch;
  faXmark = faXmark;
  value = '';

  private onTouch!: () => void;
  private onModalChange!: (value: string) => void;

  onChange(event: any): void {
    this.value = event.target?.value?.trim();
    this.onTouch();
    this.onModalChange(this.value);
  }

  clear() {
    this.value = '';
    this.onTouch();
    this.onModalChange(this.value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onModalChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  writeValue(value: string | null): void {
    this.value = value || '';
  }
}
