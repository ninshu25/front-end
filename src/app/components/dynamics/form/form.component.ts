import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe, CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { Options } from 'src/app/models/interfaces/options.interface';
import { MatDialogRef } from '@angular/material/dialog';
import { ContactsService } from 'src/app/services/api/contacts.service';
import { PropertyService } from 'src/app/services/api/property.service';
import { Entities } from 'src/app/models/enums/entites.enum';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { trigger, state, style, transition, animate, query, sequence } from '@angular/animations';
import { EnumValues } from 'src/app/models/enums/enum-values.enum';
import { PropertyType } from 'src/app/models/enums/property-type.enum';
import { ActionOptions } from 'src/app/models/interfaces/action-options.interface';

@Component({
  selector: 'dynamic-form',
  standalone: true,
  imports: [
    MatSortModule, MatPaginatorModule, RouterLink, MatCheckboxModule, MatTooltipModule,
    AsyncPipe, JsonPipe, DatePipe, CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, CommonModule, MatButtonModule,
    MatFormFieldModule,MatInputModule, MatSelectModule, MatDatepickerModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [provideNativeDateAdapter()],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        sequence([
          style({ opacity: 0, transform: 'translateX(-5%)' }), // Start with opacity 0 and translateX(-100%)
          animate('700ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })) // Fade in from the left
        ])
      ])
    ])
  ]
})
export class DynamicFormComponent implements OnInit {
  @Input() entityName!: string;
  @Input() data!: any;
  @Input() dto!: any;
  @Input() editing: boolean = false;
  @Input() editable: boolean = false;

  @Output() submitForm: EventEmitter<any> = new EventEmitter<any>();
  
  form!: FormGroup;

  dropdownItems: any = {};

  get displayOptions(): Options[] {
    return this.dto.options;
  }

  loaded: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<DynamicFormComponent>,
    private _contactService: ContactsService,
    private _propertyService: PropertyService) 
  { }

  async ngOnInit() {
    this.form = this.formBuilder.group({});

    if (this.dto) {
      for (const option of this.dto.options) {
        if(option.formField){
          this.form.addControl(option.value, new FormControl('', Validators.required));

          if(option.foreignKey){
            switch(option.foreignKeyValue){
              case Entities.Contact:
                await this._contactService.getContacts().subscribe(
                  result => {
                    this.dropdownItems.contactId = result;
                  }
                )
                break;
              case Entities.Property:
                await this._propertyService.getProperties().subscribe(
                  result => {
                    this.dropdownItems.propertyId = result;
                  }
                )
                break;
            }
          }

          if(option.enum){
            switch(option.enumValue){
              case EnumValues.PropertType:
                this.dropdownItems[option.value] = this.enumToArray(PropertyType);
                break;
            }
          }
        }
      }
    }

    if (this.data) {
      Object.keys(this.data).forEach(key => {
        if (this.form.contains(key)) {
          this.form.get(key)?.setValue(this.data[key]);
        }
      });
    }

    this.loaded = true;
  }

  onSubmit() {
    if (this.form.valid) {
      this.editing = false;
      this.submitForm.emit(this.form.value);
      this._dialogRef.close(this.form.value);
    }
  }

  onCancel(){
    this.editing = false;

    try{
      this._dialogRef.close();
    }
    catch{
      throw 'Not a modal.';
    }    
  }

  get(option: Options){
    return this.dropdownItems[option.value].find((item: { id: any; }) => Number(item.id) === this.form.get(option.value)?.value).name;
  }

  enumToArray(enumObject: any): { id: number; name: any }[] {
    return Object.keys(enumObject)
        .filter(key => isNaN(Number(enumObject[key]))) // Filter out enum keys with numeric values
        .map(key => ({ id: Number(key) , name: enumObject[key] }));
  }

}
