import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBranchesStore = defineStore('branches-store', () => {
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

  return { branches, getBranches }
})
