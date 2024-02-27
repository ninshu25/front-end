import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/framework/base-component';
import { Property } from 'src/app/models/classes/property.class';
import { PropertyService } from 'src/app/services/api/property.service';
import { DynamicFormComponent } from "../../components/dynamics/form/form.component";
import { MatDialogRef } from '@angular/material/dialog';
import { PropertyOwnership } from 'src/app/models/classes/property-ownership.class';
import { PropertyOwnershipService } from 'src/app/services/api/property-ownership.service';
import { DynamicGridComponent } from 'src/app/components/dynamics/grid/grid.component';
import { ActionOptions } from 'src/app/models/interfaces/action-options.interface';
import { ModalService } from 'src/app/services/internal/modal.service';

@Component({
    selector: 'property',
    standalone: true,
    templateUrl: './property.component.html',
    styleUrl: './property.component.scss',
    providers: [{ provide: MatDialogRef, useValue: {} }],
    imports: [DynamicFormComponent, DynamicGridComponent]
})
export class PropertyComponent extends BaseComponent implements OnInit  {
  id!: string | null;
  property!: Property;
  dto = Property;

  propertyOwnerships!: PropertyOwnership[];
  dtoOwnership = PropertyOwnership;

  @ViewChild(DynamicGridComponent) childComponent!: DynamicGridComponent;

  constructor(
    private _route: ActivatedRoute,
    private _propertyService: PropertyService,
    private _propertyOwnershipService: PropertyOwnershipService,
    private _modalService: ModalService) 
  {
    super();
  }

  ngOnInit() {
    this._route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if(this.id){
        this._propertyService.getPropertyById(this.id).subscribe(
          result => {
            this.property = result;
          }
        );

        this._propertyOwnershipService.getPropertyOwnershipsByPropertyId(this.id).subscribe(
          result => {
            this.propertyOwnerships = result;
          }
        );
      }
    });
  }

  performActionSelected(action: ActionOptions){
    switch(action.code){
      case 'CRT':
        const newObj = {propertyId: this.property.id}
        this.subscriptions.add(
          this._modalService.openCreateModal(this.dtoOwnership, 'Property Ownership', newObj).subscribe(
            (result: any) => {
              if(result){
                result.askingPrice = this.property.price;
                this.propertyOwnerships[this.propertyOwnerships.length - 1].effectiveTill = result.effectiveFrom;
                this._propertyOwnershipService.addPropertyOwnership(result).subscribe(
                  result => {
                    this.propertyOwnerships.push(result);
                    this.updateDataSource();
                  }
                );
              }
            }
          )
        );
        break;
      case 'DeleteSelected':
        break;
    }
  }

  updateProperty(property: any){

    Object.assign(this.property, property);

    this._propertyService.updateProperty(this.property).subscribe();

  }

  updateDataSource() {
    this.childComponent.updateDataSource();
  }

}
