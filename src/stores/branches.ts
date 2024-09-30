import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from "uuid";

export const useBranchesStore = defineStore('branches-store', () => {

  const branch = ref({})

  const branches = ref([])

  const getBranches = async (riserId) => {
    try {
      await fetch(`http://localhost:8080/branches?riserId=${riserId}`)
        .then((response) => 
          response.json()
        )
        .then((data) => {
            branches.value = data
        })
    } catch (error) {
      console.error(error);
    }
  }

  const getBranch = async (branchId) => {
    try {
      await fetch(`http://localhost:3000/branches?id=${branchId}`)
        .then((response) => 
          response.json()
        )
        .then((data) => {
            branch.value = data[0]
        })
    } catch (error) {
      console.error(error);
    }
  }

  const postBranch = async (branchObj) => {
    const { label, startingFloor, riserId } = branchObj; 

    const body = {
      riserId,
      label,
      startingFloor,
    }

    try {
      await fetch(`http://localhost:8080/branches`, 
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
        branches.value.push(data);
      })
    } catch (error) {
      console.error(error);
    }
  }

  const deleteBranch = async (branchId) => {

    try {
      await fetch(`http://localhost:8080/branches/${branchId}`,
      {
        method: "DELETE"
      })
      .then((res) => res.json())
      .then((data) => {
        branches.value = branches.value.filter(branch => branch.id != data.id)
      })
    } catch (error) {
        console.log(error);
    }
  }

  return { branches, getBranches, branch, getBranch, postBranch, deleteBranch }
})
