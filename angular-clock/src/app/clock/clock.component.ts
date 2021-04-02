import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
  secondsDegree:number;
  minutesDegree:number;
  hoursDegree:number;
  currentTime:string;
  zone:number; 
  interval:null | ReturnType<typeof setInterval> = null;
  city:string;
  animate:boolean;
  loading:boolean;
  zones:any;

  constructor() {  
    this.secondsDegree = 0;
    this.minutesDegree = 0;
    this.hoursDegree = 0;
    this.currentTime = "00:00:00";
    this.zone = 0;
    this.interval = null;
    this.city = "unknown";
    this.animate = false;
    this.loading = false;
    this.zones = {};
   }

  ngOnInit(): void {
    this.loading = true;
    axios.get("./data/zones.json")
    .then((response) => {
      this.zones = {...response.data.zones};
      //timeout to simulate fetching
      setTimeout(() => {
        if(Object.keys(this.zones).length > 0){
          // generating random UTC zone - max value is 14, min is -12
          let randomZone = Math.floor(Math.random() * (14 + 12 + 1)) - 12;
          
          this.zone = randomZone;
          this.city = this.zones[(randomZone).toString()]["city"];
          this.loading = false;
          this.interval = setInterval( () => {
            let date = new Date(
              new Date().toLocaleString('en-US', {
                timeZone: this.zones[this.zone]['tz']
              })
            );
            
            this.secondsDegree = date.getSeconds() * 6;
            this.minutesDegree = date.getMinutes() * 6 + date.getSeconds() * 6 / 60;
            this.hoursDegree = date.getHours() % 12 * 30 + date.getMinutes() * 6 / 12;
            this.currentTime = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
          }, 100);
        } else {
          this.loading = false;
        }
      }, 900);
    
    })
    .catch(error => {
      this.interval = null;
      this.zones = {};
      this.loading = false;
      console.log(error);
    });

  }

  ngOnDestroy(): void {
    if(this.interval){
      window.clearInterval(this.interval);
      this.interval = null;
    }
  }

  decrementZone(): void {
    if(this.zone > -12){
      this.zone -= 1;
      this.city = this.zones[(this.zone).toString()]["city"];
      this.animate = true;
      setTimeout(() => {
        this.animate = false;
      }, 500);
    }
  }

  incrementZone(): void {
    if(this.zone < 14){
      this.zone += 1;
      this.city = this.zones[(this.zone).toString()]["city"];
      this.animate = true;
      setTimeout(() => {
        this.animate = false;
      }, 500);
    }
  }

  emptyZonesObject(): boolean {
    if(Object.keys(this.zones).length === 0){
      return true;
    } else {
      return false;
    }
  }
}
