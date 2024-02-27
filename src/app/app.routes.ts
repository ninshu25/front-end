import {Routes} from "@angular/router";


export const ROUTES: Routes = [
  {path: '', loadChildren: () => import('./layouts/layouts.routes').then(m=>m.LAYOUT_ROUTES)},
];

