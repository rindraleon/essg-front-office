export type HeroAction = {
  readonly label: string;
  readonly to: string;
  readonly variant?: 'primary' | 'outline';
};

export type SectionOneProps = {
  readonly title?: string;
  readonly subtitle?: string;
  readonly actions?: ReadonlyArray<HeroAction>;
  readonly imageSrc?: string;
  readonly imageAlt?: string;
  readonly showTemplateNotice?: boolean;
};

export type LocalisationSectionProps = {
  readonly title?: string;
  readonly description?: string;
  readonly addressLabel?: string;
  readonly address?: string;
  readonly contactLabel?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly mapTitle?: string;
  readonly latitude?: number;
  readonly longitude?: number;
};
