/* eslint-disable no-console */
/*
  Install offline service worker
  from https://github.com/ooade/NextSimpleStarter
*/
import { requireWindowWith } from '~/util/env'
import { noop } from '~/util/function'

const offlineInstall = (serviceWorkerUrl: string, scope: string) => {
  navigator.serviceWorker
    .register(serviceWorkerUrl, { scope })
    .then(reg => {
      reg.onupdatefound = function regOnUpdateFound() {
        const installingWorker = reg.installing

        if (!installingWorker) {
          return
        }

        installingWorker.onstatechange = function workerOnStateChange() {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                console.log('New or updated content is available.')
              } else {
                console.log('Content is now available offline!')
              }
              break
            case 'redundant':
              console.log('The installing serviceWorker became redundant.')
              break
            default:
              break
          }
        }
      }
    })
    .catch(error => {
      console.error('Error during service worker registration:', error)
    })
}

const shouldInstall =
  process.env.NODE_ENV === 'production' &&
  !!requireWindowWith(['navigator.serviceWorker'])

export default shouldInstall ? offlineInstall : noop
