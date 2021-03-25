import { Component, OnInit } from '@angular/core';

//temporary solution
const CITIES: any = {
  '-12':'Baker Island',
  '-11':'Niue',
  '-10':'Honolulu',
  '-9':'Anchorage',
  '-8':'Los Angeles',
  '-7':'Denver',
  '-6':'Mexico City',
  '-5':'New York',
  '-4':'Santiago',
  '-3':'São Paulo',
  '-2':'Fernando de Noronha',
  '-1':'Ittoqqortoormiit',
  '0':'London',
  '1':'Warsaw',
  '2':'Cairo',
  '3':'Moscow',
  '4':'Dubai',
  '5':'Karachi',
  '6':'Dhaka',
  '7':'Jakarta',
  '8':'Shanghai',
  '9':'Tokyo',
  '10':'Sydney',
  '11':'Nouméa',
  '12':'Auckland',
  '13':'Samoa',
  '14':'Line Islands'
};

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

  constructor() {
    let date = new Date();
    // generating random UTC zone - max value is 14, min is -12
    let randomZone = Math.floor(Math.random() * (14 + 12 + 1)) - 12;
    date.setHours(date.getUTCHours() + randomZone);
    this.secondsDegree = date.getSeconds() * 6;
    this.minutesDegree = date.getMinutes() * 6 + date.getSeconds() * 6 / 60;
    this.hoursDegree = date.getHours() % 12 * 30 + date.getMinutes() * 6 / 12;
    this.currentTime = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    this.zone = randomZone;
    this.interval = null;
    this.city = CITIES[randomZone.toString()];
    this.animate = false;
   }

  ngOnInit(): void {
    this.interval = setInterval( ()=>{
        let date = new Date();
        date.setHours(date.getUTCHours() + this.zone);
        this.secondsDegree = date.getSeconds() * 6;
        this.minutesDegree = date.getMinutes() * 6 + date.getSeconds() * 6 / 60;
        this.hoursDegree = date.getHours() % 12 * 30 + date.getMinutes() * 6 / 12;
        this.currentTime = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
      }, 100);
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
      this.city = CITIES[(this.zone).toString()];
      this.animate = true;
      setTimeout(() => {
        this.animate = false;
      }, 500);
    }
  }

  incrementZone(): void {
    if(this.zone < 14){
      this.zone += 1;
      this.city = CITIES[(this.zone).toString()];
      this.animate = true;
      setTimeout(() => {
        this.animate = false;
      }, 500);
    }
  }
}
