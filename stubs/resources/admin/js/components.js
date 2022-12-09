import InlineSvg from 'vue-inline-svg'
import { WyxosButton } from '@wyxos/vue-3-helpers'

export default function components(app){
  app.component('InlineSvg', InlineSvg)
  app.component('WyxosButton', WyxosButton)
}
