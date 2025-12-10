import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { IReq, IRes } from './common/types';
import UtilisateurService from '@src/services/UtilisateurService';

async function getByEmail(req: IReq, res: IRes){
  const {email} = req.params;
  const utilisateur = await UtilisateurService.getByEmail(email as string);
  return res.status(HttpStatusCodes.OK).json({ utilisateur });
}

export default {
  getByEmail,
} as const;
