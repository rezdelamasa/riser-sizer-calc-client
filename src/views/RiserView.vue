<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBranchesStore } from "@/stores/branches"
import { useRoute } from 'vue-router';
import BackLink from '@/components/BackLink.vue';
import TitleHeader from '@/components/TitleHeader.vue';

const branchesStore = useBranchesStore()

const createDialogVisible = ref(false)

const backLink = ref("")
const { params, path } = useRoute()

onMounted(async () => {
    await branchesStore.getBranches(params.riser_id)
    backLink.value = "/projects/" + params.project_id
})

const branches = computed(() => {
  return branchesStore.branches
});

const toggleCreateDialog = () => {
    createDialogVisible.value = !createDialogVisible.value
}

</script>
<template>
    <main>
        <TitleHeader></TitleHeader>
        <div class="container">
            <BackLink :back-link="backLink" text="All Risers"/>
            <h1>Branches</h1>
            <div class="content">
                <Button @click="toggleCreateDialog" class="create-button" icon="pi pi-plus" label="Create Branch"></Button>
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
    background: var(--surface-ground);
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