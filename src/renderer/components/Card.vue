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
                <div>
                    <form action="">

                        <label for="fname">First Name</label>
                        <input type="text" id="fname" name="firstname" placeholder="Your name..">

                        <label for="lname">Last Name</label>
                        <input type="text" id="lname" name="lastname" placeholder="Your last name..">

                        <input type="submit" value="Submit">

                    </form>
                </div>
                <p class="card-description">Password text information</p>
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
        align-items: center;
        justify-content: space-around;
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
        background-color: rgba(255, 255, 255, 0.5);
        border: 1px solid transparent;
        border-radius: 4px;
    }

    .type_name {
        color: rgba(255, 255, 255, 0.5);
    }

    .card-title {
        font-size: 25px;
        margin-top: 25%;
    }

    .bin_img_container {
        padding-right: 5%;
        align-self: end;
    }

    .bin_img {
        width: 20px;
        background-color: rgba(255, 255, 255, 0.5);
        border: 1px solid transparent;
        border-radius: 4px;
    }
</style>
  