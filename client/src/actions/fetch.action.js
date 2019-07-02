export const FETCH_REQUESTED = 'FETCH_REQUESTED'
export const FETCH_SUCCEEDED = 'FETCH_SUCCEEDED'
export const FETCH_FAILED = 'FETCH_FAILED'

export const fetchRequest = () => ({
  type: FETCH_REQUESTED
})
export const fetchSuccess = () => ({
  type: FETCH_SUCCEEDED
})
export const fetchFailed = (error) => ({
  type: FETCH_FAILED,
  payload: { error }
})
