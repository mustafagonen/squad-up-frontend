import { Routes } from '@angular/router';
import { MgSquadBuilderComponent } from './components/squad-builder/squad-builder.component';
import { MgSquadListComponent } from './components/squad-list/squad-list.component';
import { MgTacticalBoardComponent } from './components/tactical-board/tactical-board.component';

export const routes: Routes = [

  { path: 'kadro-kur/:id', title: "Kadro Kur – Hayalindeki İlk 11’i Oluştur | Taktiksel", component: MgSquadBuilderComponent },
  { path: 'kadro-kur', title: "Kadro Kur – Hayalindeki İlk 11’i Oluştur | Taktiksel", component: MgSquadBuilderComponent },
  { path: 'tactical-board', title: "Taktik Tahtası", component: MgTacticalBoardComponent },
  { path: 'kurulan-kadrolar', title: "Kadrolar", component: MgSquadListComponent },

  { path: '', redirectTo: '/kadro-kur', pathMatch: 'full' },
  { path: '**', component: MgSquadBuilderComponent },
];
