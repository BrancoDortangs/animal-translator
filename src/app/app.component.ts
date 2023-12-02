import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationFormComponent } from './translation-form/translation-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TranslationFormComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected title = 'Dieren vertaler';
}
