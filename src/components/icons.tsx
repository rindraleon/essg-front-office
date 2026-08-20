import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Banknote,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock,
  CloudUpload,
  ContactRound,
  Database,
  ExternalLink,
  Eye,
  FileText,
  Flag,
  Globe,
  GraduationCap,
  Handshake,
  History,
  Home,
  Images,
  Landmark,
  Mail,
  Map,
  MapPin,
  Menu,
  MessageSquare,
  Newspaper,
  NotebookPen,
  Phone,
  Rocket,
  Save,
  Search,
  Send,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';

type IconSx = {
  fontSize?: number | string;
  color?: string;
  mt?: number;
  flexShrink?: number;
};

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  sx?: IconSx;
  fontSize?: 'small' | 'medium' | 'large' | 'inherit' | number;
}

const makeIcon =
  (LucideIcon: LucideIcon): React.FC<IconProps> =>
  ({ sx, fontSize, className, style, ...props }) => {
    const size =
      typeof fontSize === 'number'
        ? fontSize
        : fontSize === 'small'
          ? 16
          : fontSize === 'large'
            ? 28
            : typeof sx?.fontSize === 'number'
              ? sx.fontSize
              : 20;

    return (
      <LucideIcon
        size={size}
        className={className}
        style={{
          ...(sx?.color ? { color: sx.color } : {}),
          ...(sx?.mt ? { marginTop: sx.mt } : {}),
          ...style,
        }}
        {...props}
      />
    );
  };

/* ---- Icônes (noms MUI → lucide-react) ---- */
export const ArrowForwardRoundedIcon = makeIcon(ArrowRight);
export const ArrowBackRoundedIcon = makeIcon(ArrowLeft);
export const SchoolRoundedIcon = makeIcon(GraduationCap);
export const CloseRoundedIcon = makeIcon(X);
export const CloseIcon = makeIcon(X);
export const CalendarTodayRoundedIcon = makeIcon(CalendarDays);
export const SearchRoundedIcon = makeIcon(Search);
export const RoomRoundedIcon = makeIcon(MapPin);
export const LocationOnRoundedIcon = makeIcon(MapPin);
export const PersonRoundedIcon = makeIcon(User);
export const GroupsRoundedIcon = makeIcon(Users);
export const EmailRoundedIcon = makeIcon(Mail);
export const MailRoundedIcon = makeIcon(Mail);
export const WorkRoundedIcon = makeIcon(Briefcase);
export const RocketLaunchRoundedIcon = makeIcon(Rocket);
export const PublicRoundedIcon = makeIcon(Globe);
export const LanguageRoundedIcon = makeIcon(Globe);
export const PhoneRoundedIcon = makeIcon(Phone);
export const HelpOutlineRoundedIcon = makeIcon(CircleHelp);
export const AutoStoriesRoundedIcon = makeIcon(BookOpen);
export const MenuBookRoundedIcon = makeIcon(BookOpen);
export const AccessTimeRoundedIcon = makeIcon(Clock);
export const WorkspacePremiumRoundedIcon = makeIcon(Award);
export const VisibilityRoundedIcon = makeIcon(Eye);
export const StarRoundedIcon = makeIcon(Star);
export const NewspaperRoundedIcon = makeIcon(Newspaper);
export const HandshakeRoundedIcon = makeIcon(Handshake);
export const FlagRoundedIcon = makeIcon(Flag);
export const ChevronRightRoundedIcon = makeIcon(ChevronRight);
export const ChevronLeftRoundedIcon = makeIcon(ChevronLeft);
export const KeyboardArrowRightRoundedIcon = makeIcon(ChevronRight);
export const KeyboardArrowLeftRoundedIcon = makeIcon(ChevronLeft);
export const CheckCircleRoundedIcon = makeIcon(CheckCircle2);
export const ApartmentRoundedIcon = makeIcon(Building2);
export const TrendingUpRoundedIcon = makeIcon(TrendingUp);
export const SubjectRoundedIcon = makeIcon(NotebookPen);
export const StorageRoundedIcon = makeIcon(Database);
export const ShareRoundedIcon = makeIcon(Share2);
export const SendRoundedIcon = makeIcon(Send);
export const SaveRoundedIcon = makeIcon(Save);
export const PhotoLibraryRoundedIcon = makeIcon(Images);
export const OpenInNewRoundedIcon = makeIcon(ExternalLink);
export const OpenInNewIcon = makeIcon(ExternalLink);
export const MessageRoundedIcon = makeIcon(MessageSquare);
export const MenuIcon = makeIcon(Menu);
export const MapRoundedIcon = makeIcon(Map);
export const ExpandMoreRoundedIcon = makeIcon(ChevronDown);
export const DescriptionRoundedIcon = makeIcon(FileText);
export const ContactIcon = makeIcon(ContactRound);
export const CloudUploadRoundedIcon = makeIcon(CloudUpload);
export const AutoAwesomeRoundedIcon = makeIcon(Sparkles);
export const AttachMoneyRoundedIcon = makeIcon(Banknote);
export const AccountBalanceRoundedIcon = makeIcon(Landmark);
export const HistoryRoundedIcon = makeIcon(History);
export const HomeRoundedIcon = makeIcon(Home);
export const FilterListRoundedIcon = makeIcon(SlidersHorizontal);
export const InsertLinkOutlined = makeIcon(ExternalLink);

/** Icône par défaut générique */
export const GenericIcon = makeIcon(Sparkles);
