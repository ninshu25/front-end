import {Routes} from "@angular/router";
import {ShellComponent} from "./shell.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { PropertiesComponent } from "./properties/properties.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PropertyComponent } from "./property/property.component";



export const LAYOUT_ROUTES: Routes = [
  {
    path: '', component: ShellComponent, 
    children:[
      {path: '', redirectTo:'dashboard', pathMatch: 'full'},
      {path: 'contacts', component: ContactsComponent},
      {path: 'properties', component: PropertiesComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'properties/:id', component: PropertyComponent},
    ]
  },
  {path: '', redirectTo:'/dashboard', pathMatch: 'full'}
];
