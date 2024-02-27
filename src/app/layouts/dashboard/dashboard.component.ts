import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as d3 from 'd3-scale';
import * as d3Selection from 'd3-selection';
import { PropertyOwnership } from 'src/app/models/classes/property-ownership.class';
import { DashboardService } from 'src/app/services/api/dashboard.service';
import { DynamicGridComponent } from 'src/app/components/dynamics/grid/grid.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxChartsModule, DynamicGridComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  multi: any[] = [];

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  cardColor: string = '#232837';

  dto = PropertyOwnership;
  propertyOwnerships!: PropertyOwnership[];
  
  constructor(private _dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this._dashboardService.getDashboardDetails().subscribe(
      (result:any) => {
        this.multi.push(result.cardData);
        this.multi.push(result.propertyTypes);
        this.propertyOwnerships = result.propertyOwnerships;
      }
    );
  }

  onSelect(event: any) {
    console.log(event);
  }
}
