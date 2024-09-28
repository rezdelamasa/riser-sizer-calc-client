import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from "uuid";

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

  const postProject = async (projectObj) => {
    const { name, address, type, floors, risers } = projectObj; 

    const body = {
      id: uuidv4(),
      name,
      address,
      type,
      floors,
      risers
    }

    try {
      await fetch(`http://localhost:3000/projects`, 
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
        projects.value.push(data);
      })
    } catch (error) {
      console.error(error);
    }
  }



  return { projects, getProjects, postProject }
})
