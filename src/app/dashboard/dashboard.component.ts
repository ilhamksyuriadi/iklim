import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClimateModel } from '../model/climate';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

@Injectable()
export class DashboardComponent implements OnInit {

  public climate: any;
  public climates: any;

  constructor( private http: HttpClient ) { }

  ngOnInit(): void {
    // set city for the first time to jakarta.
    this.climate = new ClimateModel('Jakarta')
    this.setClimate(this.climate.city)
  }

  // get api
  getClimate(city){

    let climate_url = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=271da6b323b05ebaf2b4aaa0f3378f89'
    return this.http.get(climate_url)

  }

  // set to model
  setClimate(city){

    this.getClimate(city).subscribe( res => {
      if (res) {
        this.climates = res['list'];

        let new_date_list = this.getDateList(this.climates);
        let formatted_climates = this.formatingClimates(this.climates, new_date_list);
        this.climate.setForeCastData(formatted_climates);

        let climate_avg = this.getAllAverageClimate(this.climate.forecast_data);
        this.climate.setClimateAvg(climate_avg);

        let diff_climate_avg = this.getAllAverageDiffClimate(this.climate.forecast_data);
        this.climate.setDiffClimateAvg(diff_climate_avg);
      }
    })

  }

  // fromating climate
  formatingClimates(climates, date_list){

    let formatted_climates = [];
    let divided_data = this.dividingData(climates, date_list);
    for (let i = 0; i < date_list.length; i++) {
      let climate_object = {
        date: date_list[i],
        climate: this.getAverageClimate(divided_data[date_list[i]]),
        diff: this.getAverageDiffClimate(divided_data[date_list[i]])
      }
      formatted_climates.push(climate_object);
    }
    return formatted_climates;

  }

  // get average climate
  getAverageClimate(data) {

    let climate = 0;
    for (let i = 0; i < data.length; i++) {
      climate += data[i].main.temp;
    }
    climate = climate / data.length;
    let celcius_climates = (climate - 273.15).toFixed(2);
    return celcius_climates;

  }

  // get all average climate
  getAllAverageClimate(forecast) {

    let avg = 0
    for (let i = 0; i < forecast.length; i++) {
      avg += parseInt(forecast[i].climate)
    }

    return (avg / forecast.length).toFixed(2);

  }

  // get average diff climate
  getAverageDiffClimate(data) {

    let climate_diff = 0;
    for (let i = 0; i < data.length; i++) {
      climate_diff += (data[i].main.temp_max - data[i].main.temp_min);
    }
    climate_diff = climate_diff / data.length;
    let celcius_climates_diff = climate_diff.toFixed(2);
    return celcius_climates_diff;

  }

  // get all average diff climate
  getAllAverageDiffClimate(forecast) {

    let avg = 0
    for (let i = 0; i < forecast.length; i++) {
      avg += parseInt(forecast[i].diff)
    }

    return (avg / forecast.length).toFixed(2);

  }

  // get date list next 5 days
  getDateList(climates) {

    let date_list = []
    for (let i = 0; i < climates.length; i++) {
      let date = climates[i].dt_txt.slice(0,10)
      if (date_list.indexOf(date) < 0 && date_list.length < 5) {
        date_list.push(date)
      }
    }
    return date_list;

  }

  // dividing all data to 5 days
  dividingData(climates, date_list) {

    let data_per_day = {}

    for (let i = 0; i < date_list.length; i++) {
      let temp_data_per_day = []

      for (let j = 0; j < climates.length; j++) {
        if (date_list[i] == climates[j].dt_txt.slice(0,10)) {
          temp_data_per_day.push(climates[j])
        }
      }

      data_per_day[date_list[i]] = temp_data_per_day
    }

    return data_per_day
  }

  // city changes
  cityChanges(event) {

    let new_city = event.srcElement.value;
    this.climate.setCity(new_city)
    this.setClimate(this.climate.city);

  }
}
