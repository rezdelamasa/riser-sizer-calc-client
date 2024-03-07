import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project-store', () => {
  const project = ref(null)

  const getProject = async (projectId) => {
    try {
      await fetch(`http://localhost:3000/projects?id=${projectId}`)
        .then((response) => 
          response.json()
        )
        .then((data) => {
          try {
            fetch(`http://localhost:3000/risers?projectId=${projectId}`)
              .then((response) => 
                response.json()
              )
              .then((riserData) => {
                project.value = {
                  ...data[0],
                  risers: riserData
                }
              })
          } catch (error) {
            console.error(error);
          }
          // project.value = data
        })
    } catch (error) {
      console.error(error);
    }
  }



  return { project, getProject }
})
