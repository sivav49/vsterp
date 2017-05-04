import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { JobComponent } from './core/job/job.component';
import { InvoiceComponent } from './core/invoice/invoice.component';
import { DeliveryChallanComponent } from './core/delivery-challan/delivery-challan.component';
import { EstimateComponent } from './core/estimate/estimate.component';
import { InvoiceItemComponent } from './core/invoice/invoice-item/invoice-item.component';
import { MainviewComponent } from './layout/mainview/mainview.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    DashboardComponent,
    JobComponent,
    InvoiceComponent,
    DeliveryChallanComponent,
    EstimateComponent,
    InvoiceItemComponent,
    MainviewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
