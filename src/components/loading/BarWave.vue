<template>
    <div class = "loading-mask">
        <div class = "loading-spinner">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BarWave"
    }
</script>

<style scoped lang = "less">
    .loading-mask{
        background-color: rgba(0, 0, 0, 0.8);
        position: absolute;
        z-index: 2000;
        margin: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition: opacity .3s;
    }
    .loading-spinner {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        width: 2em;
        top: 50%;
        left : 50%;
        position: absolute;
        span {
            width: 0.3em;
            height: 1em;
            background-color: #3cefff;
        }

        span:nth-of-type(1) {
            animation: grow 1s -0.45s ease-in-out infinite;
        }

        span:nth-of-type(2) {
            animation: grow 1s -0.3s ease-in-out infinite;
        }

        span:nth-of-type(3) {
            animation: grow 1s -0.15s ease-in-out infinite;
        }

        span:nth-of-type(4) {
            animation: grow 1s ease-in-out infinite;
        }

        @keyframes grow {
            0%,
            100% {
                transform: scaleY(1);
            }

            50% {
                transform: scaleY(2);
            }
        }
    }
</style>