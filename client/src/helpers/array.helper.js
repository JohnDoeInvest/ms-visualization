export const debounce = (fn, time) => {
  let timeout

  return function execute (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), time)
  }
}

export const isEmptyArray = arr => !(Array.isArray(arr) && arr.length > 0)

export default { debounce, isEmptyArray }
