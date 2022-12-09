import Oruga from '@oruga-ui/oruga-next'
import router from './vue-router-setup'
import { WyxosButton, WyxosForm, WyxosImage, WyxosInput, WyxosTags } from '@wyxos/vue-3-helpers'
import InlineSvg from 'vue-inline-svg'

export default function plugins (app) {
  app.use(Oruga, { iconPack: 'fas' })
  app.use(router)
  app.component('WyxosButton', WyxosButton)
  app.component('WyxosForm', WyxosForm)
  app.component('WyxosTags', WyxosTags)
  app.component('WyxosInput', WyxosInput)
  app.component('WyxosImage', WyxosImage)
  app.component('InlineSvg', InlineSvg)
}
