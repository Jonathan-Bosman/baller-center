<template>
    <div class="connexion-container">
      <h2>Connexion</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>
  
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" v-model="form.password" required />
        </div>
  
        <button type="submit">Se connecter</button>
  
        <div class="forgot-password">
          <a href="#">Mot de passe oublié ?</a>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive } from 'vue'
  
  const form = reactive({
    email: '',
    password: ''
  })
  
  const handleSubmit = () => {
    alert("Connexion réussie !");
    // Logique de connexion ou appel API pour authentification
  }
  </script>
  
  <style scoped>
  /* Style principal du conteneur */
  .connexion-container {
    max-width: 600px; /* Augmenter la largeur du conteneur */
    margin: 0 auto;
    padding: 3rem; /* Plus d'espace intérieur */
    background-color: #1D428A;
    color: #f5f5f5;
    border-radius: 20px; /* Augmenter le border-radius pour des coins arrondis plus marqués */
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1);
  }
  
  /* Titre de la page */
  h2 {
    text-align: center;
    background-color: #1D428A;
    padding: 1rem; /* Augmenter l'espace autour du titre */
    color: white;
    margin-bottom: 1.5rem;
    border-radius: 10px; /* Border-radius sur le titre pour correspondre au style global */
  }
  
  /* Style des groupes de formulaires */
  .form-group {
    margin-bottom: 1.5rem; /* Plus d'espacement entre les champs */
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #f5f5f5;
  }
  
  /* Style des champs de texte (email et mot de passe) */
  .form-group input[type="email"],
  .form-group input[type="password"] {
    width: 100%;
    padding: 0.75rem; /* Augmenter la taille des champs */
    border: 1px solid #f5f5f5;
    border-radius: 15px; /* Augmenter le border-radius des champs de texte */
    box-sizing: border-box;
  }
  
  /* Style du bouton de soumission */
  button[type="submit"] {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 10px; /* Augmenter le border-radius du bouton */
    background-color: #f5f5f5;
    color: #1D428A;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button[type="submit"]:hover {
    background-color: #e0e0e0; /* Changer légèrement la couleur au survol */
  }
  
  /* Style pour le lien "Mot de passe oublié" */
  .forgot-password {
    text-align: center;
    margin-top: 1rem;
  }
  
  .forgot-password a {
    color: #f5f5f5;
    text-decoration: none;
  }
  
  .forgot-password a:hover {
    text-decoration: underline;
  }
  </style>