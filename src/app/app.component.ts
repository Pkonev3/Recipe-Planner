import { Component, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterModule, MatMenuModule,MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  isMobileMenuOpen = false;
  activeRoute: string | null = null;

  // Track window size for responsive behavior
  isMobileView = false;
  mobileBreakpoint = 992;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkViewport();
    if (!this.isMobileView && this.menuTrigger?.menuOpen) {
      this.menuTrigger.closeMenu();
    }
  }

  ngOnInit() {
    this.checkViewport();
  }

  private checkViewport() {
    this.isMobileView = window.innerWidth < this.mobileBreakpoint;
  }

  // Smooth scroll to top when navigating
  navigateWithScroll(route: string) {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  // Mobile menu handlers
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    if (this.menuTrigger?.menuOpen) {
      this.menuTrigger.closeMenu();
    }
  }
}
