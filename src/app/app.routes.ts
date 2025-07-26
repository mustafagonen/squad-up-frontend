import { Routes } from '@angular/router';
import { MgSquadBuilderComponent } from './components/squad-builder/squad-builder.component';
import { MgTacticalBoardComponent } from './components/squad-test/tactical-board.component';
import { MgSquadListComponent } from './components/squad-list/squad-list.component';

export const routes: Routes = [

  { path: 'kadro-kur/:id', title: "Kadro Kur – Hayalindeki İlk 11’i Oluştur | Taktiksel", component: MgSquadBuilderComponent },
  { path: 'kadro-kur', title: "Kadro Kur – Hayalindeki İlk 11’i Oluştur | Taktiksel", component: MgSquadBuilderComponent },
  { path: 'tactical-board', title: "Taktik Tahtası", component: MgTacticalBoardComponent },
  { path: 'kurulan-kadrolar', title: "Kurulan Kadrolar – Kullanıcıların Paylaştığı İlk 11’ler | Taktiksel", component: MgSquadListComponent },

  { path: '', redirectTo: '/kadro-kur', pathMatch: 'full' },
  { path: '**', component: MgSquadBuilderComponent },
];
