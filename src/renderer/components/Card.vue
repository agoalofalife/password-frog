<template>
    <div class="card flip-card">
        <div class="container-card bg-green-box flip-card-inner">
            <div class="flip-card-front">
                <div class="type_header">
                    <img class="type_icon" src="../assets/icons/activity-svgrepo-com.svg">
                    <p class="type_name">Password type</p>
                </div>
                <p class="card-title">Password title</p>
            </div>
            <div class="flip-card-back">
                <div class="type_header">
                    <img class="type_icon" src="../assets/icons/activity-svgrepo-com.svg">
                    <p class="type_name">Password type</p>
                </div>
                <div class="login_password_body">
                    <div class="login_password_wrapper">
                        <div class="login_password_header">Login</div>
                        <div class="login_password_container">
                            <div class="data_display_field">login</div>
                            <img class="copy_img" src="../assets/icons/copy-svgrepo-com.svg">
                        </div>
                    </div>
                    <div class="login_password_wrapper">
                        <div class="login_password_header">Password</div>
                        <div class="login_password_container">
                            <div class="data_display_field">password</div>
                            <img class="copy_img" src="../assets/icons/copy-svgrepo-com.svg">
                        </div>
                    </div>
                </div>
                <div class="bin_img_container">
                    <img class="bin_img" src="../assets/icons/bin.svg">
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>

</script>

<style scoped>

    .flip-card {
        background-color: transparent;
        width: 300px;
        height: 300px;
        perspective: 1000px;
    }

    .flip-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        backface-visibility: hidden;
        -moz-backface-visibility: hidden;
    }

    .flip-card:focus {
        outline: 0;
    }

    .flip-card:hover .flip-card-inner,
    .flip-card:focus .flip-card-inner{
        transform: rotateY(180deg);
    }

    .flip-card-front,
    .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .flip-card-front {
        background: rgb(38, 38, 38);
        color: rgb(255, 255, 255);
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 2px solid transparent;
        border-radius: 25px;
    }

    .flip-card-back {
        background: rgb(72, 72, 72);
        color: white;
        transform: rotateY(180deg);
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: 2px solid transparent;
        border-radius: 25px;
    }

    .type_header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        align-self: flex-start;
        padding-left: 5%;
    }

    .type_icon {
        width: 20px;
        filter: invert(55%) sepia(12%) saturate(17%) hue-rotate(339deg) brightness(89%) contrast(84%);
        border: 1px solid transparent;
        border-radius: 4px;
    }

    .type_name {
        color: rgba(255, 255, 255, 0.5);
    }

    .login_password_body {
        padding-left: 5%;
    }

    .card-title {
        font-size: 25px;
        margin-top: 25%;
    }

    .bin_img_container {
        padding-right: 5%;
        align-self: end;
        padding-bottom: 2%;
    }

    .bin_img {
        width: 20px;
        filter: invert(55%) sepia(12%) saturate(17%) hue-rotate(339deg) brightness(89%) contrast(84%);
        border: 1px solid transparent;
        border-radius: 4px;
    }

    .login_password_body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .data_display_field {
        border: 1px solid;
        border-color: rgb(169, 169, 169);
        border-radius: 4px;
        width: 90%;
        text-align: left;
        padding-left: 3%;
    }

    .copy_img {
        width: 20px;
        filter: invert(55%) sepia(12%) saturate(17%) hue-rotate(339deg) brightness(89%) contrast(84%);
    }

    .login_password_container {
        width: 95%;
        display: flex;
        justify-content: space-between;
        gap: 5%;
    }

    .login_password_wrapper{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-bottom: 5%;
    }

    .login_password_header {
        padding-bottom: 2%;
    }

</style>
  