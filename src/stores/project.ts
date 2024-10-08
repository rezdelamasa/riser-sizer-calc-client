import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from "uuid";

export const useProjectStore = defineStore('project-store', () => {
  const project = ref(null)
  const riserLabel = ref(null)
  const riser = ref(null)

  const getProject = async (projectId) => {
    try {
      await fetch(`http://localhost:8080/projects/${projectId}`)
        .then((response) => 
          response.json()
        )
        .then((data) => {
          project.value = data
        })
    } catch (error) {
      console.error(error);
    }
  }

  const getRiser = async (riserId) => {
    try {
      await fetch(`http://localhost:8080/risers/${riserId}`)
        .then((response) => 
          response.json()
        )
        .then((data) => {
          riser.value = data
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
      await fetch(`http://localhost:8080/risers`, 
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
        project.value.projectRisers.push(data);
      })
    } catch (error) {
      console.error(error);
    }
  }

  const deleteRiser = async (riserId) => {
    console.log(riserId)

    try {
      await fetch(`http://localhost:8080/risers/${riserId}`,
      {
        method: "DELETE"
      })
      .then((res) => res.json())
      .then((data) => {
        project.value.projectRisers = project.value.projectRisers.filter(riser => riser.id != data.id)
      })
    } catch (error) {
        console.log(error);
    }
  }

  return { project, riser, riserLabel, getProject, getRiser, getRiserLabel, postRiser, deleteRiser }
})
