import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Cookie,
  Database,
  Eye,
  FileCheck,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

import { PageHero, Breadcrumb, RevealOnScroll, StaggerReveal } from '@/components';
import { SITE_HERO_IMAGE } from '@/constants';
import { useTitle, useScrollToTop } from '@/hooks';

const HERO_IMAGE = SITE_HERO_IMAGE;

const PolitiqueConfidentialitePage: React.FC = () => {
  useScrollToTop();
  useTitle('Politique de Confidentialité | ESSG');

  const principles = [
    {
      icon: <Shield className="size-5 text-brand-600" />,
      title: 'Transparence totale',
      description:
        'Nous vous informons clairement sur la nature des données collectées et leur finalité.',
    },
    {
      icon: <Lock className="size-5 text-brand-600" />,
      title: 'Stockage sécurisé',
      description: 'Vos documents et justificatifs académiques sont chiffrés dans un bucket privé.',
    },
    {
      icon: <UserCheck className="size-5 text-brand-600" />,
      title: 'Contrôle de vos droits',
      description:
        'Accédez, rectifiez ou demandez la suppression de vos données sur simple demande.',
    },
  ];

  const sections = [
    {
      id: 'responsable',
      icon: <UserCheck className="size-6 text-brand-600" />,
      title: '1. Responsable du Traitement des Données',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>
            Le responsable du traitement des données personnelles collectées sur le site est l’
            <strong>École Supérieure de Sciences Géomatiques (ESSG)</strong>, située au Campus
            Universitaire d'Andrainjato, Fianarantsoa, Madagascar.
          </p>
          <p>
            Pour toute demande relative à vos données personnelles ou pour exercer vos droits, vous
            pouvez contacter notre délégué à la protection des données par email à :{' '}
            <a
              href="mailto:contact@essg.sn"
              className="font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
            >
              contact@essg.sn
            </a>
            .
          </p>
        </div>
      ),
    },
    {
      id: 'donnees-collectees',
      icon: <Database className="size-6 text-brand-600" />,
      title: '2. Données Personnelles Collectées',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>
            Dans le cadre de l'utilisation de nos services en ligne, nous collectons les données
            suivantes :
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ink-100 bg-ink-50/70 p-4">
              <strong className="block text-ink-900 mb-1.5 flex items-center gap-1.5">
                <FileCheck className="size-4 text-brand-600" /> Candidatures d'Admission
              </strong>
              <ul className="list-disc pl-4 space-y-1 text-caption text-ink-600">
                <li>Nom, Prénom(s), date et lieu de naissance, nationalité, sexe, adresse</li>
                <li>Email et numéro de téléphone portable</li>
                <li>Parcours scolaire (type, série, numéro d'inscription et année du Bac)</li>
                <li>Antécédents universitaires pour le Master (établissement, matricule)</li>
                <li>
                  Pièces justificatives scannées (relevé de notes, diplôme, acte d'état civil,
                  photo, reçu de versement)
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-ink-100 bg-ink-50/70 p-4">
              <strong className="block text-ink-900 mb-1.5 flex items-center gap-1.5">
                <Mail className="size-4 text-brand-600" /> Formulaires de Contact
              </strong>
              <ul className="list-disc pl-4 space-y-1 text-caption text-ink-600">
                <li>Nom, Prénom(s)</li>
                <li>Adresse email de réponse</li>
                <li>Numéro de téléphone (optionnel)</li>
                <li>Sujet et contenu du message</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'finalites',
      icon: <Eye className="size-6 text-brand-600" />,
      title: '3. Finalités du Traitement',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>Les données personnelles collectées sont exclusivement traitées pour :</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>
                <strong>Instruction des candidatures :</strong> Analyse de l'éligibilité académique,
                détection des doublons annuels et convocation aux sessions de sélection.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>
                <strong>Communication administrative :</strong> Envoi des accusés de réception,
                convocations et décisions de la commission d'admission.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>
                <strong>Réponse aux demandes d'information :</strong> Prise en charge des messages
                soumis via le formulaire de contact.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>
                <strong>Sécurité & Traçabilité :</strong> Prévention des soumissions abusives et
                sécurisation du back-office via les journaux d'activité.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'conservation',
      icon: <Clock className="size-6 text-brand-600" />,
      title: '4. Durée de Conservation des Données',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>
            L’ESSG conserve les données personnelles pour les durées strictement nécessaires aux
            finalités poursuivies :
          </p>
          <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
            <table className="w-full text-left text-caption">
              <thead className="bg-ink-50 font-semibold text-ink-800">
                <tr>
                  <th className="p-3">Type de données</th>
                  <th className="p-3">Durée de conservation</th>
                  <th className="p-3">Sort final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 text-ink-600">
                <tr>
                  <td className="p-3 font-medium text-ink-900">Dossiers d'admission retenus</td>
                  <td className="p-3">Durée de la scolarité + 5 ans d'archivage</td>
                  <td className="p-3">Archivage académique légal</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-ink-900">Dossiers d'admission non retenus</td>
                  <td className="p-3">1 an après la clôture de la session</td>
                  <td className="p-3">Suppression définitive</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-ink-900">Messages de contact</td>
                  <td className="p-3">12 mois après le dernier échange</td>
                  <td className="p-3">Purge automatique</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-ink-900">Logs de sécurité & audit</td>
                  <td className="p-3">12 mois glissants</td>
                  <td className="p-3">Écrasement sécurisé</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 'securite',
      icon: <Lock className="size-6 text-brand-600" />,
      title: '5. Mesures de Sécurité & Confidentialité',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>
            Nous mettons en œuvre un ensemble rigoureux de mesures techniques et organisationnelles
            pour protéger vos données contre toute destruction, perte, altération ou accès non
            autorisé :
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            <li className="rounded-lg border border-ink-100 bg-ink-50/50 p-3">
              <strong className="block text-ink-900">Chiffrement TLS/HTTPS</strong>
              <span className="text-caption text-ink-500">
                Chiffrement systématique de toutes les communications entre votre navigateur et nos
                serveurs.
              </span>
            </li>
            <li className="rounded-lg border border-ink-100 bg-ink-50/50 p-3">
              <strong className="block text-ink-900">Stockage Privé Dédié</strong>
              <span className="text-caption text-ink-500">
                Les pièces jointes des candidats sont isolées dans un bucket privé avec contrôle
                d'accès strict.
              </span>
            </li>
            <li className="rounded-lg border border-ink-100 bg-ink-50/50 p-3">
              <strong className="block text-ink-900">Contrôle d'Accès RBAC</strong>
              <span className="text-caption text-ink-500">
                Seul le personnel administratif habilité et authentifié par jeton JWT peut consulter
                les dossiers.
              </span>
            </li>
            <li className="rounded-lg border border-ink-100 bg-ink-50/50 p-3">
              <strong className="block text-ink-900">Limitation de Débit (Rate Limiting)</strong>
              <span className="text-caption text-ink-500">
                Protection active contre le brute-force et le spam de soumissions automatisées.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'droits',
      icon: <ShieldAlert className="size-6 text-brand-600" />,
      title: '6. Vos Droits & Modalités d’Exercice',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>
            Conformément à la réglementation sur la protection des données, vous disposez des droits
            suivants :
          </p>
          <ul className="space-y-1.5 list-disc pl-5">
            <li>
              <strong>Droit d’accès :</strong> Obtenir la confirmation que vos données sont traitées
              et en recevoir une copie.
            </li>
            <li>
              <strong>Droit de rectification :</strong> Demander la modification d'informations
              inexactes ou incomplètes.
            </li>
            <li>
              <strong>Droit à l’effacement :</strong> Obtenir la suppression de vos données
              lorsqu’elles ne sont plus nécessaires.
            </li>
            <li>
              <strong>Droit d’opposition :</strong> Vous opposer à tout moment au traitement de vos
              données pour motifs légitimes.
            </li>
          </ul>
          <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50/80 p-4">
            <p className="text-caption text-brand-900 font-medium">
              Pour exercer l'un de ces droits, adressez votre demande accompagnée d'un justificatif
              d'identité à :{' '}
              <a
                href="mailto:contact@essg.sn"
                className="font-bold underline underline-offset-4 hover:text-brand-700"
              >
                contact@essg.sn
              </a>
              . Nous nous engageons à répondre dans un délai maximal de 30 jours.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'cookies',
      icon: <Cookie className="size-6 text-brand-600" />,
      title: '7. Cookies & Traceurs',
      content: (
        <div className="space-y-3 text-small text-ink-700">
          <p>
            Le site de l’ESSG utilise uniquement des cookies et traceurs strictement techniques
            nécessaires au bon fonctionnement de la plateforme (gestion de session
            d’authentification pour le back-office, préférences d'affichage et sécurité anti-CSRF).
          </p>
          <p>
            Aucun cookie publicitaire tiers ou de traçage commercial n’est déposé sur votre terminal
            à des fins de profilage.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Politique de confidentialité ESSG"
        title="Politique de Confidentialité"
        description="Notre engagement pour la protection, la sécurité et la confidentialité de vos données personnelles et dossiers académiques."
        minHeight="60vh"
      />

      <Breadcrumb items={[{ label: 'Politique de confidentialité' }]} />

      <section className="section-y-tight">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll variant="fade-up" className="mb-12">
            <div className="grid gap-4 sm:grid-cols-3">
              {principles.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card transition-[box-shadow,border-color] duration-200 hover:border-brand-300 hover:shadow-card-hover"
                >
                  <div className="mb-3 grid size-10 place-items-center rounded-xl bg-brand-50">
                    {item.icon}
                  </div>
                  <h3 className="text-small font-bold text-ink-900">{item.title}</h3>
                  <p className="mt-1 text-caption text-ink-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
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
                  Besoin d'une précision sur vos données ?
                </h3>
                <p className="text-small text-ink-200">
                  Notre équipe est à votre écoute pour toute demande d'accès ou de rectification.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-400 px-5 py-3 text-small font-semibold text-ink-950 shadow-sm transition-transform duration-200 hover:scale-[1.03] hover:bg-brand-300"
              >
                Nous contacter
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default PolitiqueConfidentialitePage;
