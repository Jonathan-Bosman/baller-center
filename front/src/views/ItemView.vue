<template>
    <div class="wrapper">
        <SpinnerLoader class='loader' v-if="isLoading"/>
        <p v-if="!isLoading && loadingError !==''">Erreur lors du chargement.</p>
        <p v-if="!isLoading && product.length<1">Désolé, aucun produit ne correspond à votre recherche...</p>
        <div
            class='cardContainer'
            v-if="!isLoading
                && loadingError===''
                && product.length>0
                && categories.length>0
                && teams.length>0
                && brands.length>0"
            >
            <h2>{{ product[0].name }}</h2>
            <div class='imageWrapper'>
                <img :src="imageSrc" @error="imageLoadError" :alt="product[0]?.name || 'Image not available'"/>
            </div>
            <div class="detailsWrapper">
                <p>{{ categories[categories.findIndex(item => item.id === product[0].category)].name }}</p>
                <p>{{ product[0].price?`${((product[0].price) + "").slice(0,((product[0].price) + "").length-2)},${((product[0].price) + "").slice(((product[0].price) + "").length-2)}`:'0,00' }}€</p>
                <select v-if="otherSizes.length>0" v-model="selectBunch" @change.prevent="changeHandler">
                    <option value="">{{ product[0].size }}</option>
                    <option v-for="other in otherSizes" :key="other.id" :value="other.id">
                        {{ other.size }}
                    </option>
                </select>
                <p v-else>{{ product[0].size }}</p>
                <button
                    @click.prevent="addToCart"
                    :disabled="cart.find(item => item.id=product[0].id) && product[0].quantity<=cart.find(item => item.id=product[0].id).quantity">
                        Ajouter
                    </button>
                <select v-if="otherTeams.length>0" v-model="selectBunch" @change.prevent="changeHandler">
                    <option value="">{{ teams[teams.findIndex(item => item.id === product[0].team)].name }}</option>
                    <option v-for="other in otherTeams" :key="other.id" :value="other.id">
                        {{ teams[other.team].name }}
                    </option>
                </select>
                <p v-else :style="{color: teams[teams.findIndex(item => item.id === product[0].team)].color}">{{ teams[teams.findIndex(item => item.id === product[0].team)].name }}</p>
                <select v-if="otherVariations.length>0" v-model="selectBunch" @change.prevent="changeHandler">
                    <option value="">{{ product[0].variation }}</option>
                    <option v-for="other in otherVariations" :key="other.id" :value="other.id">
                        {{ other.variation }}
                    </option>
                </select>
                <p v-else>{{ product[0].variation }}</p>
                <select v-if="otherBrands.length>0" v-model="selectBunch" @change.prevent="changeHandler">
                    <option value="">{{ brands[brands.findIndex(item => item.id === product[0].brand)].name }}</option>
                    <option v-for="other in otherBrands" :key="other.id" :value="other.id">
                        {{ brands[other.brand].name }}
                    </option>
                </select>
                <p v-else>{{ brands[brands.findIndex(item => item.id === product[0].brand)].name }}</p>
                <select v-if="otherYears.length>0" v-model="selectBunch" @change.prevent="changeHandler">
                    <option value="">{{ product[0].creation_year }}</option>
                    <option v-for="other in otherYears" :key="other.id" :value="other.id">
                        {{ other.year }}
                    </option>
                </select>
                <p v-else>{{ product[0].creation_year }}</p>
            </div>
            <pre>{{ product[0].description }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch, computed, onMounted, ref } from 'vue';
import SpinnerLoader from '@/components/SpinnerLoader.vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import noImage from '../assets/NoImage.png';

const route = useRoute();

const products = ref();
const product = ref();
const categories = ref();
const teams = ref();
const brands = ref();
const hasImageError = ref(false);
const selectBunch = ref('');
const cart = ref(JSON.parse(localStorage.getItem('cart'))||[]);

const imageSrc = computed(() => {
    if (hasImageError.value || !(product.value && product.value[0]?.filepath)) {
        return noImage;
    }
    return `http://localhost:3000/${product.value[0].filepath}`;
});
const otherTeams = computed(() => {
    if (!products.value) return [];
    return products.value.filter(item => {
        const matchesNotId = item.id !== product.value[0].id;
        const matchesCategory = item.category === product.value[0].category;
        const matchesVariation = item.variation === product.value[0].variation;
        const matchesBrand = item.brand === product.value[0].brand;
        const matchesSize = item.size === product.value[0].size;
        const matchesYear = item.year === product.value[0].year;
        return matchesNotId && matchesCategory && matchesVariation && matchesBrand && matchesSize && matchesYear;
    });
});
const otherBrands = computed(() => {
    if (!products.value) return [];
    return products.value.filter(item => {
        const matchesNotId = item.id !== product.value[0].id;
        const matchesCategory = item.category === product.value[0].category;
        const matchesTeam = item.team === product.value[0].team;
        const matchesVariation = item.variation === product.value[0].variation;
        const matchesSize = item.size === product.value[0].size;
        const matchesYear = item.year === product.value[0].year;
        return matchesNotId && matchesCategory && matchesTeam && matchesVariation && matchesSize && matchesYear;
    });
});
const otherVariations = computed(() => {
    if (!products.value) return [];
    return products.value.filter(item => {
        const matchesNotId = item.id !== product.value[0].id;
        const matchesCategory = item.category === product.value[0].category;
        const matchesTeam = item.team === product.value[0].team;
        const matchesBrand = item.brand === product.value[0].brand;
        const matchesSize = item.size === product.value[0].size;
        const matchesYear = item.year === product.value[0].year;
        return matchesNotId && matchesCategory && matchesTeam && matchesBrand && matchesSize && matchesYear;
    });
});
const otherSizes = computed(() => {
    if (!products.value) return [];
    return products.value.filter(item => {
        const matchesNotId = item.id !== product.value[0].id;
        const matchesCategory = item.category === product.value[0].category;
        const matchesTeam = item.team === product.value[0].team;
        const matchesVariation = item.variation === product.value[0].variation;
        const matchesBrand = item.brand === product.value[0].brand;
        const matchesYear = item.year === product.value[0].year;
        return matchesNotId && matchesCategory && matchesTeam && matchesVariation && matchesBrand && matchesYear;
    });
});
const otherYears = computed(() => {
    if (!products.value) return [];
    return products.value.filter(item => {
        const matchesNotId = item.id !== product.value[0].id;
        const matchesCategory = item.category === product.value[0].category;
        const matchesTeam = item.team === product.value[0].team;
        const matchesVariation = item.variation === product.value[0].variation;
        const matchesBrand = item.brand === product.value[0].brand;
        const matchesSize = item.size === product.value[0].size;
        return matchesNotId && matchesCategory && matchesTeam && matchesVariation && matchesBrand && matchesSize;
    });
});
const isLoading = ref<boolean>(true);
const loadingError = ref<string>('');

const imageLoadError = () => {
    hasImageError.value = true;
};
const addToCart = () => {
    if(cart.value.find(item => item.id=product.value[0].id))cart.value.find(item => item.id=product.value[0].id).quantity += 1;
    else cart.value.unshift({"id": product.value[0].id, "name": product.value[0].name, "price": product.value[0].price, "quantity": 1});
    localStorage.setItem('cart',JSON.stringify(cart.value));
}
const changeHandler = () => {
    router.push('/shop/'+selectBunch.value);
    isLoading.value = true;
    selectBunch.value = "";
}
const fetchData = (async (id) => {
    try{
        const resProduct = await fetch(`http://localhost:3000/api/products/${id}`,{
              headers: {'Content-Type': 'application/json'}
            });
        if(!resProduct.ok){
            const err = await resProduct.json();
            loadingError.value = err.details;
            isLoading.value = false;
            return;
        } else {
            product.value = await resProduct.json();
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
    try{
        const resProducts = await fetch(`http://localhost:3000/api/products`,{
              headers: {'Content-Type': 'application/json'}
            });
        if(!resProducts.ok){
            return;
        } else {
            products.value = await resProducts.json();
        }
    } catch(err) {
        console.error(err);
        return;
    }
});

onMounted(() => fetchData(route.params.id));
watch(() => route.params.id, (newId) => {
    fetchData(newId);
});
</script>

<style scoped>
.wrapper{
    margin: auto;
    width: 95%;
    min-height: 100vh;
}

.imageWrapper{
    position: relative;
    overflow: hidden;
    aspect-ratio: 16/9;
    width: 100%;
    border: 1px solid #0F0F0F;
}

img{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
}

.detailsWrapper{
    display: grid;
    grid-template-columns: 1fr 1fr;
}

p{
    font-size: 17px;
}

.detailsWrapper>button,.detailsWrapper>select{
    justify-self: flex-end;
    height: 95%;
    width: 10rem;
    padding: 1rem;
    border-radius: 12px;
    text-align: end;
}

.detailsWrapper>select:nth-child(odd){
    justify-self: flex-start;
    text-align: start;
}

.detailsWrapper>button{
    color:  #F5F5F5;
    border: none;
    background-color: #1D428A;
    text-align: center;
}

.detailsWrapper>button:disabled{
    background-color: #333;
}

.detailsWrapper>p:nth-child(even){
    text-align: right;
}

h2{
    font-weight: normal;
}

.loader{
    width: 120px;
}

@media screen and (min-width: 767px) {
    .loader{
        width: 240px;
    }
}
</style>