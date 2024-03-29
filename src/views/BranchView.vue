<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia'
import { useFixtureSidebarStore } from '@/stores/fixtureSidebar'
import { useBranchFixturesStore } from '@/stores/branchFixtures'
import FixtureSidebar from '../components/FixtureSidebar.vue'

const fixtureSidebarStore = useFixtureSidebarStore()
const branchFixturesStore = useBranchFixturesStore()

const { params } = useRoute()

const { getFixtures } = useBranchFixturesStore()

onMounted(async () => {
    await getFixtures(params.branch_id)
})

const { fixtures, calculatedFixtures, initColdValue, initHotValue } = storeToRefs(useBranchFixturesStore())

const rowClass = () => {
    return ['row'];
};
</script>

<template>
  <div class="container">
    <div class="content">
        <Card class="card">
            <template #title>Branch Initialization</template>
            <template #content>
                <FloatLabel class="init-value">
                    <InputNumber 
                        id="init-value-input--hot"
                        v-model="initHotValue" 
                        @update:model-value="branchFixturesStore.updateLoads(initColdValue, initHotValue)"
                        :min-fraction-digits="1" 
                        :max-fraction-digits="1"
                    ></InputNumber>
                    <label for="init-value-input--hot">Initial Hot Fixture Units</label>
                </FloatLabel>
                <FloatLabel class="init-value">
                    <InputNumber 
                        id="init-value-input--cold"
                        v-model="initColdValue" 
                        @update:model-value="branchFixturesStore.updateLoads(initColdValue, initHotValue)"
                        :min-fraction-digits="1" 
                        :max-fraction-digits="1"
                    ></InputNumber>
                    <label for="init-value-input--cold">Initial Cold Fixture Units</label>
                </FloatLabel>
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
                                <h4 class="riser__name">{{ slotProps.data.name }}</h4>
                                <p class="riser__text">{{ slotProps.data.occupancy }}</p>
                                <p class="riser__text">{{ slotProps.data.fixtureType }}</p>
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
.table:deep .row {
    animation: show 750ms 100ms cubic-bezier(0.38, 0.97, 0.56, 0.76) forwards;
    opacity: 0;
    height: 72px;
    position: relative;
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

.add-fixture-btn {
    margin: 2rem 0;
}

.init-value {
    margin: 3rem 0;
}

.init-value:last-child {
    margin-bottom: 1rem;
}

.content {
    flex: calc(100% - 360px) 1 1;
    height: 100vh;
    overflow: auto;
    padding: 4rem;
    max-width: 100vw;
}

.workspace {
    margin-top: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.table {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

.table table {
    border-collapse: collapse;
}

.table table tr {
    border: 1px solid #e2e8f0;
    border-collapse: collapse;
}
</style>