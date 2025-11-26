import CombattantRepo from '@src/repos/CombattantRepo';
import { ICombattant } from '@src/models/combattants';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/util/route-errors';

/******************************************************************************
                                Constants
******************************************************************************/

export const COMBATTANT_NOT_FOUND_ERR = 'Combattant non trouvée';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Lire toutes les combattants
 */
function getAll(): Promise<ICombattant[]> {
  return CombattantRepo.getAll();
}

/**
 * Lire un combattant par son id
 */
function getOne(id: string): Promise<ICombattant | null> {
  return CombattantRepo.getOne(id);
}

/**
 * Lire tous les combattants par leurs catégories
 */
function getByCategorie(categorie: string): Promise<ICombattant[]> {
  return CombattantRepo.getByCategorie(categorie);
}
 
/**
 * Lire tous les combattants par une technique favorite
 */
function getByTechniqueFavorite(technique: string): Promise<ICombattant[]> {
  return CombattantRepo.getByTechniqueFavorite(technique);
}

/**
 * Lire tous les combattants par leurs nationalité
 */
function getByNationalite(nationalite: string): Promise<ICombattant[]> {
  return CombattantRepo.getByNationalite(nationalite);
}


/**
 * Ajoute un combattant 
 */
async function addOne(combattant: ICombattant): Promise<void> {
  return CombattantRepo.add(combattant);
}

/**
 * Mettre à jour un combattant
 */
async function updateOne(combattant: ICombattant): Promise<void> {
  const persists = await CombattantRepo.getOne(combattant.id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, COMBATTANT_NOT_FOUND_ERR);
  }
  // Return user
  return CombattantRepo.update(combattant);
}

/**
 * Delete un combattant
 */
async function delete_(id: string): Promise<void> {
  const persists = await CombattantRepo.getOne(id); 
  if (!persists) {    
    throw new RouteError(HttpStatusCodes.NOT_FOUND, COMBATTANT_NOT_FOUND_ERR);
  }
  return CombattantRepo.delete_(id);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  getOne,
  getByCategorie,
  getByTechniqueFavorite,
  getByNationalite,
  addOne,
  updateOne,
  delete_,
} as const;
