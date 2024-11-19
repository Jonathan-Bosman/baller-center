<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router'
import FooterSide from './components/FooterSide.vue';
import HeaderSide from './components/HeaderSide.vue';

const querySearch = ref('');
const categorySearch = ref(0);
const teamSearch = ref(0);
const brandSearch = ref(0);
const receiveSearch = (query :string) =>{
  querySearch.value = query;
}
const receiveCategory = (query :number) =>{
  categorySearch.value = query;
}
const receiveTeam = (query :number) =>{
  teamSearch.value = query;
}
const receiveBrand = (query :number) =>{
  brandSearch.value = query;
}
</script>

<template>
  <HeaderSide
    @emitSearch="receiveSearch"
    @emitCategory="receiveCategory"
    @emitTeam="receiveTeam"
    @emitBrand="receiveBrand"
    />
  <RouterView
    :querySearch="querySearch"
    :categorySearch="categorySearch"
    :teamSearch="teamSearch"
    :brandSearch="brandSearch"
    />
  <FooterSide/>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Carter+One&family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swa');
:root {
  --font-carterone: Carter One, sans-serif;
  --font-montserrat: Montserrat, sans-serif;
}
h1 {
  font-family: var(--font-carterone);
}
* {
  font-family: var(--font-montserrat);
}
</style>
