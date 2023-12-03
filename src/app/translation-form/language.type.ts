export type Language = 'person' | 'labrador' | 'poodle' | 'parakeet' | 'parrot';
export type LanguageOption = Language | 'autodetect';
export type FromLanguage = Exclude<Language, 'parrot'>;
export type FromLanguageOption = Exclude<LanguageOption, 'parrot'>;
export type ToLanguage = Exclude<Language, 'person'>;
export type ToLanguageOption = Exclude<LanguageOption, 'person'>;
