import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormComponent } from 'src/app/components/dynamics/form/form.component';


@Injectable({
  providedIn: 'root'
})
export class ModalService{

  constructor(private _dialog: MatDialog) 
  { }

  openCreateModal(dto: any, entityName: string, data: any = null): any {
    const dialogRef = this._dialog.open(DynamicFormComponent, { width: '400px' });
    let instance = dialogRef.componentInstance;

    instance.entityName = entityName;
    instance.data = new dto();
    instance.dto = dto;
    instance.editing = true;

    if(data){
        Object.assign(instance.data, data);
    }
      
    return dialogRef.afterClosed();
  }

}
