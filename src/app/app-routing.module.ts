import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MultiLineComponent } from './multi-line/multi-line.component';
import { PiechartComponent } from './piechart/piechart.component';
import { StackedBarComponent } from './stacked-bar/stacked-bar.component';
import { VariableBarsComponent } from './variable-bars/variable-bars.component';


const routes: Routes = [
  {
    path:'' ,
    redirectTo:'dashboard',
    pathMatch:'full'
  },
  {
    path:'pie', component:PiechartComponent
  },
  {
    path:'line', component:MultiLineComponent
  },
  {
    path:'bars',component:VariableBarsComponent
  },
  {
    path:'stacked', component:StackedBarComponent
  },
  {
    path:'dashboard', component:DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
