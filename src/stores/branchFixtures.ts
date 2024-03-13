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

    const initColdValue = ref(0)
    const initHotValue = ref(0)

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
          await fetch(`http://localhost:3000/fixtures?branchId=${branchId}`)
            .then((response) => 
              response.json()
            )
            .then((data) => {
                fixtures.value = data
            })
        } catch (error) {
          console.error(error);
        }
      }

    const getSize = (fu) => {
        for(let i = 0; i < demands.value.length - 1; i++) {
            if(fu >= demands.value[i] && fu < demands.value[i + 1]) {
                return sizes[i]
            }
        }
        return sizes[0]
    }  

    const addToRecents = (fixture) => {
        if(recents.value.some(rec => rec.name === fixture.name && rec.occupancy === fixture.occupancy && rec.fixtureType === fixture.fixtureType)) return
        if(recents.value.length === 5) {
            recents.value.pop()
        }
        recents.value.unshift(fixture)
    }

    const addToFavorites = (fixture) => {
        if(isFavorited(fixture)) {
            favorites.value = favorites.value.filter(favorite => !(favorite.name == fixture.name && favorite.fixtureType == fixture.fixtureType && favorite.occupancy == fixture.occupancy))
        } else {
            favorites.value.push(fixture)
        }
    }

    const postFixture = async (fixture) => {
        try {
            await fetch('http://localhost:3000/fixtures', {
                method: 'POST',
                body: JSON.stringify(fixture),
                headers: { 'Content-Type': 'application/json' }
            })
              .then((response) => 
                response.json()
              )
              .then((data) => {
                  fixtures.value.push(data)
              })
          } catch (error) {
            console.error(error);
          }

    }

    async function addFixture(fixture, branchId) {
        const newFixture = {
            id: uuid.v1(),
            branchId,
            ...fixture
        }
        
        addToRecents(fixture)

        await postFixture(newFixture, branchId)
    }

    const isFavorited = (fixture) => {
        return favorites.value.some(fav => fav.name === fixture.name && fav.occupancy === fixture.occupancy && fav.fixtureType === fixture.fixtureType)
    }

    return { fixtures, calculatedFixtures, initColdValue, initHotValue, addFixture, recents, addToFavorites, favorites, isFavorited, getFixtures }
})
