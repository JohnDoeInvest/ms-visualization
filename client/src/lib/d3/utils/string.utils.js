
export function limitCharacters (value, maxCharacters) {
  return value.length > maxCharacters ? value.substr(0, maxCharacters) + '...' : value
}

export function validId (str) {
  // eslint-disable-next-line no-useless-escape
  return str.replace(/[-|\/|:]/gi, '_')
}
