/* eslint-disable no-console */
/*
  Install offline service worker
  from https://github.com/ooade/NextSimpleStarter
*/
let offlineInstall: (serviceWorkerUrl: string, scope: string) => void = () => {
  console.log('Offline install skipped in development env')
}

if (process.env.NODE_ENV === 'production') {
  offlineInstall = (serviceWorkerUrl, scope) => {
    if (!window?.navigator?.serviceWorker) return

    navigator.serviceWorker
      .register(serviceWorkerUrl, { scope })
      .then(registration => {
        registration.onupdatefound = function regOnUpdateFound() {
          const installingWorker = registration.installing

          if (!installingWorker) return

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
}

export default offlineInstall
