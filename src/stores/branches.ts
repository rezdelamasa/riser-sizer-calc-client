import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBranchesStore = defineStore('branches-store', () => {

  const branch = ref({})

  const branches = ref([])

  const getBranches = async (riserId) => {
    try {
      await fetch(`http://localhost:3000/branches?riserId=${riserId}`)
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

  return { branches, getBranches, branch, getBranch }
})
