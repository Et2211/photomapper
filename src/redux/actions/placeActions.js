import actionTypes from './../types'

export function loadPlaces(payload) {
  return { type: actionTypes.LOAD_PLACES, payload: payload }
}

