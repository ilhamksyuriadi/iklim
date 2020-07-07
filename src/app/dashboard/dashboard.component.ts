import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

@Injectable()
export class DashboardComponent implements OnInit {

  public climates: any;
  public date_list: any;
  public formatted_climates: any;
  public city: any;

  constructor( private http: HttpClient ) { }

  ngOnInit(): void {
    // set city for the first time to jakarta.
    this.city = 'Jakarta'
    this.setClimate(this.city)
  }

  // get api
  getClimate(city){

    let climate_url = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=271da6b323b05ebaf2b4aaa0f3378f89'
    return this.http.get(climate_url)

  }

  // set to variable
  setClimate(city){

    this.getClimate(city).subscribe( res => {
      if (res) {
        this.climates = res['list'];
        this.date_list = this.getDateList(this.climates);
        this.formatted_climates = this.formatingClimates(this.climates, this.date_list);
      }
    })

  }

  // fromating climate
  formatingClimates(climates, date_list){

    let formatted_climates = [];
    let divided_data = this.dividingData(climates, date_list);
    for (let i = 0; i < this.date_list.length; i++) {
      let climate_object = {
        date: date_list[i],
        climate: this.getAverageClimate(divided_data[date_list[i]]),
        diff: this.getAverageDiffClimate(divided_data[date_list[i]])
      }
      formatted_climates.push(climate_object);
    }
    console.log('divided', formatted_climates);
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

    this.city = event.srcElement.value;
    this.setClimate(this.city);

  }
}
