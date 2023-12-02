import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SelectItem } from 'primeng/api';
import { Language } from './language.type';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { TranslationService } from './translation.service';

@Component({
  selector: 'app-translation-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    InputTextareaModule,
    CommonModule,
  ],
  templateUrl: './translation-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationFormComponent {
  protected translationForm = new FormGroup({
    text: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fromLanguage: new FormControl<Language | ''>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    toLanguage: new FormControl<Language | ''>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected fromLanguageOptions: SelectItem<Language>[] = [
    this.createOptionForLanguage('person'),
    this.createOptionForLanguage('labrador'),
    this.createOptionForLanguage('poodle'),
    this.createOptionForLanguage('parakeet'),
  ];

  protected toLanguageOptions: SelectItem<Language>[] = [];

  protected toOptionsPerFromLanguage: Map<Language, SelectItem<Language>[]> =
    new Map([
      [
        'person',
        [
          this.createOptionForLanguage('labrador'),
          this.createOptionForLanguage('poodle'),
          this.createOptionForLanguage('parakeet'),
          this.createOptionForLanguage('parrot'),
        ],
      ],
      [
        'labrador',
        [
          this.createOptionForLanguage('poodle'),
          this.createOptionForLanguage('parrot'),
        ],
      ],
      [
        'poodle',
        [
          this.createOptionForLanguage('labrador'),
          this.createOptionForLanguage('parrot'),
        ],
      ],
      ['parakeet', [this.createOptionForLanguage('parrot')]],
    ]);

  private createOptionForLanguage(language: Language): SelectItem<Language> {
    return { label: this.getLabelForLanguage(language), value: language };
  }

  private getLabelForLanguage(language: Language): string {
    switch (language) {
      case 'person':
        return 'Mens';
      case 'labrador':
        return 'Labrador';
      case 'poodle':
        return 'Poedel';
      case 'parakeet':
        return 'Parkiet';
      case 'parrot':
        return 'Papegaai';
    }
  }

  protected onFromLanguageChange(event: DropdownChangeEvent): void {
    if (event.value) {
      this.toLanguageOptions =
        this.toOptionsPerFromLanguage.get(event.value) ?? [];
    } else {
      this.toLanguageOptions = [];
    }
  }

  protected onSubmit(): void {
    TranslationService.translate(
      this.translationForm.controls.text.value,
      this.translationForm.controls.fromLanguage.value,
      this.translationForm.controls.toLanguage.value
    );
  }
}
