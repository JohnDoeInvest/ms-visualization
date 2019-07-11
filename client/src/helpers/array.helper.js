export const debounce = (fn, time) => {
  let timeout

  return function execute (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), time)
  }
}

export default { debounce }
