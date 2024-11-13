<template>
    <div class="inscription-container">
      <h2>Inscription</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="nom">Nom</label>
          <input type="text" id="nom" v-model="form.nom" class="input-field" required />
        </div>
  
        <div class="form-group">
          <label for="prenom">Prénom</label>
          <input type="text" id="prenom" v-model="form.prenom" class="input-field" required />
        </div>
  
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="form.email" class="input-field" required />
        </div>
  
        <div class="form-group">
          <label for="telephone">Téléphone</label>
          <input type="tel" id="telephone" v-model="form.telephone" class="input-field" />
        </div>
  
        <div class="form-group">
          <label for="adresse">Adresse</label>
          <input type="text" id="adresse" v-model="form.adresse" class="input-field" />
        </div>
  
        <div class="form-group">
          <label for="codePostal">Code postal</label>
          <input type="text" id="codePostal" v-model="form.codePostal" class="input-field" required />
        </div>
  
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" v-model="form.password" class="input-field" required />
        </div>
  
        <div class="form-group">
          <label for="confirmPassword">Confirmation Mot de passe</label>
          <input type="password" id="confirmPassword" v-model="form.confirmPassword" class="input-field" required />
        </div>
  
        <div class="form-group checkbox">
          <input type="checkbox" id="terms" v-model="form.termsAccepted" required />
          <label for="terms">J'ai lu et j'accepte les conditions générales d'utilisation et de vente.</label>
        </div>
  
        <button type="submit" class="submit-button">S'inscrire</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive } from 'vue'
  
  const form = reactive({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    codePostal: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  })
  
  const handleSubmit = () => {
    if (form.password !== form.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    alert("Formulaire soumis avec succès !");
    // Logique d'inscription ou appel API pour enregistrer les données utilisateur
  }
  </script>
  
  <style scoped>
  .inscription-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #1D428A; 
    color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    background-color: #1D428A;
    padding: 0.5rem;
    color: #f5f5f5;
    margin-bottom: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.25rem;
    color: #f5f5f5;
  }
  
  .input-field {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #f5f5f5;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #ffffff;
  }
  
  .form-group.checkbox {
    display: flex;
    align-items: center;
  }
  
  .form-group.checkbox input[type="checkbox"] {
    margin-right: 0.5rem;
  }
  
  .submit-button {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    background-color: #F5F5F5;
    color: #1D428A;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .submit-button:hover {
    background-color: #e0e0e0;
  }
  </style>