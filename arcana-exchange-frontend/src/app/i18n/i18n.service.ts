import { Injectable, computed, signal } from '@angular/core';
import { translations } from './translations';
import { Card } from '../model/card';

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations['ru'];

const COOKIE_NAME = 'arcana_language';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly languageSignal = signal<Language>(this.loadLanguage());

  readonly language = this.languageSignal.asReadonly();

  readonly t = computed(() => {
    const language = this.languageSignal();

    return (key: TranslationKey) => translations[language][key];
  });

  cardName(card: Card) {
    return this.languageSignal() === 'ru'
      ? card.nameRu
      : card.nameEn;
  }

  setLanguage(language: Language) {
    this.languageSignal.set(language);
    document.cookie = `${COOKIE_NAME}=${language}; path=/; max-age=31536000; SameSite=Lax`;
  }

  private loadLanguage(): Language {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    const language = match?.[1];

    return language === 'en' || language === 'ru' ? language : 'ru';
  }
}