import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { NavigationService } from './shared/services/navigation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pui-news-manager-project-web';
  // TODO: Find a better way to do this.
  // This has to be injected in AppComponent so it is listening for route changes the whole time
  private navigationService = inject(NavigationService);
}
