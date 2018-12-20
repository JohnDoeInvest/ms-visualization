
export function limitCharacters(value, maxCharacters) {
    return value.length > maxCharacters ? value.substr(0, maxCharacters) + '...' : value;
}