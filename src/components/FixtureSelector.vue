<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useBranchFixturesStore } from '@/stores/branchFixtures'

defineProps({
  filteredFixtures: Array,
})

const fixtureSidebarStore = useFixtureSidebarStore()
const branchFixturesStore = useBranchFixturesStore()

const handleWindowResize = () => {
    const sidebar = document.querySelector('.p-sidebar')
    if (!sidebar) return
    console.log(sidebar.offsetWidth)
    fixtureSidebarStore.setWidth(sidebar.offsetWidth)
}


window.addEventListener("resize", handleWindowResize);

const initHotValue = ref(0)
const initColdValue = ref(0)

const fixtureFilterText = ref("")

const { fixtures } = fixturesData

const filteredFixturesList = computed(() => {
    if (fixtureFilterText.value === "") return fixtures
    return fixtures.filter(fixture =>
        fixture.name.toLowerCase().includes(fixtureFilterText.value.toLowerCase())
    )
})

const selectItem = (fixture) => {
    branchFixturesStore.addFixture(fixture, initColdValue.value, initHotValue.value)
}
</script>

<template>
    <div class="fixtures-select">
        <Accordion :activeIndex="[2]" :multiple="true">
            <AccordionTab header="Favorites">
                <p v-if="!branchFixturesStore.favorites.length">Add some fixtures to your Favorites!</p>
                <template v-else>
                    <Button @click="selectItem(fixture)" class="fixture"
                    v-for="fixture in branchFixturesStore.favorites" :key="fixture.slug">
                        <div class="fixture-wrapper">
                            <h4 class="fixture__name">{{ fixture.name }}</h4>
                            <p>{{ fixture.fixtureType }}</p>
                            <p>{{ fixture.occupancy }}</p>
                        </div>
                        <Button @click.stop="branchFixturesStore.addToFavorites(fixture)" class="favorite-button"
                            :icon="{ 'pi pi-star-fill': branchFixturesStore.isFavorited(fixture), 'pi pi-star': !branchFixturesStore.isFavorited(fixture) }"
                            text rounded></Button>
                    </Button>
                </template>
            </AccordionTab>
            <AccordionTab header="Recents">
                <p v-if="!branchFixturesStore.recents.length">No Recently Used Fixtures Yet</p>
                <template v-else>
                    <Button @click="selectItem(fixture)" class="fixture"
                        v-for="fixture in branchFixturesStore.recents" :key="fixture.slug">
                        <div class="fixture-wrapper">
                            <h4 class="fixture__name">{{ fixture.name }}</h4>
                            <p>{{ fixture.fixtureType }}</p>
                            <p>{{ fixture.occupancy }}</p>
                        </div>
                    </Button>
                </template>
            </AccordionTab>
            <AccordionTab header="All">
                <Button @click="selectItem(fixture)" class="fixture" v-for="fixture in filteredFixtures"
                    :key="fixture.slug">
                    <div class="fixture-wrapper">
                        <h4 class="fixture__name">{{ fixture.name }}</h4>
                        <p>{{ fixture.fixtureType }}</p>
                        <p>{{ fixture.occupancy }}</p>
                    </div>
                    <Button @click.stop="branchFixturesStore.addToFavorites(fixture)" class="favorite-button"
                        :icon="{ 'pi pi-star-fill': branchFixturesStore.isFavorited(fixture), 'pi pi-star': !branchFixturesStore.isFavorited(fixture) }"
                        text rounded></Button>
                </Button>
            </AccordionTab>
        </Accordion>
    </div>
</template>

<style scoped>
.favorite-button {
    position: absolute;
    top: 0.4rem;
    right: 0.5rem;
}

.fixture-float {
    margin: 1.5rem 0 0.5rem;
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
    padding: 2rem 1rem;
}

.fixtures-select:deep(.p-accordion-header) {
    padding: 1rem 0;
}

.fixtures-select:deep(.p-accordion-header-link) {
    padding: 1rem;
}

.sidebar--closed {
    margin: 0 -25vw 0 0;
}

.sidebar--open {
    margin: 0 0 0 0;
}

.fixture {
    width: 100%;
    background: white;
    color: #333;
    border: 2px solid #ddd;
    margin: 0 0 1.5rem 0;
    position: relative;
}

.fixture:last-child {
    margin-bottom: 0;
}

.fixture-wrapper {
    display: flex;
    flex-direction: column;
}

.fixture:hover {
    background: #eee;
}

.fixture p {
    text-align: left;
    margin: 0.5rem 0;
}

.fixture-input {
    width: 100%;
}

.fixture__name {
    text-align: left;
    font-weight: bold;
    margin: 0.5rem 0;
}
</style>