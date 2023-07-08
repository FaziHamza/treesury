import { Directive } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[trimInput],textarea[trimInput]',
})
export class TrimInputDirective {
  constructor(private ngControl: NgControl) {
    const valueAccessor = this.ngControl?.valueAccessor;
    if (valueAccessor) {
      const original = valueAccessor.registerOnChange;
      valueAccessor.registerOnChange = (fn: (_: unknown) => void) => {
        return original.call(valueAccessor, (value: unknown) => {
          if (typeof value === 'string') {
            const trimmed = value.trim();
            valueAccessor.writeValue(trimmed);
            return fn(trimmed);
          }
          return fn(value);
        });
      };
    }
  }
}
