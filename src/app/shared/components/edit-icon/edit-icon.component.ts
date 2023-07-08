import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-icon',
  templateUrl: './edit-icon.component.html',
  styleUrls: ['./edit-icon.component.scss'],
})
export class EditIconComponent {
  @Input() heightInRem = '1.5rem';
  @Input() alt = false;
  @Input() cursorPointer = true;
}
