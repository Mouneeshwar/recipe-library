import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';
import { PlaceHolderDirective } from './place-holder.directive';
import { DropdownDirective } from './dropdown.directive';



@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceHolderDirective,
    DropdownDirective ],
  imports: [
    CommonModule
  ],
  exports:[
    CommonModule,
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceHolderDirective,
    DropdownDirective 
  ]
})
export class SharedModule { }
