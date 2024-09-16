<script setup lang="ts">
defineProps({
    backLink: String,
    text: String
})
</script>
<template>
    <router-link :to="backLink" rel="noopener" class="back-link px-0">
        <Button text severity="secondary" class="back-link__button px-0">
            <i class="pi pi-arrow-left mr-2"></i>
            <span>{{ text }}</span>
        </Button>
    </router-link>
</template>

<style>
.back-link:hover {
    background: none;
    width: fit-content;
}

.back-link__button:hover {
    background: none; 
    color: #282e38;
}
</style>