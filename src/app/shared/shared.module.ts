import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbTooltipModule,
  NgbAccordionModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularSvgIconModule } from 'angular-svg-icon';

import {
  ClickStopPropagation,
  TableAdvancedColumnDirective,
  TableAdvancedComponent,
} from './components/table-advanced';
import { EditIconComponent } from './components/edit-icon/edit-icon.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SearchComponent } from './components/search/search.component';
import { ModalConfirmComponent } from './modals/modal-confirm/modal-confirm.component';
import { ModalLogoutComponent } from './modals/modal-logout/modal-logout.component';
import { NumberOnlyDirective } from './directives/numbers-only.directive';
import { AlphabetOnlyDirective } from './directives/alphabet-only.directive';
import { TelInputDirective } from './directives/tel-input.directive';
import { TrimInputDirective } from './directives/trim-input.directive';
import { TrimOnBlurInputDirective } from './directives/trim-on-blur-input.directive';
import { CurrencyFormatterDirective } from './directives/currency-formatter.directive';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalMessageComponent } from './modals/modal-message/modal-message.component';

@NgModule({
  declarations: [
    TableAdvancedComponent,
    ClickStopPropagation,
    TableAdvancedColumnDirective,
    SearchComponent,
    EditIconComponent,
    LoadingComponent,
    ModalConfirmComponent,
    ModalMessageComponent,
    ModalLogoutComponent,
    NumberOnlyDirective,
    AlphabetOnlyDirective,
    TelInputDirective,
    TrimInputDirective,
    TrimOnBlurInputDirective,
    CurrencyFormatterDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbDropdownModule,
    NgbTooltipModule,
    BsDatepickerModule.forRoot(),
    NgbAccordionModule,
    NgbPaginationModule,
    NgSelectModule,
    AngularSvgIconModule,

  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbAccordionModule,
    NgSelectModule,
    AngularSvgIconModule,
    TableAdvancedComponent,
    BsDatepickerModule,
    ClickStopPropagation,
    TableAdvancedColumnDirective,
    SearchComponent,
    EditIconComponent,
    LoadingComponent,
    ModalConfirmComponent,
    ModalMessageComponent,
    ModalLogoutComponent,
    NumberOnlyDirective,
    AlphabetOnlyDirective,
    TelInputDirective,
    TrimInputDirective,
    TrimOnBlurInputDirective,
    CurrencyFormatterDirective,

  ],
})
export class SharedModule {}
