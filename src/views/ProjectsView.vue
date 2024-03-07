<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from "@/stores/projects"

const projectsStore = useProjectsStore()

onMounted(async () => {
    await projectsStore.getProjects()
})

const projects = computed(() => {
  return projectsStore.projects
});
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