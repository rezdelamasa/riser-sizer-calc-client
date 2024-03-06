import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFixtureSidebarStore = defineStore('fixture-sidebar', () => {
  const visible = ref(false)
  const width = ref(0)
  function toggle() {
    visible.value = !visible.value
  }

  const setWidth = (w) => {
    console.log(w)
    width.value = w
  }

  return { visible, width, toggle, setWidth }
})
