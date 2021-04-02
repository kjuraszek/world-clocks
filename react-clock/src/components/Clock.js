import React from 'react';
import axios from 'axios';
import './Clock.css';
const classNames = require("classnames");

class Clock extends React.Component{
    constructor(){
        super();

        this.state = {
            zone: 0,
            time: "00:00:00",
            interval: false,
            secondsDegree: 0,
            minutesDegree: 0,
            hoursDegree : 0,
            city : "unknown",
            animate : false,
            zones: {},
            loading: false
        }
        this.clockTick = this.clockTick.bind(this);
        this.decrementZone = this.decrementZone.bind(this);
        this.incrementZone = this.incrementZone.bind(this);
    }
    componentDidMount(){
        this.setState({ loading: true });
        let zones = {};
        axios.get("./data/zones.json")
          .then((response) => {
            zones = {...response.data.zones};
            //timeout to simulate fetching
            setTimeout(() => {
                if(Object.keys(zones).length > 0){
                    let interval = setInterval(this.clockTick, 0.1);
                    // generating random UTC zone - max value is 14, min is -12
                    let randomZone = Math.floor(Math.random() * (14 + 12 + 1)) - 12;
                    this.setState({
                        loading: false,
                        zone: randomZone,
                        city: zones[(randomZone).toString()]["city"], 
                        zones: zones,
                        interval:interval
                    });
                }
            }, 700);
          })
          .catch(error => {
            this.setState({
                loading: false,
                zones: {},
                interval: false
            });
            console.log(error);
          });

    }
    componentWillUnmount(){
        if(this.state.interval){
            clearInterval(this.state.interval);
            this.setState({interval:false});
        }
    }
    clockTick(){
        let currentDate = new Date(
            new Date().toLocaleString('en-US', {
              timeZone: this.state.zones[this.state.zone]['tz']
            })
          );
        
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
                city : state.zones[(state.zone - 1).toString()]["city"],
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
                city : state.zones[(state.zone + 1).toString()]["city"],
                animate : true
            }));
            setTimeout(() => {
                this.setState({ animate : false });
            }, 500);
        }
    }
    render(){
        const LoadingMessage = 
            <div>
                <div class="uk-container uk-text-center loader-container">
                    <h3>Retrieving data...</h3>
                    <div uk-spinner="ratio: 4"></div>
                </div>
            </div>;
                
        const ErrorMessage =
            <div> 
                <div class="uk-container uk-text-center uk-text-danger error-container">
                    <h3>Unable to retrieve data - try to refresh the page.</h3>
                    <span uk-icon="icon: warning" ratio="4"></span>
                </div>
            </div>;

        const MainClock = 
            <div class="uk-animation-slide-bottom">
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
            </div>;
        
        return(
            <React.Fragment>
                <div>
                    {this.state.loading && LoadingMessage}

                    {!this.state.loading && 
                    Object.keys(this.state.zones).length === 0 && 
                    ErrorMessage}

                    {!this.state.loading && 
                    Object.keys(this.state.zones).length > 0 && 
                    MainClock}   
                    
                </div>
            </React.Fragment>
        );
    }
}


export default Clock;