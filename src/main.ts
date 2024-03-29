import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import 'primevue/resources/themes/aura-light-green/theme.css'

import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import AutoComplete from 'primevue/autocomplete';
import Sidebar from 'primevue/sidebar';
import InputText from 'primevue/inputtext';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.component('InputNumber', InputNumber)
app.component('FloatLabel', FloatLabel)
app.component('Card', Card)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('AutoComplete', AutoComplete)
app.component('Sidebar', Sidebar)
app.component('InputText', InputText)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('Toast', Toast)
app.component('InputGroup', InputGroup)
app.component('InputGroupAddon', InputGroupAddon)
app.use(createPinia())

app.mount('#app')
