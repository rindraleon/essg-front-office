import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Scale,
  Server,
  ShieldCheck,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

import { PageHero, Breadcrumb, RevealOnScroll, StaggerReveal } from '@/components';
import { SITE_HERO_IMAGE } from '@/constants';
import { useTitle, useScrollToTop } from '@/hooks';

const HERO_IMAGE = SITE_HERO_IMAGE;

const MentionsLegalesPage: React.FC = () => {
  useScrollToTop();
  useTitle('Mentions Légales | ESSG');

  const sections = [
    {
      id: 'editeur',
      icon: <Building2 className="size-6 text-brand-600" />,
      title: '1. Éditeur de la Plateforme',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>
            Le site officiel de l’<strong>École Supérieure de Sciences Géomatiques (ESSG)</strong>{' '}
            est édité par l’établissement d'enseignement supérieur ESSG, rattaché à l’Université de
            Fianarantsoa.
          </p>
          <ul className="space-y-2 rounded-xl border border-ink-100 bg-ink-50/60 p-4">
            <li className="flex items-center gap-2">
              <Building2 className="size-4 shrink-0 text-brand-600" />
              <span>
                <strong>Dénomination :</strong> École Supérieure de Sciences Géomatiques (ESSG)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-brand-600" />
              <span>
                <strong>Siège :</strong> Campus Universitaire d'Andrainjato, BP 1264, Fianarantsoa
                (301), Madagascar
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-brand-600" />
              <span>
                <strong>Téléphone :</strong> +261 38 18 282 49
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-brand-600" />
              <span>
                <strong>Email :</strong> contact@essg.sn
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Globe className="size-4 shrink-0 text-brand-600" />
              <span>
                <strong>Site Web :</strong> https://www.essg.sn
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'direction',
      icon: <UserCheck className="size-6 text-brand-600" />,
      title: '2. Direction de la Publication & Rédaction',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>
            <strong>Directeur de la publication :</strong> La Direction Générale de l’École
            Supérieure de Sciences Géomatiques.
          </p>
          <p>
            <strong>Responsable de la rédaction technique & scientifique :</strong> Le Comité
            Pédagogique et Scientifique de l’ESSG.
          </p>
          <p>
            Pour toute question relative aux contenus publiés ou aux programmes académiques, vous
            pouvez contacter la direction pédagogique à l'adresse{' '}
            <a
              href="mailto:contact@essg.sn"
              className="font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
            >
              contact@essg.sn
            </a>
            .
          </p>
        </div>
      ),
    },
    {
      id: 'hebergement',
      icon: <Server className="size-6 text-brand-600" />,
      title: '3. Hébergement & Infrastructure Technique',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>
            La plateforme web, l'API et les bases de données de l’ESSG sont hébergées sur une
            infrastructure cloud sécurisée conforme aux standards de haute disponibilité et de
            protection des données :
          </p>
          <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-4 space-y-1.5">
            <p>
              <strong>Infrastructure :</strong> Serveurs Cloud Haute Sécurité (Datacenter certifié
              ISO/IEC 27001)
            </p>
            <p>
              <strong>Stockage des documents :</strong> Espace de stockage d'objets privé chiffré
              (S3/MinIO compatible)
            </p>
            <p>
              <strong>Certificat SSL/TLS :</strong> Chiffrement de bout en bout des flux (HTTPS 256
              bits)
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'propriete',
      icon: <Scale className="size-6 text-brand-600" />,
      title: '4. Propriété Intellectuelle & Droits d’Auteur',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>
            L’ensemble des éléments constituant ce site (textes, graphismes, logos, photographies,
            vidéos, icônes, animations, architecture logicielle et code source) est la propriété
            exclusive de l’<strong>ESSG</strong> ou fait l'objet d'une autorisation d'utilisation
            concédée par ses partenaires.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication ou adaptation totale ou
            partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est
            strictement interdite sans l'accord préalable écrit de la direction de l'ESSG.
          </p>
          <p className="rounded-lg bg-amber-50 p-3 text-caption text-amber-800 border border-amber-200">
            Toute exploitation non autorisée du site ou de l’un quelconque de ses éléments sera
            considérée comme constitutive d’une contrefaçon et poursuivie conformément aux
            dispositions légales en vigueur.
          </p>
        </div>
      ),
    },
    {
      id: 'protection-donnees',
      icon: <ShieldCheck className="size-6 text-brand-600" />,
      title: '5. Protection des Données Personnelles',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>
            L’ESSG accorde une importance primordiale à la confidentialité et à la sécurité de vos
            données personnelles. Les informations collectées dans le cadre des formulaires
            d’admission, de contact ou d'inscription font l’objet d’un traitement automatisé
            sécurisé.
          </p>
          <p>
            Pour prendre connaissance de vos droits (accès, rectification, suppression, limitation)
            et des modalités de traitement, veuillez consulter notre{' '}
            <Link
              to="/politique-confidentialite"
              className="inline-flex items-center gap-1 font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
            >
              Politique de Confidentialité
              <ArrowRight className="size-3.5" />
            </Link>
            .
          </p>
        </div>
      ),
    },
    {
      id: 'responsabilite',
      icon: <FileText className="size-6 text-brand-600" />,
      title: '6. Limitation de Responsabilité & Liens Hypertextes',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>
            L'ESSG s'efforce de fournir des informations aussi précises que possible concernant ses
            programmes, cursus et actualités. Toutefois, elle ne saurait être tenue responsable des
            omissions, inexactitudes ou carences dans la mise à jour des informations.
          </p>
          <p>
            Le site peut contenir des liens vers d'autres sites web (partenaires institutionnels,
            ministères, universités). L'ESSG n'exerce aucun contrôle sur le contenu de ces sites
            tiers et décline toute responsabilité quant à leurs pratiques ou contenus.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Mentions légales ESSG"
        title="Mentions Légales"
        description="Informations institutionnelles, juridiques et réglementaires relatives au site officiel de l'École Supérieure de Sciences Géomatiques."
        minHeight="60vh"
      />

      <Breadcrumb items={[{ label: 'Mentions légales' }]} />

      <section className="section-y-tight">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll variant="fade-up" className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-caption font-semibold text-brand-800">
              <ShieldCheck className="size-3.5" />
              Cadre Réglementaire & Juridique
            </span>
            <h2 className="mt-3 text-h2 font-bold text-ink-900">
              Transparence & Conformité Institutionnelle
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-body text-ink-600">
              Dernière mise à jour :{' '}
              {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
          </RevealOnScroll>

          <StaggerReveal step={100} className="space-y-6">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="group rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all duration-300 hover:border-brand-200 hover:shadow-card-hover sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-transform duration-300 group-hover:scale-105">
                    {section.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-h4 font-bold text-ink-900 group-hover:text-brand-800">
                      {section.title}
                    </h3>
                    <div className="mt-4">{section.content}</div>
                  </div>
                </div>
              </article>
            ))}
          </StaggerReveal>

          <RevealOnScroll variant="scale-in" delay={150} className="mt-12">
            <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-900 via-brand-800 to-ink-900 p-8 text-white shadow-elevated sm:flex-row">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-h4 font-bold text-white">
                  Une question juridique ou administrative ?
                </h3>
                <p className="text-small text-ink-200">
                  Notre secrétariat général et notre équipe administrative sont à votre disposition.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-400 px-5 py-3 text-small font-semibold text-ink-950 shadow-sm transition-transform duration-200 hover:scale-[1.03] hover:bg-brand-300"
              >
                Contacter l'ESSG
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default MentionsLegalesPage;
