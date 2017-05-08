import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { JobComponent } from './core/job/job.component';
import { InvoiceComponent } from './core/invoice/invoice.component';
import { DeliveryChallanComponent } from './core/delivery-challan/delivery-challan.component';
import { EstimateComponent } from './core/estimate/estimate.component';
import { BasicLayoutComponent } from './view/basic-layout/basic-layout.component';
import {RouterModule} from '@angular/router';
import {ROUTES} from './app.routes';
import { SideNavComponent } from './view/side-nav/side-nav.component';
import { TopNavComponent } from './view/top-nav/top-nav.component';
import { InvoiceEditorComponent } from './core/invoice/invoice-editor/invoice-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    JobComponent,
    InvoiceComponent,
    DeliveryChallanComponent,
    EstimateComponent,
    BasicLayoutComponent,
    SideNavComponent,
    TopNavComponent,
    InvoiceEditorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
