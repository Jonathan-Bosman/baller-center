<template>
  <div class="register">
    <h2>Inscription</h2>
    <form @submit.prevent="handleSubmit" class="registration-form">
      <div class="container">
        <label for="firstname">Prénom :</label>
        <input v-model="firstname" id="firstname" type="text" class="input-field" required />
      </div>

      <div class="container">
        <label for="lastname">Nom :</label>
        <input v-model="lastname" id="lastname" type="text" class="input-field" required />
      </div>

      <div class="container">
        <label for="email">E-mail :</label>
        <input v-model="email" id="email" type="email" class="input-field" required />
      </div>

      <div class="container">
        <label for="telephone">Téléphone :</label>
        <input v-model="telephone" id="telephone" type="text" class="input-field" required />
      </div>

      <div class="container">
        <label for="address">Adresse :</label>
        <input v-model="address" id="address" type="text" class="input-field" required />
      </div>

      <div class="container">
        <label for="zipcode">Code Postal :</label>
        <input v-model="zipcode" id="zipcode" type="text" class="input-field" required />
      </div>

      <div class="container">
        <label for="password">Mot de passe :</label>
        <input v-model="password" id="password" type="password" class="input-field" required />
      </div>

      <!-- Case à cocher pour accepter les conditions -->
      <div class="container">
        <label class="checkbox-container">
          <input type="checkbox" v-model="acceptTerms" required />
          <span class="checkbox-text">J'ai lu et accepté les <a href="#">conditions générales</a>.</span>
        </label>
      </div>

      <button type="submit" class="submit-button" :disabled="!acceptTerms">S'inscrire</button>
    </form>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const firstname = ref('');
const lastname = ref('');
const email = ref('');
const telephone = ref('');
const address = ref('');
const zipcode = ref('');
const password = ref('');
const acceptTerms = ref(false); // État pour la case à cocher
const errorMessage = ref('');
const successMessage = ref('');

const handleSubmit = async () => {
  try {
    const response = await fetch('http://localhost:3333/api/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        telephone: telephone.value,
        address: address.value,
        zipcode: zipcode.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      errorMessage.value = errorData.details;
      successMessage.value = '';
    } else {
      const data = await response.json();
      successMessage.value = data.message;
      errorMessage.value = '';
      
      firstname.value = '';
      lastname.value = '';
      email.value = '';
      telephone.value = '';
      address.value = '';
      zipcode.value = '';
      password.value = '';
      acceptTerms.value = false; // Réinitialiser la case à cocher après l'envoi
    }
  } catch (error) {
    errorMessage.value = 'Erreur de connexion au serveur';
    console.error(error);
  }
};
</script>

<style scoped>
/* Conteneur principal */
.register {
  max-width: 450px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #1D428A; /* Bleu */
  color: #F5F5F5; /* Blanc */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Titre principal */
h2 {
  text-align: center;
  color: #F5F5F5;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

/* Formulaire */
.registration-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.container {
  margin-bottom: 1.5rem;
}

.container label {
  display: block;
  color: #F5F5F5;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

/* Champs de saisie */
.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #F5F5F5;
  border-radius: 4px;
  background-color: #FFFFFF;
  color: #0F0F0F; /* Noir */
  font-size: 1rem;
  transition: border 0.3s;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #1D428A; /* Bleu */
  outline: none;
}

/* Case à cocher */
.checkbox-container {
  display: flex;
  align-items: center;
  color: #F5F5F5;
  font-size: 0.9rem;
}

.checkbox-container input {
  margin-right: 0.5rem;
}

.checkbox-text {
  display: inline-block;
}

.checkbox-container a {
  color: #F5F5F5;
  text-decoration: underline;
}

/* Bouton d'inscription */
.submit-button {
  padding: 1rem;
  background-color: #F5F5F5;
  color: #0F0F0F; /* Noir */
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
  width: 50%; /* Largeur réduite du bouton */
  align-self: center; /* Centrer le bouton */
}

.submit-button:hover {
  background-color: #e0e0e0;
}

.submit-button:disabled {
  background-color: #dcdcdc; /* Désactiver le bouton lorsqu'il n'est pas validé */
  cursor: not-allowed;
}

/* Messages d'erreur et succès */
.error-message {
  color: #C8102E; /* Rouge */
  margin-top: 1rem;
  text-align: center;
}

.success-message {
  color: #4CAF50; /* Vert */
  margin-top: 1rem;
  text-align: center;
}
</style>

