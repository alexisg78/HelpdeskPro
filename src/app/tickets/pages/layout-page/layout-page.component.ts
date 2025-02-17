import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``,
  standalone: false
})
export class LayoutPageComponent {
  constructor(private router: Router) {}

  get hideFooter(): boolean {
    return this.router.url === '/helpdesk';
  }

}
