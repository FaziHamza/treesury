import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { HeaderService } from '../shared/services/header.service';
import { SidebarService } from '../shared/services/sidebar.service';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  loading = false;
  form!: FormGroup;
  userDetails: any;
  isShowFullName = false;
  isShowMobile = false;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private headerService: HeaderService,
    private sidebarService: SidebarService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Profile');
    this.sidebarService.emitEvent({
      select: { navLink: { id: 'profile', name: 'profile', url: '/profile' }, silent: true },
    });
    this.form = this.fb.group({
      userId: ['', Validators.required],
      fullName: ['', Validators.required],
      mobile: '',
    });
    this.reset();
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.authService
      .getLoggedUserDetails()
      .subscribe(result => {
        if (result?.isSuccess) {
          this.userDetails = result.data;
          if (this.userDetails) {
            this.form.get('userId')?.patchValue(this.authService.userId);
            this.form.get('fullName')?.patchValue(this.userDetails.fullName);
            this.form.get('mobile')?.patchValue(this.userDetails?.mobile);
          }
        }
      })
      .add(() => (this.loading = false));
  }

  editUser() {
    if (this.form.valid) {
      this.userService.updateUser(this.form.value).subscribe({
        next: result => {
          if (result.isSuccess) {
            this.reset();
            this.toastrService.success('Updated successfully');
          }
        },
        error: err => {
          const errors = err?.error?.errors?.map((entry: any) => entry.ErrorMessageEn) || [];
          this.toastrService.error(errors.length ? errors.join('<br>') : 'Update failed', '', {
            enableHtml: true,
          });
        },
      });
    }
  }

  reset() {
    this.form.controls['fullName'].disable();
    this.isShowFullName = false;
    this.form.controls['mobile'].disable();
    this.isShowMobile = false;
  }

  editFullname() {
    if (!this.isShowFullName) {
      this.isShowFullName = true;
      this.form.controls['fullName'].enable();
    }
  }

  editMobile() {
    if (!this.isShowMobile) {
      this.isShowMobile = true;
      this.form.controls['mobile'].enable();
    }
  }

  get formValid(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
