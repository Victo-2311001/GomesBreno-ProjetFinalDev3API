import { Request, Response, NextFunction, Router } from 'express';

import Paths from '@src/common/constants/Paths';
import CombattantsRoutes from './CombattantRoutes';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { Combattant } from '@src/models/combattants';
import { Utilisateur } from '@src/models/utilisateurs';
import UtilisateurRoutes from './UtilisateurRoutes';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

function validateCombattant(req: Request, res: Response, next: NextFunction) {
  const body = req.body as Record<string, unknown>;
  
  if (body === null || body === undefined) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Combattant requis' })
      .end();
    return;
  }

  if (!body.combattant) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Combattant requis' })
      .end();
    return;
  }

  const nouveauCombattant = new Combattant(body.combattant);
  const error = nouveauCombattant.validateSync();
  if (error !== null && error !== undefined) {
    res.status(HttpStatusCodes.BAD_REQUEST).send(error).end();
  } else {
    next();
  }
}

// ** Add UserRouter ** //

const combattantRouter = Router();
const utilisateurRouter = Router();


combattantRouter.get(Paths.Combattants.Get, CombattantsRoutes.getAll);
combattantRouter.get(Paths.Combattants.GetOne, CombattantsRoutes.getOne);
combattantRouter.get(Paths.Combattants.GetByCategorie, CombattantsRoutes.getByCategorie);
combattantRouter.get(Paths.Combattants.GetByTechniqueFavorite, CombattantsRoutes.getByTechniqueFavorite);
combattantRouter.get(Paths.Combattants.GetByNationalite, CombattantsRoutes.getByNationalite);
combattantRouter.post(Paths.Combattants.Add, validateCombattant, CombattantsRoutes.add);
combattantRouter.put(Paths.Combattants.Update, CombattantsRoutes.update);
combattantRouter.delete(Paths.Combattants.Delete, CombattantsRoutes.delete);

utilisateurRouter.get(Paths.Utilisateur.GetByEmail, UtilisateurRoutes.getByEmail);

apiRouter.use(Paths.Combattants.Base, combattantRouter);
apiRouter.use(Paths.Utilisateur.Base, utilisateurRouter);

// **** Export default **** //

export default apiRouter;
