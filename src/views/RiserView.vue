<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useBranchesStore } from "@/stores/branches"
import { useProjectStore } from "@/stores/project"
import { useRoute } from 'vue-router';
import BackLink from '@/components/BackLink.vue';
import TitleHeader from '@/components/TitleHeader.vue';
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

const branchesStore = useBranchesStore()
const projectStore = useProjectStore()

const createDialogVisible = ref(false)

const backLink = ref("")
const { params, path } = useRoute()

const form = reactive({
    label: null,
    startingFloor: null,
})

const rules = {
    label: { required: helpers.withMessage('Branch Label is required.', required)},
    startingFloor: { required: helpers.withMessage('Starting Floor is required.', required)},
}

const v$ = useVuelidate(rules, form)

onMounted(async () => {
    await projectStore.getRiser(params.riser_id)
    await branchesStore.getBranches(params.riser_id)
    backLink.value = "/projects/" + params.project_id
})

const branches = computed(() => {
  return branchesStore.branches
});

const toggleCreateDialog = () => {
    createDialogVisible.value = !createDialogVisible.value
}

const createBranch = async () => {
    const result = await v$.value.$validate()
    if (!result) {
        return
    }

    const branchObj = {
        label: form.label,
        startingFloor: form.startingFloor,
        riserId: params.riser_id
    }

    await branchesStore.postBranch(branchObj)
    return toggleCreateDialog()
}

const deleteBranch = async (branchId) => {
    await branchesStore.deleteBranch(branchId)
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
                            <template #empty> No branches found.</template>
                            <template #loading> Loading customers data. Please wait. </template>
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
                <label for="label" class="font-semibold w-100">Branch Label</label>
                <InputText v-model="form.label" id="label" class="flex-auto" autocomplete="off" required />
                <span v-if="v$.label.$error" class="text-red-500">{{ v$.label.required.$message }}</span>
            </div>
            <div class="flex flex-column align-items-fill gap-3 mb-4">
                <label for="startingFloor" class="font-semibold">Starting Floor</label>
                <InputNumber v-model="form.startingFloor" id="startingFloor" class="flex-auto" autocomplete="off" required />
                <span v-if="v$.startingFloor.$error" class="text-red-500">{{ v$.startingFloor.required.$message }}</span>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="toggleCreateDialog"></Button>
                <Button type="button" label="Save" @click="createBranch"></Button>
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