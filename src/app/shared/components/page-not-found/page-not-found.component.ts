import { Component } from '@angular/core';
import { BackButtonDirective } from '../../directives/back-button.directive';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [BackButtonDirective],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {

}
