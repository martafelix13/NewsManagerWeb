import { Directive, ElementRef, Host, HostListener, Inject, Input, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Directive({
  selector: '[appBackButton]',
  standalone: true,
})
export class BackButtonDirective implements OnInit {
  constructor(
    private navigationService: NavigationService,
    private element: ElementRef
  ) {}

  @Input() hideOnInitialLoad = false;

  ngOnInit() {
    this.element.nativeElement.href = this.navigationService.getBackUrl() ?? '#'
    if(this.hideOnInitialLoad && !this.navigationService.getBackUrl()) {
      this.element.nativeElement.style.display = 'none';
    }
  }

  @HostListener('hover')
  onHover() {
    this.element.nativeElement.href =
      this.navigationService.getBackUrl() ?? '#';
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault()
    this.navigationService.back();
  }
}
