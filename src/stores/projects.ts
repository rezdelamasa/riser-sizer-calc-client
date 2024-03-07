import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProjectsStore = defineStore('projects-store', () => {
  const projects = ref([])

  const getProjects = async () => {
    try {
      await fetch('http://localhost:3000/projects')
        .then((response) => 
          response.json()
        )
        .then((data) => {
          projects.value = data
        })
    } catch (error) {
      console.error(error);
    }
  }



  return { projects, getProjects }
})
