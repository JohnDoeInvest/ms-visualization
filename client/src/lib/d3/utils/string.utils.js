
export function limitCharacters (value, maxCharacters) {
  return value.length > maxCharacters ? `${value.substr(0, maxCharacters)}...` : value
}

export function validId (str) {
  return str.trim().toLowerCase().replace(/[(&+\(\)-:\.)|(\s)]+/g, '_') // eslint-disable-line no-useless-escape
}

export function measureStringLength (str) {
  const SPAN_ID = 'string-measurement'
  let spanEl = document.getElementById(SPAN_ID)
  if (!spanEl) {
    spanEl = document.createElement('span')
    document.body.appendChild(spanEl)
  }
  spanEl.id = SPAN_ID
  spanEl.innerText = str
  spanEl.style.fontSize = '10px'
  spanEl.style.visibility = 'hidden'

  return spanEl.offsetWidth
}

export function trimToPixel (str, pixelLen) {
  let trimmedStr = str
  let tmpStr = str
  if (measureStringLength(str) > pixelLen) {
    trimmedStr += '...'
    while (measureStringLength(trimmedStr) > pixelLen) {
      tmpStr = tmpStr.substring(0, tmpStr.length - 1)
      trimmedStr = `${tmpStr}...`
    }
  }

  return trimmedStr
}
