import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultiLineComponent } from './multi-line/multi-line.component';
import { PiechartComponent } from './piechart/piechart.component';
import { VariableBarsComponent } from './variable-bars/variable-bars.component';


const routes: Routes = [
  {
    path:'pie', component:PiechartComponent
  },
  {
    path:'line', component:MultiLineComponent
  },
  {
    path:'bars',component:VariableBarsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
