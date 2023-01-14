import { WyxosButton, WyxosForm, WyxosImage, WyxosInput, WyxosTags } from '@wyxos/vue-3-helpers'
import InlineSvg from 'vue-inline-svg'

export default function components(app){
  app.component('WyxosButton', WyxosButton)
  app.component('WyxosForm', WyxosForm)
  app.component('WyxosTags', WyxosTags)
  app.component('WyxosInput', WyxosInput)
  app.component('WyxosImage', WyxosImage)
  app.component('InlineSvg', InlineSvg)
}
