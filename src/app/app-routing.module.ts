import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraphComponent }   from './graph/graph.component';
import { GraphReviewComponent }   from './graph-review/graph-review.component';

const routes: Routes = [
  { path: 'home', component: GraphComponent },
  { path: 'review', component: GraphReviewComponent },
  { path: '', component: GraphComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
