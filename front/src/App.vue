<script setup lang="ts">
import FooterSide from './components/FooterSide.vue';
import HearderSide from './components/HearderSide.vue';
</script>

<template>
  <HearderSide/>
  <RouterView />
  <FooterSide/>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Carter+One&family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swa');
:root {
  --font-carterone: 'CarterOne, sans-serif';
  --font-montserrat: 'Montserrat, sans-serif'
}
h1 {
  font-family: var(--font-carterone);
}
p, label, button, a, h2, input {
  font-family: var(--font-montserrat);
}
</style>
