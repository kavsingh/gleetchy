export const cancelEvent = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()

  return false
}

export const cancelReactEvent = <T extends { nativeEvent: Event }>(event: T) =>
  cancelEvent(event.nativeEvent)
