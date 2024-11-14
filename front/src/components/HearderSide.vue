<template>
    <div class="main">
        <div id="logo">
            <div class="logo1">
            <img src="../assets/LogoB.png" alt="" class="logo">
        </div>
        <h1>BALLER-CENTER</h1>
        </div>
        <div class="icon">
            <div>
                <img src="../assets/Search.svg" alt="search" class="search"
                @click="toggleSearch"
                @keydown.enter="toggleSearch"
                @keydown.space="toggleSearch"
                tabindex="0"
                role="button">
            </div>
            <transition name="slide-right">
            <div v-if="isSearchOpen" class="search-container">
            <img src="../assets/close.svg" alt="" class="close" @click="toggleSearch">
            <label for="down">QUE RECHERCHEZ-VOUS ?
            <input
              type="text"
              v-model="searchQuery"
              class="search-input"
              placeholder="Entrez votre recherche"
              @keydown="handleKeydown"
            />
            </label>
          <button @click="Search" class="recherche-btn">Recherche</button>
        </div>
      </transition>
            <div>
                <img src="../assets/Bag.svg" alt="bag" class="bag">
            </div>
            <div>
                <img src="../assets/Burger.svg" alt="menu" class="menu" @click="Menu">
            </div>
            <transition name="slide-right">
      <div v-if="isMenuOpen" class="burger-dropdown">
        <ul v-if="user">
          <li><router-link to="/">Accueil</router-link>
          </li>
          <li><router-link to="/PageProduits">Nos produits</router-link>
          </li>
          <li><router-link to="/PageProfile">Mon Compte</router-link>
          </li>
          <li><a href="/LoginForm" @click="logout" class="deco">Deconnexion</a></li>
        </ul>
        <ul v-else>
          <li><router-link to="/">Accueil</router-link>
          </li>
          <li><router-link to="/shop">Nos produits</router-link>
          </li>
          <li><router-link to="/InscriptionForm">S'inscrire</router-link></li>
          <li><router-link to="/FormLogin">Se Connecter</router-link>
          </li>
        </ul>

      </div>
    </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';

const isSearchOpen = ref(false);
const searchQuery = ref('');
const isMenuOpen = ref(false);

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};
const Menu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
const Search = () => {
  if (searchQuery.value) {
    console.log(`Recherche pour : ${searchQuery.value}`);
  } else {
    console.log('Veuillez entrer une recherche');
  }
};

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    Search();
  }
};
</script>

<style scoped>
@media(min-width: 390px) and (max-width: 767px)  {
    .main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100vw;
        background-color: #1D428A;
        height: 80px;
    }
    .logo {
        width: 80px;
        height: 80px;
    }
    h1 {
      display: flex;
        color: #F5F5F5;
        font-weight: bold;
        position: relative;
        left: -10px;
        height: 80px;
        font-size: 30px;
        line-height: 25px;
        align-items: center;
    }
    .search {
        width: 30px;
        height: 30px;
    }
    .bag {
        width: 30px;
        height: 30px;
    }
    .menu {
        width: 30px;
        height: 30px;
    }
    .icon {
        display: flex;
        justify-content: space-between;
        height: auto;
        width: 30vw;
    }

    .logo1 {
        display: flex;
        justify-content: center;
    }
    #logo {
      display: flex;
      height: auto;
      width: 60vw;
    }
    .search-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 100vw;
    height: 25.5vh;
    background-color: #1D428A;
    color: #F5F5F5;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
    z-index: 100;
  }
  .close {
    position: relative;
    top: -25px;
    right: -180px;
    width: 40px;
  }
  input {
    margin-bottom: 20px;
    margin-top: 20px;
    height: 30px;
    width: 70vw;
    font-weight: bold;
  }
  button {
    height: 25px;
    width: 30vw;
    border-radius: 5px;
    border: none;
    font-weight: bold;
    font-size: 14px;
    background-color: #F5F5F5;
  }
  .slide-right-enter-active, .slide-right-leave-active {
    transition: transform 0.5s ease;
  }

  .slide-right-enter, .slide-right-leave-to {
    transform: translateX(100%);
  }
  .burger-dropdown {
    position: absolute;
    top: 80px;
    right: 0;
    width: 100vw;
    background-color: #1D428A;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    z-index: 101;
    height: 100%;
  }

  .burger-dropdown ul {
    list-style: none;
    padding: 0;
  }

  .burger-dropdown ul li {
    margin: 10px 0;
  }

  .burger-dropdown ul li a {
    text-decoration: none;
    color: #F5F5F5;
    font-weight: bold;
    font-size: 20px;
    padding: 5px 0 5px 0;
  }
  li {
    padding: 10px 0 10px 0;
  }
  .burger-dropdown .deco {
    color: #1D428A;
  }
}
</style>