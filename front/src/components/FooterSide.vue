<template>
    <div class="bot">
        <div id="logo">
            <div class="logo1">
            <img src="../assets/LogoB.png" alt="" class="logo">
        </div>
        <h1>BALLER-CENTER</h1>
        </div>
        <div class="reseau">
            <div>
                <h2>Rejoingnez-nous</h2>
            </div>
            <div class="icon-reseau">
                <img src="../assets/Facebook.png" alt="" class="fb">
                <img src="../assets/Instagram.png" alt="" class="insta">
                <img src="../assets/TikTok.png" alt="" class="tt">
            </div>
        </div>
        <div class="mention">
            <router-link to="{name:'CGV' , target:'_blank'}">Condition générale de vente</router-link>
            <router-link to="{name:'CGU' , target:'_blank'}">Condition générale d'utilisation</router-link>
            <router-link to="{name:'Politique' , target:'_blank'}">politique de confidentialité</router-link>
            <router-link to="{name:'MentionLégales' , target:'_blank'}">Mentions Légales</router-link>
        </div>
        <div class="fin">
            <p>&copy;Tous droits réservés</p>
            <p>Baller-Center-2024</p>
        </div>
    </div>
</template>

<style scoped>
@media(min-width: 390px) and (max-width: 767px)  {
    .bot {
        background-color: #1D428A;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .logo {
        width: 100px;
        height: 100px;
    }
    h1 {
        color: #F5F5F5;
        font-weight: bold;
        margin-bottom: 30px;
    }
    p {
        color: #F5F5F5;
        font-size: 14px;
        font-weight: bold;
    }
    h2 {
        color: #F5F5F5;
        margin-bottom: 20px;
        font-weight: bold;
        font-size: 20px;
    }
    .logo1 {
        display: flex;
        justify-content: center;
    }
    .icon-reseau {
        display: flex;
        justify-content: space-between;
    }
    .reseau {
        margin-bottom: 30px;
    }
    .fb {
        width: 40px;
        height: 40px;
    }
    .insta {
        width: 40px;
        height: 40px;
    }
    .tt {
        width: 40px;
        height: 40px;
    }
    a {
        color: #F5F5F5;
        font-size: 14px;
        font-weight: bold;
    }
    .mention {
        margin-bottom: 30px;
        display: flex;
        flex-direction: column;
    }
}
</style>