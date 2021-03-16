import { Component, OnInit } from '@angular/core';

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

  constructor() {
    let date = new Date();
    date.setHours(date.getUTCHours());
    this.secondsDegree = date.getSeconds();
    this.minutesDegree = date.getMinutes();
    this.hoursDegree = date.getHours();
    this.currentTime = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    this.zone = 0;
    this.interval = null;
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
}
