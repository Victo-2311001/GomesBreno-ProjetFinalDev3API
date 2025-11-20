import insertUrlParams from 'inserturlparams';
import { customDeepCompare } from 'jet-validators/utils';

import CombattantRepo from '@src/repos/CombattantRepo';

import { COMBATTANT_NOT_FOUND_ERR } from '@src/services/CombattantService';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { ValidationError } from '@src/common/util/route-errors';

import Paths from './common/Paths';
import { parseValidationErr, TRes } from './common/util';
import { agent } from './support/setup';
import { ICombattant, Combattant } from '@src/models/combattants';

/******************************************************************************
                               Constants
******************************************************************************/

// Données bidon pour les combattantss (simulacre de GET)
// Fake DB
const DB_COMBATTANT: ICombattant[] = [
  {
    id: '1',
    nom: 'Oliveira',
    prenom: 'Charles',
    surnom: 'Do Bronx',
    dateNaissance: new Date('1989-10-17'),
    age: 36,
    nationalite: 'BR',
    categorie: 'Poids léger',
    victoire: 32,
    defaites: 8,
    ufcChampion: true,
    techniqueFavorite: ['Jiu-Jitsu'],
    matchRecents: [
      { adversaire: 'Poirier', date: new Date('2023-06-10'), resultat: 'victoire' }
    ],
  },
  {
    id: '2',
    nom: 'McGregor',
    prenom: 'Conor',
    surnom: 'Notorious',
    dateNaissance: new Date('1988-07-14'),
    age: 37,
    nationalite: 'IE',
    categorie: 'Poids léger',
    victoire: 22,
    defaites: 6,
    ufcChampion: false,
    techniqueFavorite: ['Boxe'],
    matchRecents: [
      { adversaire: 'Poirier', date: new Date('2021-07-10'), resultat: 'defaite' }
    ],
  },
  {
    id: '3',
    nom: 'Jones',
    prenom: 'Jon',
    surnom: 'Bones',
    dateNaissance: new Date('1987-07-19'),
    age: 38,
    nationalite: 'US',
    categorie: 'Poids lourd',
    victoire: 27,
    defaites: 1,
    ufcChampion: true,
    techniqueFavorite: ['Wrestling'],
    matchRecents: [
      { adversaire: 'Gane', date: new Date('2023-03-04'), resultat: 'victoire' }
    ],
  }
];


// Don't compare 'id' and 'created' cause those are set dynamically by the
// database
const compareUserArrays = customDeepCompare({
  onlyCompareProps: ['nom', 'courriel', 'typeChambre', 'prixParNuit'],
});

const mockify = require('@jazim/mock-mongoose');
/******************************************************************************
                                 Tests
  IMPORTANT: Following TypeScript best practices, we test all scenarios that 
  can be triggered by a user under normal circumstances. Not all theoretically
  scenarios (i.e. a failed database connection). 
******************************************************************************/

describe('combattantRouter', () => {
  let dbCombattant: ICombattant[] = [];

  // Extraire tous les combattantss
  describe(`'GET:${Paths.Combattants.Get}'`, () => {
    // Succès
    it(
      'doit retourner un JSON avec tous les combattantss et un code de ' +
        `of '${HttpStatusCodes.OK}' si réussi.`,
      async () => {
        // Préparer le simulacre de Mongoose
        const data = [...DB_COMBATTANT];
        mockify(Combattant).toReturn(data, 'find');
        const res: TRes<{ combattants: ICombattant[] }> = await agent.get(
          Paths.Combattants.Get,
        );
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(compareUserArrays(res.body.combattants, DB_COMBATTANT)).toBeTruthy();
      },
    );
  });
  
   // Extraire un combattant par son id
  describe(`'GET:${Paths.Combattants.GetOne}'`, () => {
    const getPath = (id: string) =>
      insertUrlParams(Paths.Combattants.GetOne, { id });
    // Succès
    it(
      `doit retourner un JSON avec le combattant et un code de ` + `of '${HttpStatusCodes.OK}' si réussi.`,
      async () => {
        // Préparer le simulacre de Mongoose
        const data = DB_COMBATTANT[0];
        mockify(Combattant).toReturn(data, 'findOne');
        const res: TRes<{ combattant: ICombattant }> = await agent.get(
          getPath(data.id),
        );
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(compareUserArrays([res.body.combattant], [data])).toBeTruthy();
      },
    );  
    // Combattant non trouvée
    it(
      'doit retourner un JSON avec erreur ' +
        `'${COMBATTANT_NOT_FOUND_ERR}' et un code de  ` +
        `'${HttpStatusCodes.NOT_FOUND}' si l\'id n\'est pas trouvé.`,
      async () => {
        // Préparer le simulacre de Mongoose
        mockify(Combattant).toReturn(null, 'findOne');
        const res: TRes = await agent.get(getPath('-1'));
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(COMBATTANT_NOT_FOUND_ERR);
      },
    );
  });

  describe(`'GET:${Paths.Combattants.GetByCategorie}'`, () => {
    const getPath = (categorie: string) =>
      insertUrlParams(Paths.Combattants.GetByCategorie, { categorie }); 
    // Succès
    it(
      `doit retourner un JSON avec les combattants de la catégorie et un code de ` + `of '${HttpStatusCodes.OK}' si réussi.`,
      async () => {
        // Préparer le simulacre de Mongoose
        const categorie = 'Poids léger';
        const data = DB_COMBATTANT.filter(c => c.categorie === categorie);
        mockify(Combattant).toReturn(data, 'find');
        const res: TRes<{ combattants: ICombattant[] }> = await agent.get(
          getPath(categorie),
        );
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(compareUserArrays(res.body.combattants, data)).toBeTruthy();
      },
    );  
    // Aucune catégorie trouvée
    it(
      'doit retourner un JSON avec une liste vide et un code de  ' +
        `'${HttpStatusCodes.OK}' si aucune catégorie n\'est trouvée.`,
      async () => {
        // Préparer le simulacre de Mongoose
        const categorie = 'Inexistante';
        mockify(Combattant).toReturn([], 'find');
        const res: TRes<{ combattants: ICombattant[] }> = await agent.get(
          getPath(categorie),
        );
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.combattants.length).toBe(0);
      },
    );
  });

  describe(`'GET:${Paths.Combattants.GetByTechniqueFavorite}'`, () => { 
    const getPath = (technique: string) =>
      insertUrlParams(Paths.Combattants.GetByTechniqueFavorite, { technique });
    // Succès
    it(
      `doit retourner un JSON avec les combattants de la technique favorite et un code de ` + `of '${HttpStatusCodes.OK}' si réussi.`,
      async () => {
        // Préparer le simulacre de Mongoose
        const technique = 'Boxe';
        const data = DB_COMBATTANT.filter(c => c.techniqueFavorite.includes(technique));
        mockify(Combattant).toReturn(data, 'find');
        const res: TRes<{ combattants: ICombattant[] }> = await agent.get(
          getPath(technique),
        );
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(compareUserArrays(res.body.combattants, data)).toBeTruthy();
      },
    );
    // Aucune technique favorite trouvée
    it(
      'doit retourner un JSON avec une liste vide et un code de  ' +
        `'${HttpStatusCodes.OK}' si aucune technique favorite n\'est trouvée.`,
      async () => {
        // Préparer le simulacre de Mongoose
        const technique = 'Inexistante';
        mockify(Combattant).toReturn([], 'find');
        const res: TRes<{ combattants: ICombattant[] }> = await agent.get(
          getPath(technique),
        );
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.combattants.length).toBe(0);
      },
    );
  });

  // Extraire tous les combattants par leurs nationalité

  describe(`'GET:${Paths.Combattants.GetByNationalite}'`, () => { 
    const getPath = (nationalite: string) =>
      insertUrlParams(Paths.Combattants.GetByNationalite, { nationalite }); 
    // Succès
    it(
      `doit retourner un JSON avec les combattants de la nationalité et un code de ` + `of '${HttpStatusCodes.OK}' si réussi.`,
      async () => {
        // Préparer le simulacre de Mongoose
        const nationalite = 'BR';
        const data = DB_COMBATTANT.filter(c => c.nationalite === nationalite);
        mockify(Combattant).toReturn(data, 'find');
        const res: TRes<{ combattants: ICombattant[] }> = await agent.get(
          getPath(nationalite),
        );
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(compareUserArrays(res.body.combattants, data)).toBeTruthy();
      },
    );
    // Aucune nationalité trouvée
    it(
      'doit retourner un JSON avec une liste vide et un code de  ' +
        `'${HttpStatusCodes.OK}' si aucune nationalité n\'est trouvée.`,
      async () => {
        // Préparer le simulacre de Mongoose
        const nationalite = 'XX';
        mockify(Combattant).toReturn([], 'find');
        const res: TRes<{ combattants: ICombattant[] }> = await agent.get(
          getPath(nationalite),
        );
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.combattants.length).toBe(0);
      },
    );
  });

  // Tester l'ajout d'un combattant
  describe(`'POST:${Paths.Combattants.Add}'`, () => {
    // Ajout réussi
    it(
      `doit retourner le code '${HttpStatusCodes.CREATED}' si la ` +
        'transaction est réussie',
      async () => {
        const combattant: ICombattant = {
            id: '12',
            nom: 'Grondin',
            prenom: 'Felix',
            surnom: 'The Artist',
            dateNaissance: new Date('1990-05-15'),
            age: 34,
            nationalite: 'BR', 
            categorie: 'Poids moyen',
            victoire: 10,
            defaites: 2,
            ufcChampion: false,
            techniqueFavorite: ["Boxe"],
            matchRecents: [
            {
                adversaire: 'pipipi',
                date: new Date('2024-08-20'),
                resultat: 'victoire',
            },
            {
                adversaire: 'popopo',
                date: new Date('2024-02-10'),
                resultat: 'defaite',
            },
            ],
        };
        // Préparer le simulacre de Mongoose
        mockify(Combattant).toReturn(combattant, 'save');
        const res = await agent.post(Paths.Combattants.Add).send({ combattant });
        expect(res.status).toBe(HttpStatusCodes.CREATED);
      },
    );

    // Paramètre manquant
    it(
      'doit retourner un JSON avec les erreurs et un code de ' +
        `'${HttpStatusCodes.BAD_REQUEST}' si un paramètre est ` +
        'manquant.',
      async () => {
        const res: TRes = await agent
          .post(Paths.Combattants.Add)
          .send({ combattant: null });
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe('Combattant requis');
      },
    );
  });

  // Mise à jour d'un combattant
  describe(`'PUT:${Paths.Combattants.Update}'`, () => {
    // Succès
    it(
      `doit retourner un code de '${HttpStatusCodes.OK}' si la mise à jour ` +
        'est réussie.',
      async () => {
        const combattant = DB_COMBATTANT[0];
        combattant.nom = 'combattangt test';

        // Préparer le simulacre de Mongoose
        mockify(Combattant).toReturn(combattant, 'findOne').toReturn(combattant, 'save');

        const res = await agent.put(Paths.Combattants.Update).send({ combattant });
        expect(res.status).toBe(HttpStatusCodes.OK);
      },
    );

    // Combattant non trouvée
    it(
      'doit retourner un JSON avec erreur  ' +
        `'${COMBATTANT_NOT_FOUND_ERR}' et un code de ` +
        `'${HttpStatusCodes.NOT_FOUND}' si l'id n'est pas trouvé.`,
      async () => {
        // Préparer le simulacre de Mongoose
        mockify(Combattant).toReturn(null, 'findOne');
        const combattant = {
            id: 4,
            nom: 'a',
            prenom: 'b',
          },
          res: TRes = await agent.put(Paths.Combattants.Update).send({ combattant });

        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(COMBATTANT_NOT_FOUND_ERR);
      },
    );
  });

  // Supprimer le combattant
  describe(`'DELETE:${Paths.Combattants.Delete}'`, () => {
    const getPath = (id: string) =>
      insertUrlParams(Paths.Combattants.Delete, { id });

    // Succès
    it(
      `doit retourner un code de '${HttpStatusCodes.OK}' si la ` +
        'suppression est réussie.',
      async () => {
        // Préparer le simulacre de Mongoose
        mockify(Combattant)
          .toReturn(DB_COMBATTANT[0], 'findOne')
          .toReturn(DB_COMBATTANT[0], 'findOneAndRemove');
        const id = DB_COMBATTANT[0].id,
          res = await agent.delete(getPath(id));
        expect(res.status).toBe(HttpStatusCodes.OK);
      },
    );

    // Combattant non trouvée
    it(
      'doit retourner un JSON avec erreur ' +
        `'${COMBATTANT_NOT_FOUND_ERR}' et un code de  ` +
        `'${HttpStatusCodes.NOT_FOUND}' si la réservation est introuvable.`,
      async () => {
        // Préparer le simulacre de Mongoose
        mockify(Combattant).toReturn(null, 'findOne');

        const res: TRes = await agent.delete(getPath('-1'));
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(COMBATTANT_NOT_FOUND_ERR);
      },
    );
  });
});