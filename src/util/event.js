export const cancelEvent = event => {
  event.preventDefault()
  event.stopPropagation()
  return false
}
