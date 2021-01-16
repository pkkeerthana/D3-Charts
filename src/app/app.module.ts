import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PiechartComponent } from './piechart/piechart.component';
import { VariableBarsComponent } from './variable-bars/variable-bars.component';
import { MultiLineComponent } from './multi-line/multi-line.component';

@NgModule({
  declarations: [
    AppComponent,
    PiechartComponent,
    VariableBarsComponent,
    MultiLineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
