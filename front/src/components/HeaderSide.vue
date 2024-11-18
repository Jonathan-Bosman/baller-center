<template>
  <div class="main">
    <div id="logo">
      <img src="../assets/LogoB.png" alt="" class="logo">
    </div>
    <div class="title">
      <h1>Baller-center</h1>
    </div>
    <div class="icon">
      <div v-if="searchVisible">
        <label for="search">
          <input
            type="text"
            v-model="searchQuery"
            class="search-input"
            placeholder="Entrez votre recherche"
          />
        </label>
         <button @click="Search" class="recherche-btn"><img src="../assets/Minisearch.svg" alt="" class="mini"></button>
      </div>
      <div v-else>
        <img src="../assets/Search.svg" alt="" @click="toggleSearch">
      <transition name="slide-right">
        <div v-if="isSearchOpen" class="search-container">
          <img src="../assets/close.svg" alt="close" class="close" @click="toggleSearch"/>
          <label for="search">QUE RECHERCHEZ-VOUS ?
            <input
              type="text"
              id="search"
              v-model="searchQuery"
              class="search-input"
              placeholder="Entrez votre recherche"
              @keydown="handleKeydown"
            />
          </label>
          <button @click="Search" class="recherche-btn">Recherche</button>
        </div>
      </transition>
    </div>
      <div>
        <img src="../assets/Bag.svg" alt="bag" class="bag">
      </div>
      <div>
        <img src="../assets/Burger.svg" alt="menu" class="menu" @click="Menu">
      </div>
    </div>

    <transition name="slide-right">
      <div v-show="isMenuOpen" class="burger-dropdown">
        <ul v-if="user">
          <li><router-link to="/">Accueil</router-link></li>
          <li><router-link to="/PageProduits">Nos produits</router-link></li>
          <li><router-link to="/PageProfile">Mon Compte</router-link></li>
          <li><a href="/LoginForm" @click="logout" class="deco">Deconnexion</a></li>
        </ul>
        <ul v-else>
          <li><router-link to="/">Accueil</router-link></li>
          <li><router-link to="/shop">Nos produits</router-link></li>
          <li><router-link to="/InscriptionForm">S'inscrire</router-link></li>
          <li><router-link to="/FormLogin">Se Connecter</router-link></li>
        </ul>
      </div>
    </transition>
  </div>
</template>


<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isSearchOpen = ref(false);
const searchQuery = ref('');
const isMenuOpen = ref(false);
const isMobile = ref(window.innerWidth < 992);
const searchVisible = ref(window.innerWidth > 992);

const user = ref<{ name: string; email: string } | null>(null);

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

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    Search();
  }
};

const logout = () => {
  localStorage.removeItem('user');
  user.value = null;
  router.push('/FormLogin');
};

onMounted(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
  }
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 992;
    searchVisible.value = window.innerWidth > 992;
  });
});
</script>


<style scoped>
.main {
        display: flex;
        justify-content: space-between;
        background-color: #1D428A;
        height: 120px;
        width: 100vw;
        border: 1px solid black;
    }
    .logo {
        width: 80px;
        height: 80px;
    }
    h1 {
      display: flex;
        position: relative;
        left: -40px;
        height: 120px;
        line-height: 25px;
        color: #F5F5F5;
        font-weight: bold;
        font-size: 30px;
        align-items: center;
        width: 100px;
    }
    .title {
      height: 120px;
      width: 200px;
    }
    #logo {
      display: flex;
      justify-content: space-between;
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
      flex-direction: row;
      justify-content: flex-end;
      flex-wrap: wrap;
      align-items: center;
        width: 30vw;
    }

    .logo1 {
        display: flex;
        justify-content: center;
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
    position: absolute;
    top: 0;
    right: 0;
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
    top: 120px;
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
/* @media screen and (min-width: 992px){
  .menu {
    display: none;
  }
  .main {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: 100%;
    width: 100vw;
  }
  .burger-dropdown {
    display: flex;
    flex-direction: row;
    position: relative;
    z-index: 101;
  }
  .burger-dropdown ul {
    display: flex;
  }

  .burger-dropdown li {
    display: block;
    padding: 0 15px;
  }

  .burger-dropdown li a {
    text-decoration: none;
    color: #F5F5F5;
    font-weight: bold;
    font-size: 20px;
  }

  .logo {
    width: 120px;
    height: 120px;
  }

  h1 {
    font-size: 30px;
    font-weight: bold;
    color: #F5F5F5;
    width: 150px;
  }
  .icon {
    width: 60%;
  }
  .search {
        width: 30px;
        height: 30px;
    }
    .bag {
        width: 30px;
        height: 30px;
    }
    h1 {
      line-height: normal;
      width: 200px;
    }
    .title{
      width: 200px;
    }
    .search-container {
      display: none;
    }
    input {
      width: 300px;
      margin: 0;
    }
    button {
      width: 30px;
      height: 30px;
    }
    .mini {
      width: 20px;
      height: 20px;
    }
} */
</style>