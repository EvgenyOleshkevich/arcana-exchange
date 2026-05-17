import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService, Language } from '../../i18n/i18n.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive,],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  readonly language = this.i18n.language;

  onLanguageChange(event: Event) {
    const language = (event.target as HTMLSelectElement).value as Language;
    this.i18n.setLanguage(language);
  }
}
