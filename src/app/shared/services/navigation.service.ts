import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, pairwise } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// This service has to be included in AppComponent so it is listening to all of the routes
export class NavigationService {
  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  constructor(private router: Router, private location: Location) {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        pairwise() // Check it's second route load
      )
      .subscribe((e: any[]) => {
        this.previousUrl = e[0].urlAfterRedirects;
        this.currentUrl = e[1].urlAfterRedirects;
      });
  }

  back(): void {
    if (this.previousUrl !== null) {
      this.location.back();
    }
  }

  getBackUrl(): string | null {
    return this.previousUrl;
  }
}
