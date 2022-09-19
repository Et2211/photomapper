import actionTypes from './../types'

export function loadPlaces(payload) {
  return { type: actionTypes.LOAD_PLACES, payload: payload }
}

export function clearPlaces(payload) {
  return { type: actionTypes.CLEAR_PLACES }
}

