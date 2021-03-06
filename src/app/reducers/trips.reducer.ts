import { TripsState } from './trips-state';
import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import { ActionTypes } from './../actions/trips.action';
import { Action } from '@ngrx/store';
import { Trip } from './../models/trip';
import { combineLatest } from 'rxjs/observable/combineLatest';

export interface State {
	trips: TripsState;
	selectedTripId: string;
	selectedCityId: string;
	editingTrip: Trip; 
}

const trip = <Trip>{}; // empty object
const initialState = {
	trips: {
		ids: [],
		trips: {},
	},
	selectedTripId: null,
	selectedCityId: null,
	editingTrip: trip
}

export function reducer(state = initialState, action: Action ): State {
	switch(action.type) {
		// TODO: CS: Refactor these return objects also make sure this 
		// is consistent in other reducers too.
		// https://www.pivotaltracker.com/story/show/136717477
		case ActionTypes.LOAD_TRIPS_SUCCESS: {
			const Trips = action.payload;
			const newTrips = Trips.filter(trip => !state.trips.trips[trip.id]);
			const newTripIds = newTrips.map(trip => trip.id);

			const trips = newTrips.reduce( ( trips: { [id: string]: Trip }, trip: Trip ) => {
				return Object.assign(trips, {
					[trip.id]: trip
				});
			}, {});

			return {
				trips: {
					ids: [ ...state.trips.ids, ...newTripIds], // equivalent to ruby flatten
					trips: Object.assign({}, state.trips.trips, trips)
				},
				selectedTripId: state.selectedTripId,
				selectedCityId: state.selectedCityId,
				editingTrip: state.editingTrip
			};
		}
		case ActionTypes.ADD_TRIP_TO_STORE: {
			const trip = action.payload;
			const newTrip = {
				[trip.id]: trip 
			} 

			return Object.assign({}, state, {trips: {
				ids: [...state.trips.ids, trip.id],
				trips: Object.assign({}, state.trips.trips, newTrip)
			}})
		}
		case ActionTypes.SELECT_TRIP: {
			return {
				trips: {
					ids: state.trips.ids,
					trips: state.trips.trips
				},
				selectedTripId: action.payload,
				selectedCityId: null,
				editingTrip: state.editingTrip
			};
		}
		case ActionTypes.SELECT_CITY: {
			return {
				trips: {
					ids: state.trips.ids,
					trips: state.trips.trips
				},
				selectedTripId: state.selectedTripId,
				selectedCityId: action.payload,
				editingTrip: state.editingTrip
			};
		}
		case ActionTypes.SAVE_TRIP_SUCCESS: {
			const trip = action.payload;
			return Object.assign({}, state, {editingTrip: trip})
		}
		case ActionTypes.CLEAR_EDITING_TRIP: {
			// Removed trip which was being edited
			return Object.assign({}, state, {editingTrip: trip})
		}
		case ActionTypes.SEARCH_TRIPS: {
			return Object.assign({}, initialState)
		}
		default: {
			return state;
		}
	}
}

export function getTrips(state : State) {
    return state.trips.trips;
} 

export function getTripIds(state: State) {
    return state.trips.ids;
}

export function getSelectedTripId(state: State) {
    return state.selectedTripId;
}

export function getSelectedCityId(state: State) {
    return state.selectedCityId;
}

// Buggy implementation change when working on editing feature
export function isEditingTrip(state: State): boolean {
	return state.editingTrip.hasOwnProperty('id') ? true : false;
}

export function getEditingTrip(state: State): Trip {
	return state.editingTrip;
}