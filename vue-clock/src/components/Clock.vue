<template>
  <div>
    <div v-if="loading">
      <div class="uk-container uk-text-center loader-container">
        <h3>Retrieving data...</h3>
        <vk-spinner ratio="4"></vk-spinner>
      </div>
    </div>

    <div v-else>

      <div v-if="Object.keys(zones).length === 0"> 
        <div class="uk-container uk-text-center uk-text-danger error-container">
          <h3>Unable to retrieve data - try to refresh the page.</h3>
          <vk-icon icon="warning" ratio="4"></vk-icon>
        </div>
      </div>

      <div v-else class="uk-animation-slide-bottom">
        <div class="city-container uk-container uk-margin-auto uk-padding-small">
          <h3
          :class="[
          'uk-margin-none', 
          'uk-text-center',
          currentAnimation ? 'uk-animation-slide-top' : '']">
            {{currentCity}}
          </h3>
        </div>
        
        <div class="main-clock-parent">
          <div class="main-clock-height-fix"></div>
          <div class="main-clock-container">
            <div class="lines-container">
              <div class="shield-line line-1-container"></div>
              <div class="shield-line line-2-container"></div>
              <div class="shield-line line-3-container"></div>
              <div class="shield-line line-4-container"></div>
              <div class="shield-line line-5-container"></div>
              <div class="shield-line line-6-container"></div>
            </div>
            <div class="shield-container">
              <div class="main-clock">
                <div 
                class="second-hand-container" 
                v-bind:style="{ transform: 'rotate(' + currentSecondsDegree + 'deg)' }">
                  <div class="second-hand"></div>
                </div>
                <div 
                class="minute-hand-container"
                v-bind:style="{ transform: 'rotate(' + currentMinutesDegree + 'deg)' }">
                  <div class="minute-hand"></div>
                </div>
                <div 
                class="hour-hand-container"
                v-bind:style="{ transform: 'rotate(' + currentHoursDegree + 'deg)' }">
                  <div class="hour-hand"></div>
                </div>
                <div class="shield-pin"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="time-container uk-container uk-margin-auto uk-padding-small">
          <p class="uk-margin-none uk-text-large uk-text-center">
            {{currentTime}}
          </p>
        </div>

        <div class="zone-container uk-container uk-margin-auto uk-padding-small">
          <div class="uk-flex uk-flex-center uk-flex-middle uk-text-center">
              <div class="uk-flex-none">
                <vk-button 
                class="uk-padding-small"
                @click="decrementZone" 
                :disabled="utcZone < -11">
                  <vk-icon icon="chevron-left" ratio="1.5"></vk-icon>
                </vk-button>
              </div>
              <div 
              :class="[
                'uk-flex-1',
                currentAnimation === true ? 'uk-animation-slide-bottom' : ''
              ]">
                <p class="uk-margin-none uk-text-large">
                  UTC{{utcZone >= 0 ? '+' + utcZone : utcZone}}
                </p>
              </div>
              <div class="uk-flex-none">
                <vk-button 
                class="uk-padding-small"
                @click="incrementZone" 
                :disabled="utcZone > 13">
                  <vk-icon icon="chevron-right" ratio="1.5"></vk-icon>
                </vk-button>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Clock',
  data: function(){
    return {
        loading: true,
        zones: {},
        secondsDegree : 0,
        minutesDegree : 0,
        hoursDegree : 0,
        time : "00:00:00",
        interval : false,
        utcZone : 0,
        animate: false,
        city: "unknown"
    }
    },
    computed:{
        currentSecondsDegree : {
          get: function(){
            return this.secondsDegree;   
          },
          set: function(value){
            this.secondsDegree = value;
          },
        },
        currentMinutesDegree : {
          get: function(){
            return this.minutesDegree;   
          },
          set: function(value){
            this.minutesDegree = value;
          },
        },
        currentHoursDegree : {
          get: function(){
            return this.hoursDegree;   
          },
          set: function(value){
            this.hoursDegree = value;
          },
        },
        currentTime: {
          get: function(){
            return this.time;
          },
          set: function(date){
            this.time = date;
          },
        },
        currentZone: {
          get: function(){
            return this.utcZone;
          },
          set: function(zone){
            this.utcZone = zone;
          },
        },
        currentAnimation: {
          get: function(){
            return this.animate;
          },
          set: function(anim){
            this.animate = anim;
          },
        },
        currentCity: {
          get: function(){
            return this.city;
          },
          set: function(value){
            this.city = value;
          },
        }
    },
    mounted : function(){
      this.getZonesData();
      this.tick();    
    },
    beforeDestroy() {
       clearInterval(this.interval);
    },
    methods : {
        tick : function(){          
          this.interval = setInterval(function(){
            if(this.loading === false && Object.keys(this.zones).length > 0){

              // get current date in selected zone
              let date = new Date(
                new Date().toLocaleString('en-US', {
                  timeZone: this.zones[this.utcZone]['tz']
                })
              );

              // 360deg by 60s gives 6 degrees per second
              this.currentSecondsDegree = date.getSeconds() * 6;

              // 360deg by 60m gives 6 degrees per minute PLUS seconds proportionally
              this.currentMinutesDegree = date.getMinutes() * 6 + date.getSeconds() * 6 / 60;

              // 360deg by 12h gives 30 degrees per hour PLUS minutes proportionally
              this.currentHoursDegree = date.getHours() % 12 * 30 + date.getMinutes() * 6 / 12;
              this.currentTime = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
            }
          }.bind(this), 0.1);
      },
      incrementZone : function(){
        if(this.currentZone < 14){
          this.currentAnimation = true;
          this.currentZone += 1;
          this.currentCity = this.zones[this.currentZone.toString()]["city"];
          setTimeout(() => this.currentAnimation = false, 500);
        }
      },
      decrementZone : function(){
        if(this.currentZone > -12){
          this.currentAnimation = true;
          this.currentZone -= 1;
          this.currentCity = this.zones[this.currentZone.toString()]["city"];
          setTimeout(() => this.currentAnimation = false, 500);
        }
      },
      setClockTime() {
        let currentDate = new Date();
        let currentZone = this.setClockZone();
        
        this.secondsDegree = currentDate.getSeconds() * 6;
        this.minutesDegree = currentDate.getMinutes() * 6 + currentDate.getSeconds() * 6 / 60;
        this.hoursDegree = currentDate.getHours() % 12 * 30 + currentDate.getMinutes() * 6 / 12,
        this.time = currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
        this.interval = false;
        this.utcZone = currentZone;
        this.animate = false;
        this.city = this.zones[currentZone.toString()]["city"];
        this.loading = false;
      },
      setClockZone(){

        // compare offsets of two dates (summer and winter)
        let today = new Date();
        let offset_1 = new Date(today.getFullYear(), 0, 1).getTimezoneOffset();
        let offset_2 = new Date(today.getFullYear(), 6, 1).getTimezoneOffset();
        let zone = 0;
        
        if(offset_1 > offset_2){
        // daylight saving time in summer
          zone = offset_1 / -60;
        } else if(offset_2 > offset_1){
        // daylight saving time in winter
          zone = offset_2 / -60;
        } else {
        // no daylight saving time
          zone = offset_1 / -60;
        }
        return zone;
      },
      getZonesData() {
          this.loading = true;
          
          axios.get(process.env.BASE_URL + "data/zones.json")
          .then((response) => {
            this.zones = {...response.data.zones};
            setTimeout(() => this.setClockTime(), 2000);
          })
          .catch(error => {
            this.zones = {};
            this.loading = false;
            console.log(error);
          });
      }
    },
}
</script>

<style scoped>
.main-clock-container{
  z-index:1;
  width:300px;
  height:300px;
  margin: auto;
  border:2px solid black;
  border-radius: 100%;
  position: relative;
}
.city-container, .zone-container, .time-container, .loader-container, .error-container{
  width:300px;
}
.city-container h3{
  font-size: 36px;
  font-weight: 700;
}
.lines-container{
  width:100%;
  height:100%;
  position: absolute;
}
.shield-container{
  width:100%;
  height:100%;
  position: absolute;
}
.shield-line{
  width:2%;
  height:100%;
  left: 49%;
  background:black;
  position: absolute;
}
.line-1-container{
  transform:rotate(0deg);
}
.line-2-container{
  transform:rotate(30deg);
}
.line-3-container{
  transform:rotate(60deg);
}
.line-4-container{
  transform:rotate(90deg);
}
.line-5-container{
  transform:rotate(120deg);
}
.line-6-container{
  transform:rotate(150deg);
}
.main-clock{
  width:80%;
  height:80%;
  top: 10%;
  left:10%;
  background: #fff;
  border-radius: 100%;
  position: relative;
  z-index:10;
}
.second-hand-container, .minute-hand-container, .hour-hand-container{
  position: absolute;
  width: 100%;
  height: 100%;
  z-index:20;
}
.second-hand{
  width:2%;
  height:50%;
  margin-top:0;
  margin-left: 49%;
  display:block;
  background:red;
  border-radius: 50%;
  z-index:30;
}
.minute-hand{
  width:4%;
  height:45%;
  margin-top:5%;
  margin-left: 48%;
  display:block;
  background:black;
  border-radius: 50%;
  z-index:40;
}
.hour-hand{
  width:4%;
  height:30%;
  margin-top:20%;
  margin-left: 48%;
  display:block;
  background:black;
  border-radius: 50%;
  z-index:50;
}
.shield-pin{
  position: absolute;
  z-index:20;
  width:6%;
  height:6%;
  left: 47%;
  top: 47%;
  display:block;
  background:blue;
  border-radius: 50%;
  z-index:60;
}
</style>
