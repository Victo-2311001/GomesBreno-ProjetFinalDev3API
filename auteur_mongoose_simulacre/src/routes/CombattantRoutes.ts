import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { IReq, IRes } from './common/types';
import CombattantService from '@src/services/CombattantService';
import { ICombattant } from '@src/models/combattants';

// **** Functions **** //

/**
 * Extraire tous les combattants
 */
async function getAll(_: IReq, res: IRes) {
  const combattants = await CombattantService.getAll();
  return res.status(HttpStatusCodes.OK).json({ combattants });
}

/**
 * Extraire un combattant par son id
 */
async function getOne(req: IReq, res: IRes) {
  const { id } = req.params;
  const combattant = await CombattantService.getOne(id as string);
  return res.status(HttpStatusCodes.OK).json({ combattant });
}

/**
 * Extraire tous les combattants par leurs catégories
 */
async function getByCategorie(req: IReq, res: IRes) {   
    const { categorie } = req.params;
    const combattants = await CombattantService.getByCategorie(categorie as string);
    return res.status(HttpStatusCodes.OK).json({ combattants });
}   

/**
 * Extraire tous les combattants par une technique favorite
 */ 
async function getByTechniqueFavorite(req: IReq, res: IRes) {
    const { technique } = req.params;
    const combattants = await CombattantService.getByTechniqueFavorite(technique as string);
    return res.status(HttpStatusCodes.OK).json({ combattants });
}

/**
 * Extraire tous les combattants par leurs nationalité
 */
async function getByNationalite(req: IReq, res: IRes) {
    const { nationalite } = req.params;
    const combattants = await CombattantService.getByNationalite(nationalite as string);
    return res.status(HttpStatusCodes.OK).json({ combattants });
}

/**
 * Ajouter un combattant
 */
async function add(req: IReq, res: IRes) {
  const { combattant } = req.body;
  await CombattantService.addOne(combattant as ICombattant);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Mettre à jour un combattant
 */
async function update(req: IReq, res: IRes) {
  const { combattant } = req.body;
  await CombattantService.updateOne(combattant as ICombattant);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Supprimer un combattant
 */
async function delete_(req: IReq, res: IRes) {
  const { id } = req.params;
  await CombattantService.delete_(id as string);
  return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //

export default {
  getAll,
  getOne,
  getByCategorie,
  getByTechniqueFavorite,
  getByNationalite,
  add,
  update,
  delete: delete_,
} as const;
