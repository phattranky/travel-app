import { SelectCityFromTripAction } from './../../../../actions/trips.action';
import { City } from './../../../../models/city';
import * as fromRoot from './../../../../reducers/index';
import { Store } from '@ngrx/store';
import { Trip } from './../../../../models/trip';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tr-trip-flow-chart',
  templateUrl: './trip-flow-chart.component.html',
  styleUrls: ['./trip-flow-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TripFlowChartComponent {
  selectedTrip$: Observable<Trip>;
  selectedCity: string = null;

  constructor(private store: Store<fromRoot.State>) {
    this.selectedTrip$ = this.store.select(fromRoot.getSelectedTrip);
  }

  showCityActivity(id: string) {
    this.store.dispatch(new SelectCityFromTripAction(id));
  }

  onSelectCity(city: string) {
    if(this.selectedCity == city)
      this.selectedCity = null;
    else
      this.selectedCity = city;
  }

}


