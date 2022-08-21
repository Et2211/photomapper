import initialState from './initialState'
import actionTypes from './../types'

export default function placesReducers(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_PLACES:
      return {
        ...state, 
        places: action.payload
      }

    default:
      return state
  }
}