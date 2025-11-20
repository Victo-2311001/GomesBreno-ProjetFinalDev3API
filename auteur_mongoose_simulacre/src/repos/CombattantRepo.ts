import { ICombattant, Combattant } from '@src/models/combattants';

// **** Functions **** //

/**
 * Extraire tous les combattants
 */
async function getAll(): Promise<ICombattant[]> {
  const combattants = await Combattant.find();
  return combattants;
}

/**
 * Extraire combattant par son id
 */
async function getOne(id: string): Promise<ICombattant| null> {
  const combattant = await Combattant.findById(id);
  return combattant;
}

/**
 * Extraire tous les combattants par leurs catégories
 */
async function getByCategorie(categorie: string): Promise<ICombattant[]> {
  const combattants = await Combattant.find({ categorie: categorie });
  return combattants;
}

/**
 * Extraire tous les combattants par une technique favorite
 */
async function getByTechniqueFavorite(technique: string): Promise<ICombattant[]> {
  const combattants = await Combattant.find({ techniqueFavorite: technique });
  return combattants;
}

/**
 * Extraire tous les combattants par leurs nationalité
 */
async function getByNationalite(nationalite: string): Promise<ICombattant[]> {
  const combattants = await Combattant.find({ nationalite: nationalite });
  return combattants;
}   

/**
 * Ajouter un combattant
 */
async function add(combattant: ICombattant): Promise<void> {
  const nouveauCombattant = new Combattant(combattant);
  await nouveauCombattant.save();
}

/**
 * Mettre à jour un combattant
 */
async function update(combattant: ICombattant): Promise<void> {
  const combattantModifier = await Combattant.findById(combattant.id);
  if (combattantModifier === null) { throw new Error("Combattant non trouvé");}
  
  combattantModifier.nom = combattant.nom;
  combattantModifier.prenom = combattant.prenom;
  combattantModifier.surnom = combattant.surnom;
  combattantModifier.dateNaissance = combattant.dateNaissance;
  combattantModifier.age = combattant.age;
  combattantModifier.nationalite = combattant.nationalite;
  combattantModifier.categorie = combattant.categorie;
  combattantModifier.victoire = combattant.victoire;
  combattantModifier.defaites = combattant.defaites;
  combattantModifier.ufcChampion = combattant.ufcChampion;
  combattantModifier.techniqueFavorite = combattant.techniqueFavorite;
  combattantModifier.matchRecents = combattant.matchRecents;
  await combattantModifier.save();
}

/** 
 * Supprimer un combattant
 */
 
 async function delete_(id: string): Promise<void> {
  await Combattant.findByIdAndDelete(id);
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
  delete_,
} as const;
