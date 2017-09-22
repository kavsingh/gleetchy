export const createEl = (tag, attrs = {}) => {
  const el = document.createElement(tag)
  Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]))
  return el
}

export const createSlider = (label = '', attrs = {}) => {
  const container = createEl('div')
  const labelEl = createEl('label')
  const input = createEl('input', { type: 'range', ...attrs })

  labelEl.innerText = label

  container.appendChild(labelEl)
  container.appendChild(input)

  return { container, input }
}

export const attachEls = (container, els) => {
  const fragment = document.createDocumentFragment()

  els.forEach(el => fragment.appendChild(el))
  container.appendChild(fragment)

  return els
}

export const bindControl = (input, handler) => {
  handler()
  input.addEventListener('input', handler, false)

  return () => input.removeEventListener('input', handler)
}
