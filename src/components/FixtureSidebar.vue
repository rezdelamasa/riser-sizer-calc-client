<script setup lang="ts">
import { ref, computed } from 'vue'
import fixturesData from "../data/fixtures.json"
import { useFixtureSidebarStore } from '@/stores/fixtureSidebar'
import FixtureSelector from './FixtureSelector.vue'

const fixtureSidebarStore = useFixtureSidebarStore()

const fixtureFilterText = ref("")

const { fixtures } = fixturesData

const filteredFixturesList = computed(() => {
    if (fixtureFilterText.value === "") return fixtures
    return fixtures.filter(fixture =>
        fixture.name.toLowerCase().includes(fixtureFilterText.value.toLowerCase())
    )
})

const clearSearchInput = () => {
    fixtureFilterText.value = ""
}
</script>

<template>
    <aside class="sidebar"
        :class="{ 'sidebar--closed': !fixtureSidebarStore.visible, 'sidebar--open': fixtureSidebarStore.visible }">
        <div class="sidebar__header">
            <h3 class="sidebar__title">Add Fixtures</h3>
            <FloatLabel class="fixture-float">
                <InputText class="fixture-input" type="text" v-model="fixtureFilterText" id="FixtureSearch"></InputText>
                <label for="FixtureSearch">Search</label>
                <Button 
                    class="clear-button"
                    icon="pi pi-times-circle"
                    text 
                    rounded
                    @click="clearSearchInput"
                >
                </Button>
            </FloatLabel>
        </div>
        <FixtureSelector :filtered-fixtures="filteredFixturesList"></FixtureSelector>
    </aside>
</template>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    width: 360px;
    height: 100vh;
    transition: all 300ms ease-in-out;
    overflow-y: hidden;
    box-shadow: rgb(217, 221, 252) 0px 4px 50px 0px;
    box-sizing: border-box;
    padding: 20px 0 20px 20px;
    background: white;
}

.favorite-button {
    position: absolute;
    top: 0.4rem;
    right: 0.5rem;
}

.fixture-float {
    margin: 2.5rem 0 0.5rem;
    position: relative;
}

.clear-button {
    position: absolute;
    right: 0;
    top: -1px;
}

.sidebar__header:deep(  .p-float-label:has(input:focus) label) {
    left: 0;
}

.sidebar__header {
    padding-right: 36px;
    padding-bottom: 2rem;
    border-bottom: 2px solid #eee;
}

.fixtures-select {
    overflow: auto;
    padding-right: 20px;
    padding-top: 2rem;
}

.fixtures-select:deep(.p-accordion-content) {
    padding: 0 1rem 2rem 1rem;
}

.fixtures-select:deep(.p-accordion-header) {
    padding: 1rem 0;
}

.fixtures-select:deep(.p-accordion-header-link) {
    padding: 1rem;
}

.sidebar--closed {
    margin: 0 -360px 0 0;
}

.sidebar--open {
    margin: 0 0 0 0;
}

.fixture-input {
    width: 100%;
}
</style>