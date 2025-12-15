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

utilisateurRouter.post(Paths.Utilisateur.Connexion, UtilisateurRoutes.connexion);

//Documentation des routes (Idée proposée par l'IA mais réalisé par moi même)

apiRouter.get('/', (req: Request, res: Response) => {
  res.send(
    `<h1>API Combattants MMA</h1>
    <p>Documentation de toutes les routes disponibles</p>

    <h2>Utilisateur</h2>
    <ul>
      <li><b>POST</b> /api/utilisateur/connexion</li>
      <p> Connexion d'un utilisateur existant dans la base de donnée. </p>
    </ul>
    

    <h2>Combattants</h2>
    <ul>
      <li><b>GET</b> /api/combattants/all</li>
      <p> Récuperer tous les combatttants existants. </p>

      <li><b>GET</b> /api/combattants/:id</li>
      <p> Récuperer un combattant existant par son id. </p>

      <li><b>GET</b> /api/combattants/categorie/:categorie</li>
      <p> Récuperer tous les combattants existants selon une catégorie. </p>

      <li><b>GET</b> /api/combattants/technique/:technique</li>
      <p> Récuperer tous les combattants existants selon une téchnique. </p>

      <li><b>GET</b> /api/combattants/nationalite/:nationalite</li>
      <p> Récuperer tous les combattants existants selon une nationalité. </p>

      <li><b>POST</b> /api/combattants/add</li>
      <p> Ajouter un combattant. </p>

      <li><b>PUT</b> /api/combattants/update</li>
      <p> Mettre à jour un combattant. </p>

      <li><b>DELETE</b> /api/combattants/:id</li>
      <p> Supprimer un combattant. </p>
    </ul>
    
    <h3>Filtres disponibles</h3>

    <p><b>Catégories :</b></p>
    <ul>
      <li>poids-mouches</li>
      <li>poids-coqs</li>
      <li>poids-plumes</li>
      <li>poids-légers</li>
      <li>poids-welters</li>
      <li>poids-mi-moyens</li>
      <li>poids-moyens</li>
      <li>poids-mi-lourds</li>
      <li>poids-lourds</li>
    </ul>

    <p><b>Techniques :</b></p>
    <ul>
      <li>Jiu-Jitsu</li>
      <li>Lutte</li>
      <li>Boxe</li>
      <li>Kickboxing</li>
    </ul>
    
    <p><b>Nationalités :</b> Codes pays ISO (ex : CA, US, BR, FR, etc.)</p>`
  );
});



apiRouter.use(Paths.Combattants.Base, combattantRouter);
apiRouter.use(Paths.Utilisateur.Base, utilisateurRouter);

// **** Export default **** //

export default apiRouter;
