<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from "@/stores/project"
import { useRoute } from 'vue-router';
import BackLink from '../components/BackLink.vue'
import TitleHeader from '@/components/TitleHeader.vue';

const projectStore = useProjectStore()

const { params } = useRoute()

onMounted(async () => {
    await projectStore.getProject(params.project_id)
})

const project = computed(() => {
  return projectStore.project
});
</script>
<template>
    <main v-if="project">
        <TitleHeader></TitleHeader>
        <BackLink to="/projects" text="All Projects" />
        <h1>Risers</h1>
        <div class="content">
            <Button class="create-button" icon="pi pi-plus" label="Create Riser"></Button>
            <Card class="card">
                <template v-if="project" #content>
                    <DataTable :value="project.risers">
                        <Column field="label" header="Riser">
                            <template #body="slotProps">
                                <router-link :to="'/projects/' + params.project_id + '/risers/' + slotProps.data.id">{{ slotProps.data.label }}</router-link>
                            </template>
                        </Column>
                        <Column header="Starting Floor" field="sourceFloor"></Column>
                        <Column header="Cold Size" field="totalSizes.cold"></Column>
                        <Column header="Hot Size" field="totalSizes.hot"></Column>
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
    padding: 120px 4rem;
    background: var(--surface-ground);
    position: relative;
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

.title_header {
    background: transparent;
    border-bottom: 2px solid #d1d5dc;
    width: 100%;
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
    height: 96px;
    padding: 0 4rem;
    box-sizing: border-box;
}
</style>