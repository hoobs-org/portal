<template>
    <div class="chevron">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="#fff" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
        </svg>
    </div>
</template>

<script>
    export default {
        name: "chevron",
    };
</script>

<style lang="scss" scoped>
    .chevron {
        width: 24px;
        height: 24px;
        margin-left: 10px;
        user-select: none;

        svg {
            width: 24px;
            height: 24px;
        }
    }
</style>
