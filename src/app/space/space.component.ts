import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-space',
  standalone: true,
  imports: [],
  template: `@if(show){&nbsp;}`,
})
export class SpaceComponent {
  @Input({ required: true }) public show = false;
}
