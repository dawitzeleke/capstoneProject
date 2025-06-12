// Teachers reducer for storing teachers list
const initialState = {
  teachers: [],
  loading: false,
  error: null,
}

export const teachersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TEACHERS_REQUEST':
      return { ...state, loading: true, error: null }
    case 'FETCH_TEACHERS_SUCCESS':
      return { ...state, loading: false, teachers: action.payload }
    case 'FETCH_TEACHERS_FAILURE':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

// Action creators
export const fetchTeachersRequest = () => ({ type: 'FETCH_TEACHERS_REQUEST' })
export const fetchTeachersSuccess = (teachers) => ({ type: 'FETCH_TEACHERS_SUCCESS', payload: teachers })
export const fetchTeachersFailure = (error) => ({ type: 'FETCH_TEACHERS_FAILURE', payload: error })
