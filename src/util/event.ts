export const cancelEvent = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()

  return false
}
