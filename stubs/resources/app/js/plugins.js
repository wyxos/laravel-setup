import Oruga from '@oruga-ui/oruga-next'
import router from './vue-router-setup'

export default function plugins (app) {
  app.use(Oruga, { iconPack: 'fas' })
  app.use(router)
}
