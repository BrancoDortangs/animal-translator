import { Injectable } from '@angular/core';
import { Language } from './language.type';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public static translate(
    text: string,
    from: Language | '',
    to: Language | ''
  ): string {
    return '';
  }
}
