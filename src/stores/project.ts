import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from "uuid";

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
  }

  const postRiser = async (riserObj) => {
    const { label, sourceFloor, projectId } = riserObj; 

    const body = {
      id: uuidv4(),
      projectId,
      sourceFloor,
      label,
      coldSize: "",
      hotSize: "",
    }

    try {
      await fetch(`http://localhost:3000/risers`, 
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then((res) => res.json())
      .then((data) => {
        project.value.risers.push(data);
      })
    } catch (error) {
      console.error(error);
    }
  }

  return { project, riserLabel, getProject, getRiserLabel, postRiser }
})
