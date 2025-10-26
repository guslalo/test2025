import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { TitleDetails } from './title-details/title-details';
import { Favorites } from './favorites/favorites';
import { Admin } from './admin/admin';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'title/:id', component: TitleDetails },
  { path: 'favorites', component: Favorites },
  { path: 'admin', component: Admin }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
