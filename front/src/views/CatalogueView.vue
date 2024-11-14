<template>
    <div class="container">
        <ProductCard
            class='card'
            :class="{lastCard: index === cards.length-1 && index%2 === 0}"
            v-for="(card, index) in cards"
            :key="index"
            :id="card.id"
            :nomProduit="card.name"
            :nomCategorie="card.category"
            :prix="card.price"
        />
    </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue';

// fixtures
const cards = [{id:1,name:"Lorem",category:"Lorem ipsum",price:12000},{id:2,name:"Ipsum",category:"Lorem ipsum",price:12000},{id:3,name:"Sir dolor",category:"Lorem ipsum",price:12000},{id:4,name:"Amet",category:"Lorem ipsum",prix:12000},{id:5,name:"Amet",category:"Lorem ipsum",prix:12000}];
</script>

<style scoped>
.container{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: auto;
    width: 95%;
}

.card{
    width: 45%;
    margin-top: 2rem;
}

.lastCard{
    margin-left: auto;
    margin-right: auto;
    justify-self: center;
    align-self: center;
}

@media screen and (min-width: 767px) {
    .card{
    width: 30%;
    }
}
</style>