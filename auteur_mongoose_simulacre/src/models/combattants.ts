import mongoose, { Schema, model } from 'mongoose';

interface IMatchesRecents {
  adversaire: string;
  date: Date;
  resultat: string;
}

export interface ICombattant {
  id: string;
  nom: string;
  prenom: string;
  surnom: string;
  dateNaissance: Date;
  age: number;
  nationalite: string;
  categorie: string;
  victoire: number;
  defaites: number;
  ufcChampion: boolean;
  techniqueFavorite: string[];
  matchRecents: IMatchesRecents[]
}

const MatchRecentsSchema = new Schema<IMatchesRecents>({
  adversaire: { type: String, required: [true, "Le nom de l'adversaire est requis"]},
  date: { type: Date, required: [true, "La date du combat est requise"]},
  resultat: { type: String, required: [true, "Le resultat du combat est requis"], enum: ["victoire", "defaite", "nul"], message: "Le resultat doit etre victoire, defaite ou nul"},
});

const CombattantSchema = new Schema<ICombattant>({
  nom: { type: String, required: [true, "Le nom du combattant est requis"], maxlength: 100},
  prenom: { type: String, required: [true, "Le prénom du combattant est requis"], maxlength: 100},
  surnom: { type: String, required: false, maxlength: 100},
  dateNaissance: { type: Date, required: [true, "La date de naissance du combattant est requise"]},
  age: { type: Number, required: [true, "L'âge du combattant est requise"], min: [18, "Le combattant doit avoir 18 ans ou plus"]},
  nationalite: { type: String, required: [true, "La nationalité du combattant est requise"], maxlength: [2, "La nationalité doit être écrite au format ISO 3166-1 alpha-2 ('BR', 'US', ...)"]},
  categorie: { type: String, required: [true, "La catégorie est requise"], enum: ["poids-mouches", "poids-coqs", "poids-plumes", "poids-légers", "poids-welters", "poids-mi-moyens", "poids-moyens", "poids-mi-lourds", "poids-lourds"], message: "La catégorie doit être poids-mouches, poids-coqs, poids-plumes, poids-légers, poids-welters, poids-mi-moyens, poids-moyens, poids-mi-lourds ou poids-lourds"},
  victoire: { type: Number, required: false},
  defaites: { type: Number, required: false},
  ufcChampion: { type: Boolean, required: [true, "Le status de champion ou pas doit être attribué au combattant"]},
  techniqueFavorite: { type: [String], required: [true, "La technique favorite du combattant est requise"], enum: ["Jiu-Jitsu", "Lutte", "Boxe", "Kickboxing"], message: "La technique favorite doit être Jiu-Jitsu, Lutte, Boxe ou Kickboxing"},
  matchRecents: { type: [MatchRecentsSchema], required: [true, "Les matchs recents sont requis"]},
});

mongoose.pluralize(null);

export const Combattant = model<ICombattant>('combattants', CombattantSchema);