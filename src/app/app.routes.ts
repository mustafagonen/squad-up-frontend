import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MgSquadBuilderComponent } from './components/squad-builder/squad-builder.component';
import { MgTacticalBoardComponent } from './components/squad-test/tactical-board.component';

export const routes: Routes = [

  { path: 'squad-builder/:id', title: "Kadro Kur", component: MgSquadBuilderComponent },
  { path: 'squad-builder', title: "Kadro Kur", component: MgSquadBuilderComponent },
  { path: 'tactical-board', title: "Tactical Board", component: MgTacticalBoardComponent },

  { path: '', title: "Tactical", component: MgSquadBuilderComponent },
];
