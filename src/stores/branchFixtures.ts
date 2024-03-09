import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import getDemands from "../data/demands.js"
import sizesData from "../data/sizes.json"
import { uuid } from 'vue-uuid';

const sizes = sizesData.sizes
const demands = ref(getDemands())

export const useBranchFixturesStore = defineStore('branch-fixtures', () => {
    const fixtures = ref([])

    const recents = ref([])

    const favorites = ref([])
    const calculatedFixtures = computed(() => {
        let fixturesCopy = [...fixtures.value]
        for(let i = fixturesCopy.length - 1; i >= 0; i--) {

            fixturesCopy[i].totals = {
                loadValues: {
                    cold: 0,
                    hot: 0,
                },
                sizes: {
                    cold: "",
                    hot: ""
                }
            }

            const newColdTotal = fixturesCopy[i].loadValues.cold + 
            (i == fixturesCopy.length - 1 
                ? initColdValue.value
                : fixturesCopy[i + 1].totals.loadValues.cold
            )

            fixturesCopy[i].totals.loadValues.cold = Math.round((newColdTotal + Number.EPSILON) * 100) / 100

            fixturesCopy[i].totals.sizes.cold = getSize(newColdTotal)

            const newHotTotal = fixturesCopy[i].loadValues.hot + 
            (i == fixturesCopy.length - 1 
                ? initHotValue.value 
                : fixturesCopy[i + 1].totals.loadValues.hot
            )

            fixturesCopy[i].totals.loadValues.hot = Math.round((newHotTotal + Number.EPSILON) * 100) / 100

            fixturesCopy[i].totals.sizes.hot = getSize(newHotTotal)
        }
        return fixturesCopy
    })

    const getFixtures = async (branchId) => {
        try {
          await fetch(`http://localhost:3000/branches?id=${branchId}`)
            .then((response) => 
              response.json()
            )
            .then((data) => {
                fixtures.value = data[0].fixtures
            })
        } catch (error) {
          console.error(error);
        }
      }

    const getGPM = (fu) => {
        for(let i = 0; i < demands.value.length - 1; i++) {
            if(fu >= demands.value[i] && fu < demands.value[i + 1]) {
                return sizes[i]
            }
        }
        return sizes[0]
    }  

    const addToRecents = (fixture) => {
        if(recents.value.some(rec => rec.name === fixture.name && rec.occupancy === fixture.occupancy && rec.fixtureType === fixture.fixtureType)) return
        if(recents.value.length > 5) {
            recents.value.shift()
        }
        recents.value.push(fixture)
    }

    const addToFavorites = (fixture) => {
        if(favorites.value.length > 5) {
            favorites.value.shift()
        }
        favorites.value.push(fixture)
    }

    function addFixture(fixture, initColdValue, initHotValue) {
        const newFixture = {
            id: uuid.v1(),
            totals: {
                loadValues: {
                    cold: 0,
                    hot: 0,
                    total: 0
                },
                gpms: {
                    cold: 0,
                    hot: 0,
                    total: 0
                },
                sizes: {
                    cold: "",
                    hot: "",
                    total: ""
                }
            },
            ...fixture
        }
        branchFixtures.value.push(newFixture)
        updateLoads(initColdValue, initHotValue)
        addToRecents(fixture)
    }

    const updateLoads = (initColdValue, initHotValue) => {
        for(let i = branchFixtures.value.length - 1; i >= 0; i--) {
            const newColdTotal = branchFixtures.value[i].loadValues.cold + 
            (i == branchFixtures.value.length - 1 
                ? initColdValue 
                : branchFixtures.value[i + 1].totals.loadValues.cold
            )

            branchFixtures.value[i].totals.loadValues.cold = Math.round((newColdTotal + Number.EPSILON) * 100) / 100

            branchFixtures.value[i].totals.sizes.cold = getGPM(newColdTotal)

            const newHotTotal = branchFixtures.value[i].loadValues.hot + 
            (i == branchFixtures.value.length - 1 
                ? initHotValue 
                : branchFixtures.value[i + 1].totals.loadValues.hot
            )

            branchFixtures.value[i].totals.loadValues.hot = Math.round((newHotTotal + Number.EPSILON) * 10) / 10

            branchFixtures.value[i].totals.sizes.hot = getGPM(newHotTotal)
        }
    }

    const isFavorited = (fixture) => {
        return favorites.value.some(fav => fav.name === fixture.name && fav.occupancy === fixture.occupancy && fav.fixtureType === fixture.fixtureType)
    }

    return { fixtures, addFixture, recents, addToFavorites, favorites, isFavorited, updateLoads, getFixtures }
})
