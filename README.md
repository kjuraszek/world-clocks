# world-clocks
A set of online clocks - each made with different JavaScript framework.

This project was kind of experiment for me - I was curious if I can create the same application using three different frameworks.

For simplicity I am using full hours offsets based on [List of UTC time offsets](https://en.wikipedia.org/wiki/List_of_UTC_time_offsets). 

## Parts of the project

Project consists of:

* [main container](/main-container),
* [vue clock](/vue-clock),
* [react clock](/react-clock),
* [angular clock](/angular-clock).

Each part can work on its own - independently of others. 

## How current zone is determined ?

Two offsets of dates are compared to calculate zone (basing on the higher offset) and check if current zone has:

* daylight savings time in summer,
* daylight savings time in winter,
* no daylight savings time at all.

## Live demo

Demo available [here](https://kjuraszek.pl/world-clocks/).
