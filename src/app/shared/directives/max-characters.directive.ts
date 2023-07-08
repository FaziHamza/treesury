import { Directive, ElementRef, Input, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appMaxCharacters]'
})
export class MaxCharactersDirective {
  @Input('appMaxCharacters') maxLength: number= 0;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > this.maxLength) {
      input.value = input.value.slice(0, this.maxLength);
      event.preventDefault();
    }
  }
}
