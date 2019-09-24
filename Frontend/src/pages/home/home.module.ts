import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { PipesModule } from './../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    PipesModule,
    VirtualScrollerModule,
    ComponentsModule
  ],
})
export class HomePageModule {}