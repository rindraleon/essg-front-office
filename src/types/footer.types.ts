export type NavLinkItem = {
  readonly label: string;
  readonly to: string;
};

export type ContactInfo = {
  readonly email?: string;
  readonly phone?: string;
  readonly address?: string;
};

export type SocialItem = {
  readonly href: string;
  readonly kind?: 'web' | 'linkedin' | 'facebook' | 'external';
  readonly ariaLabel?: string;
};

export type FooterProps = {
  readonly companyName?: string;
  readonly navLinks?: ReadonlyArray<NavLinkItem>;
  readonly contact?: ContactInfo;
  readonly socials?: ReadonlyArray<SocialItem>;
  readonly onSubscribe?: (email: string) => void | Promise<void>;
};
