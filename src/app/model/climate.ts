export class ClimateModel {

  public city: String;
  public forecast_data: [];
  public climate_avg: Number;
  public diff_climate_avg: Number;

  constructor(city) {
    this.city = city;
  }

  setClimateAvg (avg) {
    this.climate_avg = avg;
  }

  setDiffClimateAvg (diff_avg) {
    this.diff_climate_avg = diff_avg;
  }

  setCity (city) {
    this.city = city;
  }

  setForeCastData (forecast_data) {
    this.forecast_data = forecast_data;
  }

}