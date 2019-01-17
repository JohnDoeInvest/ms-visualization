
export function limitCharacters(value, maxCharacters) {
    return value.length > maxCharacters ? value.substr(0, maxCharacters) + '...' : value;
}

export function validId(str) {
    return str.replace(/[-|\/|:]/gi, '_');
}