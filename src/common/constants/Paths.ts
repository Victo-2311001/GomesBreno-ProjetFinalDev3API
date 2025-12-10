export default {
  Base: '/api',
  Combattants: {
    Base: '/combattants',
    Get: '/all',
    GetOne: '/:id',
    GetByCategorie: '/categorie/:categorie',
    GetByTechniqueFavorite: '/technique/:technique',
    GetByNationalite: '/nationalite/:nationalite',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Utilisateur: {
    Base: '/utilisateur',
    Connexion: '/connexion',
  },
} as const;
