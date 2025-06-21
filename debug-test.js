// Quick debug to see what's happening with the component
import { mount } from '@vue/test-utils'
import ObjectiveDisplay from './components/ObjectiveDisplay.vue'

const wrapper = mount(ObjectiveDisplay)
console.log('HTML:', wrapper.html())
console.log('Classes:', wrapper.classes())
console.log('Attributes:', wrapper.attributes())
console.log('Element:', wrapper.element)
