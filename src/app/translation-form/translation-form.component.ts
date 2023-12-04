import { Component, Signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import {
  FromLanguage,
  FromLanguageOption,
  Language,
  LanguageOption,
  ToLanguage,
} from './language.type';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { TranslationService } from './translation.service';
import { LinesComponent } from '../lines/lines.component';
import { Lines } from '../lines/lines.type';
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

export function textMatchesSelectedLanguage(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const textControl = control.get('text');
    const fromLanguageControl = control.get('fromLanguage');

    if (textControl) {
      if (textControl?.value && fromLanguageControl?.value) {
        if (
          fromLanguageControl.value !== 'autodetect' &&
          !TranslationService.matchesFromLanguage(
            textControl.value,
            fromLanguageControl.value
          )
        ) {
          textControl.setErrors({ textDoesNotMatchSelectedLanguage: true });
        }
      }
    }

    return null;
  };
}

@Component({
  selector: 'app-translation-form',
  standalone: true,
  templateUrl: './translation-form.component.html',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    InputTextareaModule,
    CommonModule,
    LinesComponent,
  ],
})
export class TranslationFormComponent {
  protected matchesFromLanguage = TranslationService.matchesFromLanguage;

  protected breakpointState: Signal<BreakpointState | undefined>;

  public constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointState = toSignal(
      this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    );
  }

  private detectedLanguage: FromLanguage | null = null;
  protected showLanguageCouldNotBeDetected = false;

  protected fromLanguageOptions: SelectItem<LanguageOption>[] = [
    this.createOption('autodetect'),
    this.createOption('person'),
    this.createOption('labrador'),
    this.createOption('poodle'),
    this.createOption('parakeet'),
  ];

  protected translationForm = new FormGroup(
    {
      text: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      fromLanguage: new FormControl<FromLanguageOption>('autodetect', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      toLanguage: new FormControl<Language>('labrador', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      isDrunk: new FormControl<boolean>(true, {
        nonNullable: true,
      }),
    },
    { validators: textMatchesSelectedLanguage() }
  );

  protected toLanguageOptions: SelectItem<LanguageOption>[] = [
    this.createOption('labrador'),
    this.createOption('poodle'),
    this.createOption('parakeet'),
    this.createOption('parrot'),
  ];

  protected outputLines: Lines = [];

  protected toOptionsPerFromLanguageOption: Map<
    LanguageOption,
    SelectItem<LanguageOption>[]
  > = new Map([
    [
      'autodetect',
      [
        this.createOption('labrador'),
        this.createOption('poodle'),
        this.createOption('parakeet'),
        this.createOption('parrot'),
      ],
    ],
    [
      'person',
      [
        this.createOption('labrador'),
        this.createOption('poodle'),
        this.createOption('parakeet'),
        this.createOption('parrot'),
      ],
    ],
    ['labrador', [this.createOption('poodle'), this.createOption('parrot')]],
    ['poodle', [this.createOption('labrador'), this.createOption('parrot')]],
    ['parakeet', [this.createOption('parrot')]],
  ]);

  private createOption(
    languageOption: LanguageOption
  ): SelectItem<LanguageOption> {
    return {
      label: this.getLabelForLanguage(languageOption),
      value: languageOption,
    };
  }

  protected getLabelForLanguage(languageOption: LanguageOption): string {
    switch (languageOption) {
      case 'autodetect':
        return this.detectedLanguage
          ? `${this.getLabelForLanguage(this.detectedLanguage)} gedetecteerd`
          : 'Taal herkennen';
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

  protected onTextChange(text: string): void {
    this.outputLines = [];
    this.detectedLanguage = TranslationService.detectLanguage(text);

    this.showLanguageCouldNotBeDetected = this.detectedLanguage === null;

    this.refreshFromOptions();
    this.refreshToOptions(this.detectedLanguage ?? 'autodetect');
  }

  private refreshFromOptions(): void {
    const index: number = this.fromLanguageOptions.findIndex(
      (option) => option.value === 'autodetect'
    );

    if (index !== -1) {
      this.fromLanguageOptions[index] = this.createOption('autodetect');
    }
  }

  private refreshToOptions(from: LanguageOption): void {
    if (from) {
      this.toLanguageOptions =
        this.toOptionsPerFromLanguageOption.get(from) ?? [];
    } else {
      this.toLanguageOptions = [];
    }
    if (
      !this.toLanguageOptions.some(
        (option) => option.value === this.translationForm.value.toLanguage
      )
    ) {
      this.translationForm.controls.toLanguage.setValue(
        this.toLanguageOptions[0].value as Language
      );
    }
  }

  protected onFromLanguageChange(event: DropdownChangeEvent): void {
    this.outputLines = [];
    this.refreshToOptions(event.value);
  }

  protected onToLanguageChange(_event: DropdownChangeEvent): void {
    this.outputLines = [];
  }

  protected onSubmit(): void {
    if (this.isToLanguage(this.translationForm.controls.toLanguage.value)) {
      this.outputLines = TranslationService.translate(
        this.translationForm.controls.text.value,
        this.translationForm.controls.toLanguage.value,
        this.translationForm.controls.isDrunk.value,
        this.isSmallSize()
      );
    }
  }

  protected isSmallSize(): boolean {
    return this.breakpointState()?.matches ?? false;
  }

  protected isFromLanguage(language: LanguageOption): language is FromLanguage {
    return ['person', 'labrador', 'poodle', 'parakeet'].includes(language);
  }

  protected isToLanguage(language: Language): language is ToLanguage {
    return ['labrador', 'poodle', 'parakeet', 'parrot'].includes(language);
  }
}
