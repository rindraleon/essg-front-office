// Point d'entrée unique des exports du répertoire "services".
export { default as actualiteService } from './actualite.service';
export {
  ADMISSION_MAX_FILE_SIZE,
  ACCEPTED_PROOF_TYPES,
  isProofFileValid,
  formatFileSize,
  formatFileType,
  admissionService,
  AdmissionService,
} from './admission.service';
export { createContactMessage } from './contact.service';
export { default as formationService } from './formation.service';
export { default as partenaireService } from './partenaire.service';
export { default as projetService } from './projet.service';
export { default as ressourceHumaineService } from './ressource-humaine.service';
export { getAdmissionSettings, default as settingsService } from './settings.service';
export type { AdmissionSettings } from './settings.service';
