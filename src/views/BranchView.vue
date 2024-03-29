<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia'
import { useFixtureSidebarStore } from '@/stores/fixtureSidebar'
import { useBranchFixturesStore } from '@/stores/branchFixtures'
import FixtureSidebar from '../components/FixtureSidebar.vue'

const fixtureSidebarStore = useFixtureSidebarStore()
const branchFixturesStore = useBranchFixturesStore()
const { getFixtures } = useBranchFixturesStore()

const { params } = useRoute()


const fixturesTable = ref(null)
const headerHeight = ref(0)


onMounted(async () => {
    await getFixtures(params.branch_id)
    const header = fixturesTable.value.$el.querySelector('.p-datatable-header')
    const table = fixturesTable.value.$el.querySelector('.p-datatable-table') 
    headerHeight.value = header.offsetHeight
    table.style = "padding-bottom: " + headerHeight.value + "px;"
})

const { fixtures, calculatedFixtures, initColdValue, initHotValue } = storeToRefs(useBranchFixturesStore())

const firstFixture = computed(() => {
    return fixtures.value.slice(0, 1)
})

const rowClass = (data) => {
    return ['row'];
};
</script>

<template>
  <div class="container">
    <div class="content" ref="content">
        <template v-if="calculatedFixtures.length && firstFixture.length">
            <DataTable 
                ref="fixturesTable"
                :value="calculatedFixtures" 
                tableStyle="min-width: 50rem"
                class="table"
                :rowClass="(data) => rowClass(data)"
            >
                <template #header ref="Header">
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
                        <Button class="header__button">Add Fixture</Button>
                        </div>
                    </div>
            </template>
        </Card>
        <div class="workspace">
            <template v-if="calculatedFixtures.length">
                <DataTable 
                    :value="calculatedFixtures" 
                    tableStyle="min-width: 50rem"
                    class="table"
                    :rowClass="rowClass"
                >
                    <Column field="name" header="Name">
                        <template #body="slotProps">
                            <div class="column-wrapper">
                            <h4 class="fixture__name">{{ slotProps.data.name }}</h4>
                            <p v-if="slotProps.data.occupancy" class="fixture__text">{{ slotProps.data.occupancy }} - {{ slotProps.data.fixtureType }}</p>
                            </div>
                        </template>
                    </Column>
                    <Column field="totals.loadValues.hot" header="Hot FUs"></Column>
                    <Column field="totals.loadValues.cold" header="Cold FUs"></Column>
                    <Column field="totals.sizes.hot" header="Hot Size"></Column>
                    <Column field="totals.sizes.cold" header="Cold Size"></Column>
                </DataTable>
                <Button @click="fixtureSidebarStore.toggle" class="add-fixture-btn">Add Fixture</Button>
            </template>
        </div>
    </div>
    <FixtureSidebar></FixtureSidebar>
</div>
</template>

<style scoped>
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

.container {
    display: flex;
    margin-top: 0;
    height: 100%;
    background: var(--surface-ground);
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

.content {
    display: flex;
    flex-direction: column;
    flex: calc(100% - 360px) 1 1;
    height: 100vh;
    overflow: hidden;
    padding: 3rem;
    max-width: 100vw;
    gap: 3rem;
    position: relative;
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
</style>