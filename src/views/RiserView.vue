<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBranchesStore } from "@/stores/branches"
import { useRoute } from 'vue-router';
import BackLink from '@/components/BackLink.vue';

const branchesStore = useBranchesStore()

const { params, path } = useRoute()

const backLink = ref("")

onMounted(async () => {
    await branchesStore.getBranches(params.riser_id)
    backLink.value = "/projects/" + params.id
})

const branches = computed(() => {
  return branchesStore.branches
});
</script>
<template>
    <main>
        <BackLink :back-link="backLink" text="All Risers"/>
        <h1>Branches</h1>
        <div class="content">
            <Button class="create-button" icon="pi pi-plus" label="Create Branch"></Button>
            <Card class="card">
                <template v-if="branches" #content>
                    <DataTable :value="branches">
                        <Column field="label" header="Branch">
                            <template #body="slotProps">
                                <router-link :to="path + '/branches/' + slotProps.data.id">{{ slotProps.data.label }}</router-link>
                            </template>
                        </Column>
                        <Column header="Starting Floor" field="startingFloor"></Column>
                        <Column header="Fixture Count" field="fixtures.length"></Column>
                        <Column header="Total Cold Size" :field="`fixtures.${[0]}.totals.sizes.cold`"></Column>
                        <Column header="Total Hot Size" :field="`fixtures.${[0]}.totals.sizes.hot`"></Column>
                        <Column>
                            <template #body="slotProps">
                                <div class="actions">
                                    <Button class="actions__button" icon="pi pi-trash" severity="danger"></Button>
                                    <Button class="actions__button">
                                        <router-link :to="'/projects/' + slotProps.data.id"><i class="pi pi-external-link" style="color: white;"></i></router-link>
                                    </Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </div>
    </main>
</template>

<style scoped>
main {
    padding: 2rem 4rem;
    background: var(--surface-ground);
}

.content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
    margin-top: 4rem;
}

.create-button {
    height: 3rem;
}

.card {
    width: 100%;
}

.actions {
    display: flex;
    gap: 1rem;
    width: fit-content;
}

.actions__button {
    height: 2.5rem;
    width: 2.5rem;
    display: flex;
    justify-content: center;
}
</style>