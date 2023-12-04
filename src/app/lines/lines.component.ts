import { Component, Input } from '@angular/core';
import { ToLanguage } from '../translation-form/language.type';
import { Lines } from './lines.type';
import { TranslationService } from '../translation-form/translation.service';
import { SpaceComponent } from '../space/space.component';

@Component({
  selector: 'app-lines',
  standalone: true,
  templateUrl: './lines.component.html',
  styleUrl: './lines.component.scss',
  imports: [SpaceComponent],
})
export class LinesComponent {
  protected readonly parrotPhrasePrefix = 'Ik praat je na: ';

  @Input({ required: true }) public lines: Lines = [];
  @Input({ required: true }) public language: ToLanguage = 'labrador';
  @Input({ required: true }) public isSmallSize: boolean = false;

  protected getParakeetClass(word: string): string {
    return word === TranslationService.parakeetStartsWithVowelReplacement
      ? 'font-italic'
      : '';
  }

  protected getParrotColorClass(index: number): string {
    const actualIndex = index + 1;
    if (actualIndex % 4 === 0) {
      return 'text-blue-500';
    } else if (actualIndex % 3 === 0) {
      return 'text-yellow-500';
    } else if (actualIndex % 2 === 0) {
      return 'text-green-500';
    }
    return 'text-red-500';
  }
}
