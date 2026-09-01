export { default as ActualiteCard } from './ActualiteCompnent/ActualiteCard';

//admission components
export { default as AdmissionForm } from './AdmissionComponents/AdmissionForm';
export {
  AdmissionSectionTitle,
  PersonalInformation,
  BacInformation,
  PreviousEducationInformation,
  LevelSelection,
  FormationSelection,
} from './AdmissionComponents/AdmissionFormSections';

//background animation
export { default as AnimatedBackground } from './animations/AnimatedBackground';
export { default as SplitTitle } from './animations/SplitTitle';
export { default as ParticlesBackground } from './animations/ParticlesBackground';

//common component
export { default as AnimatedNumber } from './common/AnimatedNumber';
export { default as AppToaster } from './common/AppToaster';
export { default as BackToTop } from './common/BackToTop';
export { default as Breadcrumb } from './common/Breadcrumb';
export type { BreadcrumbItem } from './common/Breadcrumb';
export { default as CategoryChip } from './common/CategoryChip';
export { default as DeferredSection } from './common/DeferredSection';
export { default as DetailHero } from './common/DetailHero';
export type { DetailHeroMeta } from './common/DetailHero';
export { default as DetailPageSkeleton } from './common/DetailPageSkeleton';
export { default as EmptyState } from './common/EmptyState';
export { default as FilterButton } from './common/FilterButton';
export type { FilterGroup } from './common/FilterButton';
export { default as FilterToolbar } from './common/FilterToolbar';
export { default as ImageGallery } from './common/ImageGallery';
export { default as MediaCard } from './common/MediaCard';
export type { MediaCardMeta } from './common/MediaCard';
export { MediaCardSkeleton, MediaCardSkeletonGrid } from './common/MediaCardSkeleton';
export { default as MobileCta } from './common/MobileCta';
export { default as PageHero } from './common/PageHero';
export { buildPageSequence, default as Pagination } from './common/Pagination';
export { ProfileSection, InfoTile, TagCloud, CheckList, Timeline } from './common/ProfileLayout';
export type { TimelineEntry } from './common/ProfileLayout';
export { default as QueryState } from './common/QueryState';
export { default as Reveal } from './common/Reveal';
export { RevealOnScroll, StaggerReveal } from './common/RevealOnScroll';
export type { RevealVariant } from './common/RevealOnScroll';
export { default as ScrollableCardGrid } from './common/ScrollableCardGrid';
export { default as ScrollProgress } from './common/ScrollProgress';
export { default as SectionContent } from './common/SectionContent';
export { default as SectionCta } from './common/SectionCta';
export { default as SectionHeader } from './common/SectionHeader';
export { default as ViewDetailsButton } from './common/ViewDetailsButton';
export { default as SocialLinks } from './common/SocialLinks';

//compat component
export { default as CompatButton } from './compat/button';
export {
  Card as CompatCard,
  CardContent as CompatCardContent,
  IconButton,
  Chip,
  Divider,
  Skeleton as CompatSkeleton,
  Tooltip,
  Fade,
  FormControl,
  InputLabel,
  InputAdornment,
  TextField,
  Select as CompatSelect,
  MenuItem,
} from './compat/mui';
export type { SelectChangeEvent } from './compat/mui';
export { default as ContactCard } from './Contact/ContactCard';
export { default as ContactForm } from './Contact/ContactForm';
export { default as ContactInfoCards } from './Contact/ContactInfoCards';
export { default as FormationCard } from './FormationComponents/FormationCard';
export { default as FormationDetailContent } from './FormationComponents/FormationDetailCotent';
export { default as ResponsableCard } from './FormationComponents/ResponsableCard';
export { default as ActualitesSection } from './HomeComponents/ActualitesSection';
export { default as AdmissionSection } from './HomeComponents/AdmissionSection';
export { default as FaqAccordion } from './HomeComponents/FaqAccordion';
export { default as FaqSection } from './HomeComponents/FaqSection';
export { default as FormationsSection } from './HomeComponents/FormationSection';
export { default as HeroSection } from './HomeComponents/HeroSection';
export { default as ValuesSection } from './HomeComponents/ValuesSection';
export { default as WhyChooseSection } from './HomeComponents/WhyChooseSection';
export { default as FormationsDomainSection } from './HomeComponents/FormationsDomainSection';
export { default as LocalisationSection } from './HomeComponents/LocalisationSection';
export { default as PartenairesSection } from './HomeComponents/PartenairesSection';
export { default as ProjetsSection } from './HomeComponents/ProjetsSection';
export { default as RessourceHumaineSection } from './HomeComponents/RessourceHumaineSection';
export { default as WhoWeAreSection } from './HomeComponents/WhoWeAreSection';
export { default as Footer } from './Layout/Footer';
export { default as Header } from './Layout/Header';
export { default as Layout } from './Layout/Layout';
export { default as PartenaireCard } from './PartenaireComponents/PartenaireCard';
export { default as PartnerChipCard } from './PartenaireComponents/PartnerChipCard';
export { default as MapEmbed } from './ProjetComponents/MapEmbed';
export { default as ProjetCard } from './ProjetComponents/ProjetCard';
export { default as ProjetGallery } from './ProjetComponents/ProjetGallery';
export { default as RessourceHumaineCard } from './RessourceHumaineComponents/RessourceHumaineCard';
export { Badge } from './ui/badge';
export { Button } from './ui/button';
export { buttonVariants } from './ui/button-variants';
export type { ButtonVariantsProps } from './ui/button-variants';
export type { ButtonProps } from './ui/button';
export { Checkbox } from './ui/checkbox';
export { Input } from './ui/input';
export { Label } from './ui/label';
export { Select } from './ui/select';
export { Skeleton } from './ui/skeleton';
export { Textarea } from './ui/textarea';
