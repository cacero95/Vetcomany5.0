import { NgModule } from '@angular/core';

import { FiltroPipe } from './filtro.pipe';
import { VetPipe } from './vet.pipe';
import { VetUsersPipe } from './vet-users.pipe';

@NgModule({
  declarations: [FiltroPipe, VetPipe, VetUsersPipe],
  exports:[FiltroPipe,VetPipe,VetUsersPipe]
})
export class PipesModule { }
