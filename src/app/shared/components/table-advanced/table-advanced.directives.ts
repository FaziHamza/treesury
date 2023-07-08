import { Directive, Input, TemplateRef } from '@angular/core';
import { HostListener } from '@angular/core';

@Directive({
  selector: 'ng-template[libTableAdvancedColumn]',
})
export class TableAdvancedColumnDirective {
  @Input('libTableAdvancedColumn') name!: string;
  constructor(public template: TemplateRef<any>) {}
}

@Directive({
  selector: '[libClickStopPropagation]',
})
export class ClickStopPropagation {
  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
