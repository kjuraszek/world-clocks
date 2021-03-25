import React from 'react';
import './Clock.css';
const classNames = require("classnames");

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
            city : CITIES[randomZone.toString()],
            animate : false,
        }
        this.clockTick = this.clockTick.bind(this);
        this.decrementZone = this.decrementZone.bind(this);
        this.incrementZone = this.incrementZone.bind(this);
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
    decrementZone(){
        if(this.state.zone > -12){
            this.setState((state) => ({
                zone : state.zone - 1,
                city : CITIES[(state.zone - 1).toString()],
                animate : true
            }));
            setTimeout(() => {
                this.setState({ animate : false });
            }, 500);
        }
    }
    incrementZone(){
        if(this.state.zone < 14){
            this.setState((state) => ({
                zone : state.zone + 1,
                city : CITIES[(state.zone + 1).toString()],
                animate : true
            }));
            setTimeout(() => {
                this.setState({ animate : false });
            }, 500);
        }
    }
    render(){
        return(
            <React.Fragment>
                <div>
                <div class="city-container uk-container uk-margin-auto uk-padding-small">
                <h3 
                className={classNames(
                        [
                            "uk-margin-none",
                            "uk-text-center",
                            this.state.animate ? "uk-animation-slide-top" : ""
                        ]
                    )}>
                    {this.state.city}
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

                    <div class="time-container uk-container uk-margin-auto uk-padding-small">
                        <p class="uk-margin-none uk-text-large uk-text-center">
                            {this.state.time}
                        </p>
                    </div>

                    <div class="zone-container uk-container uk-margin-auto uk-padding-small">
                        <div class="uk-flex uk-flex-center uk-flex-middle uk-text-center">
                            <div class="uk-flex-none">
                                <button 
                                class="uk-padding-small uk-button uk-button-default"
                                disabled={this.state.zone < -11}
                                onClick={this.decrementZone}>
                                    <span uk-icon="icon: chevron-left" ratio="1.5"></span>
                                </button>
                            </div>
                            <div 
                            class="uk-flex-1">
                                <p className={classNames(
                                    [
                                        "uk-margin-none",
                                        "uk-text-large",
                                        this.state.animate ? "uk-animation-slide-bottom" : ""
                                    ]
                                )}>
                                UTC{this.state.zone >= 0 ? '+' + this.state.zone : this.state.zone}
                                </p>
                            </div>
                            <div class="uk-flex-none">
                                <button 
                                    class="uk-padding-small uk-button uk-button-default"
                                    disabled={this.state.zone > 13}
                                    onClick={this.incrementZone}>
                                        <span uk-icon="icon: chevron-right" ratio="1.5"></span>
                                </button>
                            </div>
                        </div>
                        </div>
                </div>
            </React.Fragment>
        );
    }
}


export default Clock;