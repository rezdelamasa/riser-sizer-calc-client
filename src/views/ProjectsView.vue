<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useProjectsStore } from "@/stores/projects"
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

const projectsStore = useProjectsStore()

const createDialogVisible = ref(false)

const projects = computed(() => {
  return projectsStore.projects
});

const form = reactive({
    name: null,
    address: null,
    type: null,
    floors: null,
    risers: null,
})

const rules = {
    name: { required: helpers.withMessage('Project Name is required.', required)},
    address: { required: helpers.withMessage('Address is required.', required)},
    type: { required: helpers.withMessage('Type is required.', required)},
    floors: { required: helpers.withMessage('Number of floors is required.', required)},
    risers: { required: helpers.withMessage('Number of risers is required.', required)}
}

const v$ = useVuelidate(rules, form)

onMounted(async () => {
    await projectsStore.getProjects()
})

const toggleCreateDialog = () => {
    createDialogVisible.value = !createDialogVisible.value
}
</script>
<template>
    <main>
        <h1>Projects</h1>
        <div class="content">
            <Button class="create-button" icon="pi pi-plus" label="Create Project"></Button>
            <Card class="card">
                <template #content>
                    <DataTable :value="projects">
                        <Column field="name" header="Name">
                            <template #body="slotProps">
                                <router-link :to="'/projects/' + slotProps.data.id">{{ slotProps.data.name }}</router-link>
                            </template>
                        </Column>
                        <Column field="address" header="Address"></Column>
                        <Column field="type" header="Type"></Column>
                        <Column field="floors" header="Floors"></Column>
                        <Column field="risers" header="Risers"></Column>
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
        <Dialog v-model:visible="createDialogVisible" modal header="Create Riser" :draggable="false" style="width: 80vw; max-width: 720px;">
            <div class="flex flex-column align-items-fill gap-3 mb-4">
                <label for="project_name" class="font-semibold w-100">Project Name</label>
                <InputText v-model="form.name" id="project_name" class="flex-auto" autocomplete="off" required />
                <span v-if="v$.name.$error" class="text-red-500">{{ v$.name.required.$message }}</span>
            </div>
            <div class="flex flex-column align-items-fill gap-3 mb-4">
                <label for="address" class="font-semibold">Address</label>
                <InputText v-model="form.address" id="address" class="flex-auto" autocomplete="off" required />
                <span v-if="v$.address.$error" class="text-red-500">{{ v$.address.required.$message }}</span>
            </div>
            <div class="flex flex-column align-items-fill gap-3 mb-4">
                <label for="building_type" class="font-semibold">Building Type</label>
                <InputText v-model="form.type" id="building_type" class="flex-auto" autocomplete="off" required />
                <span v-if="v$.type.$error" class="text-red-500">{{ v$.type.required.$message }}</span>
            </div>
            <div class="flex flex-column align-items-fill gap-3 mb-4">
                <label for="floors" class="font-semibold">Number of Floors</label>
                <InputNumber v-model="form.floors" id="floors" class="flex-auto" autocomplete="off" required />
                <span v-if="v$.floors.$error" class="text-red-500">{{ v$.floors.required.$message }}</span>
            </div>
            <div class="flex flex-column align-items-fill gap-3 mb-4">
                <label for="risers" class="font-semibold">Number of Risers</label>
                <InputNumber v-model="form.risers" id="floors" class="flex-auto" autocomplete="off" required />
                <span v-if="v$.risers.$error" class="text-red-500">{{ v$.risers.required.$message }}</span>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="toggleCreateDialog"></Button>
                <Button type="button" label="Save" @click="createProject"></Button>
            </div>
        </Dialog>
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