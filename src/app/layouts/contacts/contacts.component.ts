import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicGridComponent } from 'src/app/components/dynamics/grid/grid.component';
import { BaseComponent } from 'src/app/framework/base-component';
import { Contact } from 'src/app/models/classes/contact.class';
import { ActionOptions } from 'src/app/models/interfaces/action-options.interface';
import { ContactsService } from 'src/app/services/api/contacts.service';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormComponent } from 'src/app/components/dynamics/form/form.component';
import { MatTableDataSource } from '@angular/material/table';
import { ModalService } from 'src/app/services/internal/modal.service';

@Component({
  selector: 'contacts',
  standalone: true,
  imports: [DynamicGridComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent extends BaseComponent implements OnInit{
  public contacts!: Contact[];
  dto = Contact;
  options: ActionOptions[] = [
    {
      name: 'Delete',
      code: 'DLT'
    }
  ];

  @ViewChild(DynamicGridComponent) childComponent!: DynamicGridComponent;

  constructor(
    private _contactsService: ContactsService,
    private _dialog: MatDialog,
    private _modalService: ModalService){
    super();
  }

  ngOnInit(): void {
    this.pageUpdated({pageSize: 5, currentPage: 1}); 
  }

  performActionSelected(action: ActionOptions) {
    switch(action.code){
      case 'CRT':
        this.subscriptions.add(
          this._modalService.openCreateModal(this.dto, 'Contact').subscribe(
            (result: any) => {
              if(result){
                this.addContact(result);
              }
            }
          )
        );
        break;
      case 'DeleteSelected':
        break;
    }
  }

  deleteContact(contact: Contact) {
    this.subscriptions.add(
      this._contactsService.deleteContact(contact).subscribe(
        result => {
          const index = this.contacts.indexOf(contact);
          if (index !== -1) {
            this.contacts.splice(index, 1);
            this.updateDataSource();
          }
        }
      )
    );
  }

  editContact(contact: Contact){
    this.subscriptions.add(
      this._modalService.openCreateModal(this.dto, 'Contact', contact).subscribe(
        (result: any) => {
          if(result){
            Object.assign(contact, result);
            this._contactsService.updateContact(contact).subscribe();
          }
        }
      )
    );
  }

  addContact(contact: Contact){
    contact.createdDate = new Date();
    
    this.subscriptions.add(
      this._contactsService.addContact(contact).subscribe(
        result => {
          this.contacts.push(result);
          this.updateDataSource();
        }
      )
    );
  }

  updateDataSource() {
    this.childComponent.updateDataSource();
  }

  pageUpdated(pageDetails: any){
    this.subscriptions.add(
      this._contactsService.getContactsByPaging(pageDetails.currentPage, pageDetails.pageSize).subscribe(
        result => {
          this.contacts = result.data;
          if(this.childComponent){
            this.childComponent.dataSource.data = result.data;
            this.childComponent.count = result.count;
          }
        }
      )
    );
  }
}
