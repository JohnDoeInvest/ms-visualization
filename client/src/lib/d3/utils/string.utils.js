
export const limitCharacters = (value, maxCharacters) =>
  value.length > maxCharacters ? `${value.substr(0, maxCharacters)}...` : value

export const validId = (str) =>
  str.trim().toLowerCase().replace(/[(&+\(\)-:\.)|(\s)]+/g, '_') // eslint-disable-line no-useless-escape

export const measureStringLength = (str) => {
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

export const trimToPixel = (str, pixelLen) => {
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
