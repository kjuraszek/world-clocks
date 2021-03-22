<template>
  <div>

    <div class="city-container uk-container uk-margin-auto uk-padding-small">
      <h3
      :class="currentAnimation === true ? 'uk-margin-none uk-text-center uk-animation-slide-top' : 'uk-margin-none uk-text-center'">
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

    <div class="zone-container uk-container uk-margin-auto uk-padding-small" style="width:300px">
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
          :class="currentAnimation === true ? 'uk-flex-1 uk-animation-slide-bottom' : 'uk-flex-1'">
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
</template>

<script>
//temporary solution
const CITIES = {
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
export default {
  name: 'Clock',
  data : function(){
    let currentDate = new Date();
    let currentZone = currentDate.getHours() - currentDate.getUTCHours();
    currentDate.setHours(currentDate.getUTCHours() + currentZone);
        return {
            secondsDegree : currentDate.getSeconds() * 6,
            minutesDegree : currentDate.getMinutes() * 6 + currentDate.getSeconds() * 6 / 60,
            hoursDegree : currentDate.getHours() % 12 * 30 + currentDate.getMinutes() * 6 / 12,
            time : currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
            interval : false,
            utcZone : currentZone,
            animate: false,
            city: CITIES[currentZone.toString()]
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
      this.currentAnimation = true;
      this.tick();
      this.currentAnimation = false;     
    },
    beforeDestroy() {
       clearInterval(this.interval);
    },
    methods : {
        tick : function(){          
          this.interval = setInterval(function(){
            let date = new Date();

            // set UTC hours first
            date.setHours(date.getUTCHours() + this.utcZone);

            // 360deg by 60s gives 6 degrees per second
            this.currentSecondsDegree = date.getSeconds() * 6;

            // 360deg by 60m gives 6 degrees per minute PLUS seconds proportionally
            this.currentMinutesDegree = date.getMinutes() * 6 + date.getSeconds() * 6 / 60;

            // 360deg by 12h gives 30 degrees per hour PLUS minutes proportionally
            this.currentHoursDegree = date.getHours() % 12 * 30 + date.getMinutes() * 6 / 12;
            this.currentTime = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
          }.bind(this), 0.1);
      },
      incrementZone : function(){
        if(this.utcZone < 14){
          this.currentAnimation = true;
          this.utcZone += 1;
          this.currentCity = CITIES[this.currentZone.toString()];
          setTimeout(() => this.currentAnimation = false, 500);
        }
      },
      decrementZone : function(){
        if(this.utcZone > -12){
          this.currentAnimation = true;
          this.utcZone -= 1;
          this.currentCity = CITIES[this.currentZone.toString()];
          setTimeout(() => this.currentAnimation = false, 500);
        }
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
.city-container, .zone-container, .time-container{
  width:300px;
}
.city-container h3{
  font-size: 48px;
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
