import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { BaseComponent } from '../framework/base-component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLinkActive, RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { map } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';
import { PageGroup } from '../models/interfaces/page-group.interface';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';

const SMALL_WIDTH_BREAKPOINT = 959;

@Component({
    selector: 'shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss'],
    standalone: true,
    imports: [CommonModule, MatDivider, MatIcon, MatSidenav, MatSidenavContainer, MatSidenavContent, RouterLinkActive, RouterOutlet, NavBarComponent, RouterLink, MatListModule],

})
export class ShellComponent extends BaseComponent implements OnInit {
  public sidenavMode: 'over' | 'side' = 'side';
  public isOpened = false;
  public isExpanded = false;
  public isMiniExpanded = false;
  public isSmallScreen = false;
  @Input() pageGroups: PageGroup[] = [
    {
      id: 6,
      name: 'GENERIC',
      pages: [{
        id: 1,
        order: 1,
        path: '/dashboard',
        name: 'Dashboard',
        fontSet: 'material',
        fontIcon: 'dashboard',
        children:[]
      }, {
        id: 2,
        order: 2,
        path: '/contacts',
        name: 'Contacts',
        fontSet: 'material',
        fontIcon: 'recent_actors',
        children: []
      }, {
        id: 3,
        order: 3,
        path: '/properties',
        name: 'Properties',
        fontSet: 'material',
        fontIcon: 'business',
        children: []
      }]
    }
  ];
  @Input() logoUrl!: string;
  @ViewChild('sidenav') sideNav!: MatSidenav;

  constructor(public router: Router, breakpoints: BreakpointObserver) {
    super();
    this.subscriptions.add(
      breakpoints.observe(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`)
        .pipe(map(breakpoint => breakpoint.matches))
        .subscribe((isSmall: boolean) => {
          this.isSmallScreen = isSmall;
          if (this.sidenavMode) {
            if (!this.isSmallScreen) {
              this.isOpened = true;
              this.sidenavMode = 'side';
            } else {
              this.isOpened = this.isExpanded;
              this.sidenavMode = 'over';
            }
          }
        })
    );

    this.subscriptions.add(
      router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.isSmallScreen) {
            this.isExpanded = false;
            this.isOpened = false;
          }
        }
      })
    )

  }


  ngOnInit(): void {
    if (this.isSmallScreen) {
      this.isExpanded = false;
      this.isOpened = false;
      this.sidenavMode = 'over';
    } else {
      this.isExpanded = true;
      this.isOpened = true;
      this.sidenavMode = 'side';
    }

    this.onToggleSidebar();
  }

  onToggleSidebar() {
    if (this.isSmallScreen) {
      this.isExpanded = !this.isExpanded;
      this.sideNav.toggle();
    } else {
      this.isExpanded = !this.isExpanded;
      this.isOpened = true;
    }
  }

  mouseEnter() {
    this.isMiniExpanded = true;
  }

  mouseLeave() {
    this.isMiniExpanded = false;
  }

  onSidenavOpenedStart() {
    this.isOpened = true;
  }

  onSideNavClosedStart() {
    this.isOpened = false;
  }
}

