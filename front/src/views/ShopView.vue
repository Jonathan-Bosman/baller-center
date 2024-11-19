<template>
    <div class="wrapper">
        <SpinnerLoader class='loader' v-if="isLoading"/>
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
                v-for="product in searchedProducts"
                :key="product.id"
                :nomProduit="product.name"
                :categoryId="product.category"
                :nomCategorie="categories[categories.findIndex(item => item.id === product.category)].name"
                :TeamId="product.Team"
                :nomEquipe="teams[teams.findIndex(item => item.id === product.team)].name"
                :couleurEquipe="teams[teams.findIndex(item => item.id === product.team)].color"
                :brandId="product.brand"
                :nomMarque="brands[brands.findIndex(item => item.id === product.brand)].name"
                :variation="product.variation"
                :anneeCreation="product.creation_year"
                :prix="product.price"
                :url="'http://localhost:3000/uploads/'+product.filepath"
                />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import SpinnerLoader from '@/components/SpinnerLoader.vue';

const products = ref();
const categories = ref();
const teams = ref();
const brands = ref();
const isLoading = ref<boolean>(true);
const loadingError = ref<string>('');

const props = defineProps({
    querySearch: String,
    categorySearch: Number,
    teamSearch: Number,
    brandSearch: Number
});

const formatSearch = (text :string) :string =>{
    text = text.replace(/[àáâäãÀÁÂÄÃ]/g,'a');
    text = text.replace(/[ìíîïÌÍÎÏ]/g,'i');
    text = text.replace(/[ùúûüÙÚÛÜ]/g,'u');
    text = text.replace(/[èéêëÈÉÊË]/g,'e');
    text = text.replace(/[òóôöõÒÓÔÖÕ]/g,'o');
    text = text.replace(/[ýÿÝŸ]/g,'y');
    text = text.replace(/[æÆ]/g,'ae');
    text = text.replace(/[œŒ]/g,'oe');
    text = text.replace(/[ñÑ]/g,'n');
    text = text.replace(/[çÇ]/g,'c');
    text = text.replace(/[ß]/g,'ss');
    text = text.toLowerCase();
    return text;
}

const query = ref();
const category = ref();
const team = ref();
const brand = ref();
watchEffect( () => {
    query.value = props.querySearch?formatSearch(props.querySearch):'';
    category.value = props.categorySearch;
    team.value = props.teamSearch;
    brand.value = props.brandSearch;
});
const searchedProducts = computed(() => {
    if (!products.value) return [];
    return products.value.filter(product => {
        const matchesQuery = query.value === '' || formatSearch(product.name).match(query.value);
        const matchesCategory = !category.value || category.value < 1 || product.category === category.value;
        const matchesTeam = !team.value || team.value < 1 || product.team === team.value;
        const matchesBrand = !brand.value || brand.value < 1 || product.brand === brand.value;
        return matchesQuery && matchesCategory && matchesTeam && matchesBrand;
    });
});

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
    min-height: 100vh;
}

p{
    text-align: center;
    font-size: 17px;
    font-family: var(--font-carter-one);
}

.loader{
    width: 120px;
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
    .loader{
        width: 240px;
    }
    .card{
        width: 30%;
    }
}
</style>