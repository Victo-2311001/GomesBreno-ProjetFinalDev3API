import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { IReq, IRes } from './common/types';
import UtilisateurService from '@src/services/UtilisateurService';


async function connexion(req: IReq, res: IRes) {
  const { email, motDePasse } = req.body as { email: string; motDePasse: string }; 
  
  const utilisateur = await UtilisateurService.getByEmail(email);
  
  if (!utilisateur) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({ 
      success: false, 
      message: 'Email ou mot de passe incorrect' 
    });
  }

  if (utilisateur.motDePasse != motDePasse) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({ 
      success: false, 
      message: 'Email ou mot de passe incorrect' 
    });
  }
  
  return res.status(HttpStatusCodes.OK).json({ 
    success: true,
    utilisateur: utilisateur.email 
  });
}

export default {
  connexion,
} as const;
