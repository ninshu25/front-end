import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { ActionOptions } from 'src/app/models/interfaces/action-options.interface';
import { Options } from 'src/app/models/interfaces/options.interface';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { Entities } from 'src/app/models/enums/entites.enum';
import { ContactsService } from 'src/app/services/api/contacts.service';
import { PropertyService } from 'src/app/services/api/property.service';
import { EnumValues } from 'src/app/models/enums/enum-values.enum';
import { PropertyType } from 'src/app/models/enums/property-type.enum';

@Component({
  selector: 'dynamic-grid',
  standalone: true,
  imports: [
    MatTableModule, MatSortModule, MatPaginatorModule, RouterLink, MatCheckboxModule, MatTooltipModule,
    AsyncPipe, JsonPipe, DatePipe, CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, CommonModule, MatButtonModule, MatMenuModule,
    MatFormFieldModule,MatInputModule
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DynamicGridComponent implements OnInit {
  @Input() entityName!: string;
  @Input() data!: any[];
  @Input() dto!: any;
  @Input() filter: boolean = false;
  @Input() rowActions: boolean = false;
  @Input() selectable: boolean = false;
  @Input() viewable: boolean = false;
  @Input() editable: boolean = false;
  @Input() deleteable: boolean = false;
  @Input() expandable: boolean = false;
  @Input() addable: boolean = false;

  @Output() isViewed: EventEmitter<any> = new EventEmitter<any>();
  @Output() isEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() isDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() actionSelected: EventEmitter<ActionOptions> = new EventEmitter<ActionOptions>();
  @Output() pageSettingsUpdated: EventEmitter<any> = new EventEmitter<any>();


  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();

  pageSize: number = 5; // Default page size
  currentPage: number = 1; // Default current page
  count = 10;


  loaded = false;

  queryInitialized = false;
  criteria: any;


  columns!: any;
  expandedElement: any | null;

  dropdownItems: any = {};
  
  get displayOptions(): Options[] {
    return this.dto.options;
  }

  constructor(
    private _contactService: ContactsService,
    private _propertyService: PropertyService
  ){
  }

  async ngOnInit() {
    this.count = this.data.length + 1;
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.data.forEach(row => row.isHovered = false);
    this.dataSource.data.forEach(row => row.isActionMenuOpened = false);

    this.columns = this.displayOptions.map((option: { value: any; }) => option.value);
        
    this.addNecessaties();

    if (this.dto) {
      for (const option of this.dto.options) {
        if(option.foreignKey){
          switch(option.foreignKeyValue){
            case Entities.Contact:
              await this._contactService.getContacts().subscribe(
                result => {
                  this.dropdownItems.contactId = result;
                }
              );
              break;
            case Entities.Property:
              await this._propertyService.getProperties().subscribe(
                result => {
                  this.dropdownItems.propertyId = result;
                }
              );
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

    this.loaded = true;
  }

  addNecessaties(){
    if(this.selectable){
      this.columns.unshift('select');
    }
    
    if(this.expandable){
      this.columns.push('expand')
    }
    
    if(this.rowActions){
      this.columns.push('actions');
    }
  }

  getColumnName(key: string){
    return this.displayOptions.find(option => option.value === key)?.name;
  }

  getColumnType(key: string){
    return this.displayOptions.find(option => option.value === key)?.type;
  }

  getColumnIcon(key: string){
    return this.displayOptions.find(option => option.value === key)?.typeValue;
  }

  getColumnNullable(key: string){
    return this.displayOptions.find(option => option.value === key)?.nullable;
  }

  getColumnAction(key: string){
    return this.displayOptions.find(option => option.value === key)?.action;
  }

  getValueFromDropdownItems(column: string, row: any){
    if(this.dropdownItems[column]){
      return this.dropdownItems[column].find((item: { id: any; }) => item.id === row[column]).name;
    }
  }

  getValueFromDropdownItemsEnum(column: string, row: any){
    if(this.dropdownItems[column]){
      return this.dropdownItems[column].find((item: { id: any; }) => item.id === row[column]).name;
    }
  }
  onQueryInitialized($event: boolean) {
    this.queryInitialized = $event;
  }

  onApplyFilters(filters: any, isReloading = false): void {
    this.criteria = filters;
  }

  onViewed(row: any) {
    this.isViewed.emit(row);
  }

  onEdit(row: any){
    this.isEdit.emit(row)
  }

  onDeleted(row: any) {
    this.isDeleted.emit(row);
  }

  onActionSelected(option: ActionOptions) {
    if(option.name != 'UnRegisteredAction'){
      option.data = this.selection.selected;
    }
    
    this.actionSelected.emit(option);
  }

  onIconSelected(key: string, row: any){
    const action = this.getColumnAction(key);

    if(action){
      const option = {
        name: 'UnRegisteredAction',
        code: action,
        data: row
      }
      this.onActionSelected(option);
    }
  }

  onCreateSelected(){
    const option = {
      name: 'Create',
      code: 'CRT'
    }
    
    this.onActionSelected(option);
  }

  updateDataSource(){
    this.dataSource._updateChangeSubscription();
  }

  updateDisplayedColumns(selectedColumns: string[]): void {
    this.columns = [...selectedColumns];
    this.addNecessaties();
  }

  clearMenu(row: any){
    row.isActionMenuOpened = false;
    this.toggleHover(row, false);
  }

  toggleHover(row: any, hovering: boolean) {
    if(!row.isActionMenuOpened){
      row.isHovered = hovering;
    }
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  pageChanged(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    this.pageSettingsUpdated.emit({currentPage: this.currentPage, pageSize: this.pageSize})
  }
  
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  enumToArray(enumObject: any): { id: any; name: any }[] {
    return Object.keys(enumObject)
        .filter(key => isNaN(Number(enumObject[key]))) // Filter out enum keys with numeric values
        .map(key => ({ id: Number(key) , name: enumObject[key] }));
  }


}
