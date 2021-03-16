<template>
  <div>
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
    <div class="time-container">
        <p>
          {{currentTime}} (UTC +0)
        </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Clock',
  data : function(){
    let currentDate = new Date();
    currentDate.setHours(currentDate.getUTCHours());
        return {
            secondsDegree : currentDate.getSeconds() * 6,
            minutesDegree : currentDate.getMinutes() * 6 + currentDate.getSeconds() * 6 / 60,
            hoursDegree : currentDate.getHours() % 12 * 30 + currentDate.getMinutes() * 6 / 12,
            time : currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
            interval : false,
            utcZone : 0
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
        }
    },
    mounted : function(){
        this.tick();     
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
.time-container{
  text-align: center;
  font-size: 24px;
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
