<template>
    <div class="wrapper">
        <SpinnerLoader v-if="isLoading"/>
        <p v-if="!isLoading && loadingError !==''">Erreur lors du chargement.</p>
        <div
            class='cardContainer'
            v-if="!isLoading
                && loadingError===''
                && products.length>0
                && categories.length>0
                && teams.length>0
                && brands.length>0"
            >
            <ProductCard
                class='card'
                v-for="(product, index) in products"
                :key="index"
                :id="product.id"
                :nomProduit="product.name"
                :categoryId="product.category"
                :nomCategorie="categories[product.category-1].name"
                :TeamId="product.Team"
                :nomEquipe="categories[product.team-1].name"
                :couleurEquipe="categories[product.team-1].color"
                :brandId="product.brand"
                :nomMarque="categories[product.brand-1].name"
                :variation="product.variation"
                :anneeCreation="product.creation_year"
                :prix="product"
                :url="'http://localhost:3000/uploads/'+product.filepath"
                />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import SpinnerLoader from '@/components/SpinnerLoader.vue';

const products = ref();
const categories = ref();
const teams = ref();
const brands = ref();
const isLoading = ref<boolean>(true);
const loadingError = ref<string>('');

onMounted(async () => {
    try{
        const resProducts = await fetch('http://localhost:3000/api/products/',{
              headers: {'Content-Type': 'application/json'}
            });
        if(!resProducts.ok){
            const err = await resProducts.json();
            loadingError.value = err.details;
            isLoading.value = false;
            return;
        } else {
            products.value = await resProducts.json();
        }
        const resCategories = await fetch('http://localhost:3000/api/categories/',{
            headers: {'Content-Type': 'application/json'}
        });
        if(!resCategories.ok){
            const err = await resCategories.json();
            loadingError.value = err.details;
            isLoading.value = false;
            return;
        } else {
            categories.value = await resCategories.json();
        }
        const resTeams = await fetch('http://localhost:3000/api/teams/',{
            headers: {'Content-Type': 'application/json'}
        });
        if(!resTeams.ok){
            const err = await resTeams.json();
            loadingError.value = err.details;
            isLoading.value = false;
            return;
        } else {
            teams.value = await resTeams.json();
        }
        const resBrands = await fetch('http://localhost:3000/api/brands/',{
            headers: {'Content-Type': 'application/json'}
        });
        if(!resBrands.ok){
            const err = await resBrands.json();
            loadingError.value = err.details;
            isLoading.value = false;
            return;
        } else {
            brands.value = await resBrands.json();
        }
    } catch(err) {
        console.error(err);
        loadingError.value = 'Erreur de connexion au serveur';
        isLoading.value = false;
        return;
    }
    isLoading.value = false;
})
</script>

<style scoped>
.wrapper{
    margin: auto;
    width: 95%;
}

p{
    text-align: center;
    font-size: 17px;
    font-family: var(--font-carter-one);
}

.cardContainer{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
}

.card{
    width: 45%;
    margin-top: 2rem;
}

@media screen and (min-width: 767px) {
    .card{
    width: 30%;
    }
}
</style>