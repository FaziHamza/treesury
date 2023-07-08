import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const window: any;
const defaultUtilScript = 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.6/build/js/utils.js';

@Directive({
  selector: '[libTelInput]',
})
export class TelInputDirective implements OnInit {
  @Input('libTelInputOptions') libTelInputOptions: { [key: string]: any } = {};
  @Output('hasError') hasError: EventEmitter<boolean> = new EventEmitter();
  @Output('libTelOutput') libTelOutput: EventEmitter<any> = new EventEmitter();
  @Output('countryChange') countryChange: EventEmitter<any> = new EventEmitter();
  @Output('intlTelInputObject') intlTelInputObject: EventEmitter<any> = new EventEmitter();

  ngTelInput: any;

  constructor(private el: ElementRef, @Inject(PLATFORM_ID) private platformId: string) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.libTelInputOptions = {
        ...this.libTelInputOptions,
        utilsScript: this.getUtilsScript(this.libTelInputOptions),
      };
      this.ngTelInput = window.intlTelInput(this.el.nativeElement, {
        ...this.libTelInputOptions,
      });

      this.el.nativeElement.addEventListener('countrychange', () => {
        this.countryChange.emit(this.ngTelInput.getSelectedCountryData());
      });

      this.intlTelInputObject.emit(this.ngTelInput);
    }
  }

  @HostListener('blur') onBlur() {
    let isInputValid: boolean = this.isInputValid();
    if (isInputValid) {
      let telOutput = this.ngTelInput.getNumber();
      this.hasError.emit(isInputValid);
      this.libTelOutput.emit(telOutput);
    } else {
      this.hasError.emit(isInputValid);
    }
  }

  isInputValid(): boolean {
    return this.ngTelInput.isValidNumber();
  }

  setCountry(country: any) {
    this.ngTelInput.setCountry(country);
  }

  getUtilsScript(options: any) {
    return options.utilsScript || defaultUtilScript;
  }
}
