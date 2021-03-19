import React from 'react';
import './Clock.css';


class Clock extends React.Component{
    constructor(){
        super();
        let currentDate = new Date();
        // generating random UTC zone - max value is 14, min is -12
        let randomZone = Math.floor(Math.random() * (14 + 12 + 1)) - 12;
        currentDate.setHours(currentDate.getUTCHours() + randomZone);
        this.state = {
            zone: randomZone,
            time: currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
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
            time: currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
            secondsDegree: currentDate.getSeconds() * 6,
            minutesDegree: currentDate.getMinutes() * 6 + currentDate.getSeconds() * 6 / 60,
            hoursDegree : currentDate.getHours() % 12 * 30 + currentDate.getMinutes() * 6 / 12,
        });
    }
    render(){
        return(
            <React.Fragment>
                <div>
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
                    </div>
                    <div class="time-container">
                        <p>
                        {this.state.time} (UTC{this.state.zone >= 0 ? '+' + this.state.zone : this.state.zone})
                        </p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


export default Clock;