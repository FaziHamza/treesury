import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TokenService } from '../shared/services/token.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe(params => {

      if (params?.['token']) {
        this.tokenService.setToken(params['token']);
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
