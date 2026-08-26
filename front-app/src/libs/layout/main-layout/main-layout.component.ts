import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const MOBILE_BREAKPOINT = 768;

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  providers: [],
})
export class MainLayoutComponent implements OnInit {
  sidebarCollapsed = false;

  private isMobile = false;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) { }

  ngOnInit(): void {
    this.checkViewport();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkViewport();
  }

  private checkViewport(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
    if (mobile !== this.isMobile) {
      this.isMobile = mobile;
      this.sidebarCollapsed = mobile;
    }
  }
}
