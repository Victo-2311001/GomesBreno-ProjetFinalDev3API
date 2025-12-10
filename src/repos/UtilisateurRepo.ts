import {IUtilisateur, Utilisateur} from '@src/models/utilisateurs';

async function getByEmail(email: string): Promise<IUtilisateur | null> {
  const utilisateur = await Utilisateur.findOne({email: email});
  return utilisateur;
}

export default{
  getByEmail,
} as const;