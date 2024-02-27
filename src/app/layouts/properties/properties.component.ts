import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicGridComponent } from 'src/app/components/dynamics/grid/grid.component';
import { BaseComponent } from 'src/app/framework/base-component';
import { Property } from 'src/app/models/classes/property.class';
import { ActionOptions } from 'src/app/models/interfaces/action-options.interface';
import { PropertyService } from 'src/app/services/api/property.service';
import { ModalService } from 'src/app/services/internal/modal.service';

@Component({
    selector: 'app-properties',
    standalone: true,
    templateUrl: './properties.component.html',
    styleUrl: './properties.component.scss',
    imports: [DynamicGridComponent]
})
export class PropertiesComponent extends BaseComponent implements OnInit{

  public properties!: Property[];
  dto = Property;
  options: ActionOptions[] = [
    {
      name: 'Delete',
      code: 'DLT'
    }
  ];

  @ViewChild(DynamicGridComponent) childComponent!: DynamicGridComponent;

  constructor(
    private _propertyService: PropertyService,
    private _modalService: ModalService,
    private _router: Router){
    super();
  }

  ngOnInit(): void {
    this.pageUpdated({pageSize: 5, currentPage: 1});
  }

  deleteProperty(property: Property) {
    this.subscriptions.add(
      this._propertyService.deleteProperty(property).subscribe(
        result => {
          const index = this.properties.indexOf(property);
          if (index !== -1) {
            this.properties.splice(index, 1);
            this.updateDataSource();
          }
        }
      )
    );
  }

  viewProperty(property: Property){
    this._router.navigate(['/properties', property.id]);
  }

  editProperty(property: Property){
    this.subscriptions.add(
      this._modalService.openCreateModal(this.dto, 'Property', property).subscribe(
        (result: any) => {
          if(result){
            Object.assign(property, result);
            this._propertyService.updateProperty(property).subscribe();
          }
        }
      )
    );
  }
  
  performActionSelected(action: any) {
    switch(action.code){
      case 'CRT':
        this.subscriptions.add(
          this._modalService.openCreateModal(this.dto, 'Property').subscribe(
            (result: any) => {
              if(result){
                result.propertyTypeId = Number(result.propertyTypeId);
                result.registrationDate = new Date();

                this._propertyService.addProperty(result).subscribe(
                  result => {
                    this.properties.push(result);
                    this.updateDataSource();
                  }
                );
              }
            }
          )
        );
        break;
    }
  }

  updateDataSource() {
    if(this.childComponent){
      this.childComponent.updateDataSource();
    }
  }

  pageUpdated(pageDetails: any){
    this.subscriptions.add(
      this._propertyService.getPropertiesByPaging(pageDetails.currentPage, pageDetails.pageSize).subscribe(
        result => {
          this.properties = result.data;
          if(this.childComponent){
            this.childComponent.dataSource.data = result.data;
            this.childComponent.count = result.count;
          }
        }
      )
    );
  }
}
