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

  private climates: any;

  constructor( private http: HttpClient ) { }

  ngOnInit(): void {
    // set city for the first time to jakarta.
    this.setClimate('Jakarta')
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
        this.formatingClimate(this.climates)
        console.log(this.climates)
      }
    })

  }

  // fromating climate
  formatingClimate(climates){
    let date_now = new Date()
    console.log('testt',date_now)
    // for (let i = 0; i < climatest)
  }

  cityChanges(event) {
    console.log(typeof event.srcElement.value, event.srcElement.value)
    let city = event.srcElement.value
    this.setClimate(city);
  }
}
