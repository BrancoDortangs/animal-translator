import { Injectable } from '@angular/core';
import { FromLanguage, FromLanguageOption, ToLanguage } from './language.type';
import { Line, Lines } from '../lines/lines.type';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private static readonly labradorReplacement = 'woef';
  private static readonly poodleReplacement = 'woefie';
  public static readonly parakeetStartsWithVowelReplacement = 'tjilp';
  public static readonly parakeetStartsWithConsonantReplacement = 'piep';
  private static readonly burp = 'Burp!';
  private static readonly cheers = 'Proost!';

  public static translate(
    text: string,
    to: ToLanguage,
    isDrunk: boolean,
    isSmallSize: boolean
  ): Lines {
    const result: Lines = [];
    const phrases: string[] = TranslationService.getLines(text);
    for (let i = 0; i < phrases.length; i++) {
      const phrase = phrases[i];

      const line: Line = TranslationService.replaceWithDrunkWords(
        TranslationService.replaceWords(phrase, to)
      );

      if (to === 'parakeet' && isSmallSize && line.length > 10) {
        for (let i = 0; i < line.length; i += 10) {
          result.push(line.slice(i, i + 10));
        }
      } else {
        result.push(line);
      }

      if (isDrunk) {
        if (i !== phrases.length - 1) {
          result.push([TranslationService.cheers]);
        }
      }
    }

    if (isDrunk) {
      result.push([TranslationService.burp]);
    }

    return result;
  }

  /**
   * A line is a group of words which is followed by a dot, question mark or exclamation mark.
   * @param {string} text The input text.
   * @returns {Lines} An array with the lines including the dot, question mark or exclamation mark. But without the first space.
   */
  private static getLines(text: string): string[] {
    return text.split(/(?<=[.?!]) +/);
  }

  private static replaceWords(phrase: string, to: ToLanguage): Line {
    switch (to) {
      case 'labrador':
        return TranslationService.getWords(
          phrase.replaceAll(/\w+/gi, TranslationService.labradorReplacement)
        );
      case 'poodle':
        return TranslationService.getWords(
          phrase.replaceAll(/\w+/gi, TranslationService.poodleReplacement)
        );
      case 'parakeet':
        return TranslationService.getWords(
          phrase
            .replaceAll(
              /\b[bcdfghjklmnpqrstvwxyz0-9_]\w+/gi,
              TranslationService.parakeetStartsWithConsonantReplacement
            )
            .replaceAll(
              /\b[aeiou]\w+/gi,
              TranslationService.parakeetStartsWithVowelReplacement
            )
        );
      case 'parrot':
        return TranslationService.getWords(phrase);
    }
  }

  private static replaceWithDrunkWords(line: Line): Line {
    return line.map((word: string, index: number) => {
      if ((index + 1) % 4 !== 0) {
        return word;
      }
      const chars: string[] = word.split('');
      chars.reverse();
      return chars.join('');
    });
  }

  private static getWords(phrase: string): string[] {
    return phrase.split(/\W(?=.)/);
  }

  public static matchesFromLanguage(
    text: string,
    from: FromLanguageOption
  ): boolean {
    switch (from) {
      case 'person':
        return TranslationService.languageIsPerson(text);
      case 'labrador':
        return TranslationService.languageIsLabrador(text);
      case 'poodle':
        return TranslationService.languageIsPoodle(text);
      case 'parakeet':
        return TranslationService.languageIsParakeet(text);
    }
    return false;
  }

  public static detectLanguage(text: string): FromLanguage | null {
    if (TranslationService.languageIsParakeet(text)) {
      return 'parakeet';
    } else if (TranslationService.languageIsPoodle(text)) {
      return 'poodle';
    } else if (TranslationService.languageIsLabrador(text)) {
      return 'labrador';
    } else if (TranslationService.languageIsPerson(text)) {
      return 'person';
    } else {
      return null;
    }
  }

  private static languageIsParakeet(text: string): boolean {
    return /^(\s*(tjilp|piep)(\W+|$))+$/gi.test(text);
  }

  private static languageIsPoodle(text: string): boolean {
    return /^(\W*(woefie)(\W+|$))+$/gi.test(text);
  }

  private static languageIsLabrador(text: string): boolean {
    return /^(\W*(woef)(\W+|$))+$/gi.test(text);
  }

  private static languageIsPerson(text: string): boolean {
    return /^(\W*\w+(\W+|$))+$/gi.test(text);
  }
}
