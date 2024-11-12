<template>
    <div class="loader"></div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.loader {
    margin: 2rem auto;
    border: 16px solid #C8102E;
    border-top: 16px solid #1D428A;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>