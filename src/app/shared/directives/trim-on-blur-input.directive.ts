import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[trimOnBlurInput],textarea[trimOnBlurInput]',
})
export class TrimOnBlurInputDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('blur')
  onBlur(): void {
    const control = this.ngControl?.control;
    if (control && typeof control?.value === 'string') {
      this.ngControl.control?.setValue(control.value.trim());
    }
  }
}
