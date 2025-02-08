<template>
    <div class="card flip-card">
        <div class="container-card bg-green-box flip-card-inner">
            <div class="flip-card-front">
                <p class="card-title">Password title</p>
            </div>
            <div class="flip-card-back">
                <p class="card-description">Password text information</p>
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
        justify-content: center;
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
        justify-content: center;
        align-items: center;
        border: 2px solid transparent;
        border-radius: 25px;
    }


</style>
  