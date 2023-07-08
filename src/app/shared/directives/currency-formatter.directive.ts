import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';

const PADDING = '000000';

@Directive({ selector: '[currencyFormatter]' })
export class CurrencyFormatterDirective implements OnInit {
  private el: any;
  private prefix = '';
  private decimalSeparator = '.';
  private thousandsSeparator = ',';
  private suffix = '';
  private fractionSize = 3;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this.transform(this.el.value);
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: any) {
    this.el.value = this.parse(value);
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: any) {
    this.el.value = this.transform(value);
  }

  transform(value: string, config: any = {}): string {
    this.initConfigs(config);
    let [integer, fraction = ''] = (value || '').toString().split('.');
    fraction =
      this.fractionSize > 0
        ? `${this.decimalSeparator}${(fraction + PADDING).substring(0, this.fractionSize)}`
        : '';
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
    return `${this.prefix}${integer || 0}${fraction}${this.suffix}`;
  }

  parse(value: string, config: any = {}): string {
    this.initConfigs(config);
    let [integer, fraction = ''] = (value || '')
      .replace(this.prefix, '')
      .replace(this.suffix, '')
      .split(this.decimalSeparator);
    integer = integer.replace(new RegExp(this.thousandsSeparator, 'g'), '');
    fraction =
      parseInt(fraction, 10) > 0 && this.fractionSize > 0
        ? `${this.decimalSeparator}${(fraction + PADDING).substring(0, this.fractionSize)}`
        : '';
    return `${integer || 0}${fraction}`;
  }

  initConfigs(config: any = {}) {
    if (config.prefix !== undefined) {
      this.prefix = config.prefix;
    }
    if (config.decimalSeparator !== undefined) {
      this.decimalSeparator = config.decimalSeparator;
    }
    if (config.thousandsSeparator !== undefined) {
      this.thousandsSeparator = config.thousandsSeparator;
    }
    if (config.suffix !== undefined) {
      this.suffix = config.suffix;
    }
    if (config.fractionSize !== undefined) {
      this.fractionSize = config.fractionSize;
    }
  }
}
