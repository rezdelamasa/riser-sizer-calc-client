<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from "@/stores/project"
import { useRoute } from 'vue-router';
import BackLink from '../components/BackLink.vue'
import TitleHeader from '@/components/TitleHeader.vue';

const projectStore = useProjectStore()

const { params } = useRoute()

const createDialogVisible = ref(false)

const form = reactive({
    sourceFloor: null,
    riserLabel: null,
    notes: null
})

onMounted(async () => {
    await projectStore.getProject(params.project_id)
})

const project = computed(() => {
  return projectStore.project
});

const toggleCreateDialog = () => {
    createDialogVisible.value = !createDialogVisible.value
}

const createRiser = async () => {
    const result = await v$.value.$validate()
    if (!result) {
        return
    }

    const riserObj = {
        label: form.riserLabel,
        sourceFloor: form.sourceFloor,
        notes: form.notes,
        projectId: params.project_id
    }

    const newRiser = await projectStore.postRiser(riserObj)
    return toggleCreateDialog()
}

</script>
<template>
    <main v-if="project">
        <TitleHeader></TitleHeader>
        <div class="container">
            <BackLink to="/projects" text="All Projects" />
            <h1>Risers</h1>
            <div class="content">
                <Button @click="toggleCreateDialog" class="create-button" icon="pi pi-plus" label="Create Riser"></Button>
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
        </div>
        <Dialog v-model:visible="createDialogVisible" modal header="Create Riser" :draggable="false" style="width: 80vw; max-width: 720px;">
            <div class="flex flex-column align-items-fill gap-3 mb-4">
                <label for="riser_label" class="font-semibold w-100">Riser Label</label>
                <InputText v-model="form.riserLabel" id="riser_label" class="flex-auto" autocomplete="off" required />
                <span v-if="v$.riserLabel.$error" class="text-red-500">{{ v$.riserLabel.required.$message }}</span>
            </div>
            <div class="flex flex-column align-items-fill gap-3 mb-4">
                <label for="source_floor" class="font-semibold">Source Floor</label>
                <InputText v-model="form.sourceFloor" id="source_floor" class="flex-auto" autocomplete="off" required />
                <span v-if="v$.sourceFloor.$error" class="text-red-500">{{ v$.sourceFloor.required.$message }}</span>
            </div>
            <div class="flex flex-column align-items-fill gap-3 mb-4">
                <label for="notes" class="font-semibold">Notes (Optional)</label>
                <Textarea v-model="form.notes" id="notes" rows="8" cols="30" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="toggleCreateDialog"></Button>
                <Button type="button" label="Save" @click="createRiser"></Button>
            </div>
        </Dialog>
    </main>
</template>

<style scoped>
main {
    background: var(--surface-ground);
    position: relative;
}

.container {
    padding: 2rem 4rem;
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