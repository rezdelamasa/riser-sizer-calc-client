<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia'
import { useFixtureSidebarStore } from '@/stores/fixtureSidebar'
import { useBranchFixturesStore } from '@/stores/branchFixtures'
import FixtureSidebar from '../components/FixtureSidebar.vue'
import BackLink from '../components/BackLink.vue'
import TitleHeader from '../components/TitleHeader.vue'

const branchFixturesStore = useBranchFixturesStore()
const { getFixtures } = useBranchFixturesStore()

const { params } = useRoute()

const { toggle } = useFixtureSidebarStore()

const fixturesTable = ref(null)
const headerHeight = ref(0)
const backLink = ref("")

onMounted(async () => {
    backLink.value = "/projects/" + params.project_id + "/risers/" + params.riser_id
    await getFixtures(params.branch_id)

    const header = fixturesTable.value.$el.querySelector('.p-datatable-header')
    const table = fixturesTable.value.$el.querySelector('.p-datatable-table') 
    headerHeight.value = header.offsetHeight
    table.style = "padding-bottom: " + headerHeight.value + "px;"
})

const { fixtures, calculatedFixtures, initColdValue, initHotValue } = storeToRefs(useBranchFixturesStore())

const { updateLoads } = useBranchFixturesStore()

const firstFixture = computed(() => {
    return fixtures.value[0]
})

const rowClass = (data) => {
    return ['row'];
};

const handleAddFixturesClick = () => {
    toggle()
}

</script>

<template>
  <main>
    <div class="content" ref="content">
        <TitleHeader></TitleHeader>
        <div class="wrapper">
            <BackLink :back-link="backLink" text="All Branches"/>
            <template v-if="calculatedFixtures.length && firstFixture.length">
                <DataTable 
                    ref="fixturesTable"
                    :value="calculatedFixtures" 
                    tableStyle="min-width: 50rem"
                    class="table"
                    :rowClass="(data) => rowClass(data)"
                >
                    <template #header>
                        <div class="header-wrapper">
                            <div class="header__text">
                                <p class="header__values"><span class="header__values__title">Cold:</span> {{ firstFixture[0].totals.loadValues.cold }} / {{ firstFixture[0].totals.sizes.cold }}</p>
                                <p class="header__values"><span class="header__values__title">Hot:</span> {{ firstFixture[0].totals.loadValues.hot }} / {{ firstFixture[0].totals.sizes.hot }}</p> 
                            </div>
                            <div class="header__actions">
                                <p>Init. Values</p>
                                <InputGroup class="input-group">
                                    <InputGroupAddon>
                                        Hot
                                    </InputGroupAddon>
                                    <InputNumber 
                                        id="init-value-input--hot"
                                        v-model="initHotValue" 
                                        @update:model-value="branchFixturesStore.updateLoads(initColdValue, initHotValue)"
                                        :min-fraction-digits="1" 
                                        :max-fraction-digits="1"
                                        placeholder="Initial Hot FUs"
                                    ></InputNumber>
                                </InputGroup>
                                <InputGroup class="input-group">
                                    <InputGroupAddon>
                                        Cold
                                    </InputGroupAddon>
                                    <InputNumber 
                                        id="init-value-input--cold"
                                        v-model="initColdValue" 
                                        @update:model-value="branchFixturesStore.updateLoads(initColdValue, initHotValue)"
                                        :min-fraction-digits="1" 
                                        :max-fraction-digits="1"
                                        placeholder="Initial Cold FUs"
                                    ></InputNumber>
                                </InputGroup>
                            <Button @click="handleAddFixturesClick" class="header__button">Add Fixture</Button>
                            </div>
                        </div>
                    </template>
                    <Column field="name" header="Name">
                        <template #body="slotProps">
                            <div class="column-wrapper">
                                <p>{{ slotProps.data.name }}</p>
                            </div>
                        </template>
                    </Column>
                    <Column field="type" header="Type">
                        <template #body="slotProps">
                            <div class="column-wrapper">
                                <p v-if="slotProps.data.occupancy" class="fixture__text">{{ slotProps.data.occupancy }} - {{ slotProps.data.fixtureType }}</p>
                            </div>
                        </template>
                    </Column>
                    <Column field="totals.loadValues.cold" header="Cold Demand (FU)" class="cell--blue"></Column>
                    <Column field="totals.sizes.cold" header="Cold Size" class="cell--blue"></Column>
                    <Column field="totals.loadValues.hot" header="Hot Demand (FU)" class="cell--red">
                        <template #body="slotProps">
                            <p>{{ slotProps.data.loadValues.hot === 0 ? '-' : slotProps.data.totals.loadValues.hot}}</p>
                        </template>
                    </Column>
                    <Column field="totals.sizes.hot" header="Hot Size" class="cell--red">
                        <template #body="slotProps">
                            <p>{{ slotProps.data.loadValues.hot === 0 ? '-' : slotProps.data.totals.sizes.hot }}</p>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </div>
    </div>
    <FixtureSidebar></FixtureSidebar>
</main>
</template>

<style scoped>

main {
    display: flex;
    margin-top: 0;
    height: 100vh;
    background: var(--surface-ground);
}

.content {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.wrapper {
    padding: 2rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: calc(100% - 96px);
}

.table {
    position: relative;
}

.card {
    box-shadow: none;
}

.table:deep .row {
    animation: show 750ms 100ms cubic-bezier(0.38, 0.97, 0.56, 0.76) forwards;
    opacity: 0;
    height: 72px;
    position: relative;
}

.header-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3rem;
}

@keyframes show {
    0% {
        background: white;
    }

    25% {
        background: #eee;
    }

    50% {
        background: white;
    }

    75% {
        background: #eee;
    }

    100% {
        opacity: 1;
        background: white;
    }
}

.total-card-wrapper {
    position: sticky;
    top: 0rem;
    z-index: 1000;
    box-shadow: none;
    background: var(--surface-ground);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
    width: 100%;
}

.totalCard {
    box-shadow: none;
    width: 100%;
}

.init-value {
    margin: 1.5rem 0 0;
}

.table:deep(.row--first) {
    width: 100%;
    z-index: 1000;
    background: white;
}

.table:deep(.row--first td) {
    background: white;
}

.table:deep(.p-datatable-header) {
    position: sticky;
    top: 0;
    z-index: 100;
}

.table:deep(.p-datatable-wrapper) {
    height: 100%;
    overflow-y: auto;
    position: relative;
}

.table:deep(.p-datatable-thead) {
    /* position: sticky; */
    top: 0;
    z-index: 100;
}

.workspace {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.table {
    width: 100%;
    border-radius: 12px;
    position: relative;
    height: 100%;
    overflow: hidden;
}

.table.flat {
    box-shadow: none;
}

.table.flat:deep(tr) {
    height: 3rem;
}

.table table {
    border-collapse: collapse;
}

.table table tr {
    border: 1px solid #e2e8f0;
    border-collapse: collapse;
}

.total-card-wrapper:before {
    content: "";
    height: 3rem;
    position: absolute;
    top: -3rem;
    background: var(--surface-ground);
    width: 100%;
    z-index: 10;
}

.total-card-wrapper:after {
    content: "";
    height: 3rem;
    position: absolute;
    bottom: -3rem;
    background: var(--surface-ground);
    width: 100%;
    z-index: 10;
}

.column-wrapper * {
    margin: 0.5rem 0;
}

.card-content-wrapper {
    display: flex;
    gap: 3rem;
}

.total-text {
    font-weight: bold;
}

.header__values {
    font-weight: normal;
}

.input-group {
    width: auto;
    height: 38px;
}

.header__actions {
    display: flex;
    gap: 2rem;
    align-items: center;
} 

.header__text {
    display: flex;
    gap: 2rem;
}

.header__values__title {
    font-weight: bold;
}

.table:deep(td.cell--red) {
    background: rgb(255, 242, 242);
}

.table:deep(td.cell--blue) {
    background: rgb(242, 247, 255);
}
</style>