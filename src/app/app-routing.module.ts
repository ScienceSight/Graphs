import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraphComponent }   from './graph/graph.component';

const routes: Routes = [
  { path: 'home', component: GraphComponent },
  { path: '', component: GraphComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
