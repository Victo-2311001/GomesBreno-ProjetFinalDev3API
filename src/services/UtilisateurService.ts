import UtilisateurRepo from '@src/repos/UtilisateurRepo';
import { IUtilisateur } from '@src/models/utilisateurs';

export const UTILISATEUR_NON_TROUVE = 'Utilisateur non trouvé';

function getByEmail(email: string): Promise<IUtilisateur | null>{
  return UtilisateurRepo.getByEmail(email);
}

export default {
  getByEmail,
} as const;
