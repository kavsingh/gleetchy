/* eslint-disable no-console, no-param-reassign */
/* global process */
/*
  Install offline service worker
  from https://github.com/ooade/NextSimpleStarter
*/
import { noop } from './function'
import { hasWindowWith } from './env'

const offlineInstall = serviceWorkerUrl => {
  navigator.serviceWorker
    .register(serviceWorkerUrl, { scope: '/' })
    .then(reg => {
      reg.onupdatefound = function regOnUpdateFound() {
        const installingWorker = reg.installing

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
    .catch(e => {
      console.error('Error during service worker registration:', e)
    })
}

const shouldInstall =
  process.env.NODE_ENV === 'production' &&
  hasWindowWith(['navigator.serviceWorker'])

export default (shouldInstall ? offlineInstall : noop)
