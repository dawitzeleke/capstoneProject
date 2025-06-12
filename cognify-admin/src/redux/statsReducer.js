// Stats reducer for storing dashboard stats
const initialState = {
  stats: null,
  loading: false,
  error: null,
}

export const statsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_STATS_REQUEST':
      return { ...state, loading: true, error: null }
    case 'FETCH_STATS_SUCCESS':
      return { ...state, loading: false, stats: action.payload }
    case 'FETCH_STATS_FAILURE':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

// Action creators
export const fetchStatsRequest = () => ({ type: 'FETCH_STATS_REQUEST' })
export const fetchStatsSuccess = (stats) => ({ type: 'FETCH_STATS_SUCCESS', payload: stats })
export const fetchStatsFailure = (error) => ({ type: 'FETCH_STATS_FAILURE', payload: error })
