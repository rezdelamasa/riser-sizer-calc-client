<script setup lang="ts">
import { useBranchesStore } from "@/stores/branches";
import { useProjectStore } from "@/stores/project"
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const { params } = useRoute()

const { getProject, getRiser } = useProjectStore()
const { getBranch } = useBranchesStore()

const riserLabel = ref("")
const branchLabel = ref("")

onMounted(async () => {
    if(params.project_id) {
        await getProject(params.project_id)
    }
    if(params.riser_id) {
        await getRiser(params.riser_id)
        if(!riser.value) return;
        riserLabel.value = riser.value.label
    }
    if(params.branch_id) {
        await getBranch(params.branch_id)
        branchLabel.value = branch.value.label
    }
})

const { branch } = storeToRefs(useBranchesStore())
const { project, riser } = storeToRefs(useProjectStore())

</script>
<template>
    <header class="title_header flex align-items-center justify-content-start gap-8">
        <div v-if="params.project_id && project" class="flex flex-column align-items-start justify-content-center">
            <h3 class="text-gray-700 mt-0 mb-2">{{ project.name }}</h3>
            <p class="my-0">{{ project.address }}</p>
        </div>
        <div v-if="params.riser_id && riser" class="flex flex-column align-items-start justify-content-center">
            <h3 class="text-gray-700 mt-0 mb-2">Riser Label</h3>
            <p class="my-0">{{ riserLabel }}</p>
        </div>
        <div v-if="params.branch_id && branch" class="flex flex-column align-items-start justify-content-center">
            <h3 class="text-gray-700 mt-0 mb-2">Branch Label</h3>
            <p class="my-0">{{ branchLabel }}</p>
        </div>
    </header>
</template>

<style>
.back-link:hover {
    background: none;
    width: fit-content;
}

.back-link__button:hover {
    background: none; 
    color: #282e38;
}

.title_header {
    background: transparent;
    border-bottom: 2px solid #d1d5dc;
    width: 100%;
    z-index: 1000;
    top: 0;
    left: 0;
    min-height: 96px;
    height: 96px;
    padding: 0 4rem;
}
</style>