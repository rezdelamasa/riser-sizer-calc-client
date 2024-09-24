import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project-store', () => {
  const project = ref(null)
  const riserLabel = ref(null)

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
        })
    } catch (error) {
      console.error(error);
    }
  }

  const getRiserLabel = async (riserId) => {
    try {
      await fetch(`http://localhost:3000/risers?id=${riserId}`)
        .then((response) => 
          response.json()
        )
        .then((data) => {
          riserLabel.value = data[0].label
        })
      } catch (error) {
        console.error(error);
      }
        // project.value = data
    }



  return { project, riserLabel, getProject, getRiserLabel }
})
