import { Routes } from '@angular/router';
import { PhonebookComponent } from './phonebook/phonebook.component';

export const routes: Routes = [
  { path: '', redirectTo: '/phonebook', pathMatch: 'full' },
  { path: 'phonebook', component: PhonebookComponent },
];
