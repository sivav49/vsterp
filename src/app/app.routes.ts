import {Routes} from '@angular/router';
import {BasicLayoutComponent} from './view/basic-layout/basic-layout.component';
import {DashboardComponent} from './view/dashboard/dashboard.component';
/**
 * Created by sivarajan on 6/5/17.
 */


export const ROUTES: Routes = [
  {path: '', redirectTo: 'starterView', pathMatch: 'full'},
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {path: 'starterView', component: DashboardComponent}
    ]
  }
];
