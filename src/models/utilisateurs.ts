import mongoose, { Schema, model } from 'mongoose';

export interface IUtilisateur {
    id: string;
    email: string;
    motDePasse: string;
}

const UtilisteurSchema = new Schema<IUtilisateur>({
  email: { type: String, required: [true, 'Email est requis']},
  motDePasse: { type: String, required: [true, 'Le mot de passe est requis']},
});

mongoose.pluralize(null);

export const Utilisateur = model<IUtilisateur>('utilisateurs', UtilisteurSchema);