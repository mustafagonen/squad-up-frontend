import { Routes } from '@angular/router';
import { MgSquadBuilderComponent } from './components/squad-builder/squad-builder.component';
import { MgTacticalBoardComponent } from './components/squad-test/tactical-board.component';
import { MgSquadListComponent } from './components/squad-list/squad-list.component';

export const routes: Routes = [

  { path: 'squad-builder/:id', title: "Kadro Kur", component: MgSquadBuilderComponent },
  { path: 'squad-builder', title: "Kadro Kur", component: MgSquadBuilderComponent },
  { path: 'tactical-board', title: "Taktik Tahtası", component: MgTacticalBoardComponent },
  { path: 'squad-list', title: "Kadrolar", component: MgSquadListComponent },

  { path: '', redirectTo: '/squad-builder', pathMatch: 'full' },
  { path: '**', component: MgSquadBuilderComponent },
];
