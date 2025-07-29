import { Routes } from '@angular/router';
import { MgSquadBuilderComponent } from './components/squad-builder/squad-builder.component';
import { MgSquadListComponent } from './components/squad-list/squad-list.component';
import { MgTacticalBoardComponent } from './components/tactical-board/tactical-board.component';
import { AuthGuard } from './guards/auth.guard';
import { MgLoginComponent } from './components/login/login.component';

export const routes: Routes = [

  { path: 'kadro-kur/:id', title: "Kadro Kur – Hayalindeki İlk 11’i Oluştur | Taktiksel", component: MgSquadBuilderComponent },
  { path: 'kadro-kur', title: "Kadro Kur – Hayalindeki İlk 11’i Oluştur | Taktiksel", component: MgSquadBuilderComponent },
  { path: 'kurulan-kadrolar', title: "Kadrolar", component: MgSquadListComponent },
  { path: 'taktik-tahtasi', title: "Taktik Tahtası", component: MgTacticalBoardComponent, canActivate: [AuthGuard] },

  { path: 'login', component: MgLoginComponent },

  { path: '', redirectTo: '/kadro-kur', pathMatch: 'full' },
  { path: '**', component: MgSquadBuilderComponent },
];
