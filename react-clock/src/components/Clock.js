import React from 'react';
import './Clock.css';


class Clock extends React.Component{
    constructor(){
        super();
        let currentDate = new Date();
        currentDate.setHours(currentDate.getUTCHours());
        this.state = {
            zone: 0,
            time: currentDate,
            interval: false,
            secondsDegree: currentDate.getSeconds() * 6,
            minutesDegree: currentDate.getMinutes() * 6 + currentDate.getSeconds() * 6 / 60,
            hoursDegree : currentDate.getHours() % 12 * 30 + currentDate.getMinutes() * 6 / 12,
        }
        this.clockTick = this.clockTick.bind(this);
    }
    componentDidMount(){
        let interval = setInterval(this.clockTick, 0.1);
        this.setState({interval:interval});
    }
    componentWillUnmount(){
        clearInterval(this.state.interval);
        this.setState({interval:false});
    }
    clockTick(){
        let currentDate = new Date();
        currentDate.setHours(currentDate.getUTCHours() + this.state.zone);
        this.setState({
            time: currentDate,
            secondsDegree: currentDate.getSeconds() * 6,
            minutesDegree: currentDate.getMinutes() * 6 + currentDate.getSeconds() * 6 / 60,
            hoursDegree : currentDate.getHours() % 12 * 30 + currentDate.getMinutes() * 6 / 12,
        });
    }
    render(){
        return(
            <React.Fragment>
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
                        style={{transform: `rotate(${this.state.secondsDegree}deg)`}} 
                        >
                            <div class="second-hand"></div>
                        </div>
                        <div 
                        class="minute-hand-container"
                        style={{transform: `rotate(${this.state.minutesDegree}deg)`}}
                        >
                            <div class="minute-hand"></div>
                        </div>
                        <div 
                        class="hour-hand-container"
                        style={{transform: `rotate(${this.state.hoursDegree}deg)`}}
                        >
                            <div class="hour-hand"></div>
                        </div>
                        <div class="shield-pin"></div>
                        </div>
                    </div>
                    </div>
                    <div class="time-container">
                        <p>
                        {this.state.time.getHours() < 10 ? 
                            `0${this.state.time.getHours()}`: 
                            this.state.time.getHours()} : 
                        {this.state.time.getMinutes() < 10 ? 
                            `0${this.state.time.getMinutes()}`: 
                            this.state.time.getMinutes()} : 
                            {this.state.time.getSeconds() < 10 ? 
                                `0${this.state.time.getSeconds()}`: 
                                this.state.time.getSeconds()} (UTC+0)
                        </p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


export default Clock;