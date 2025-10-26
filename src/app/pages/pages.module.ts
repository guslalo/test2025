import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing-module';
import { SharedModule } from '../shared/shared.module';

import { Home } from './home/home';
import { Dashboard } from './dashboard/dashboard';
import { TitleDetails } from './title-details/title-details';
import { Favorites } from './favorites/favorites';
import { Admin } from './admin/admin';


@NgModule({
  declarations: [
    Home,
    Dashboard,
    TitleDetails,
    Favorites,
    Admin
  ],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
