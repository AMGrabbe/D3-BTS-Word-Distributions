import React, {Component} from "react";
import * as d3 from "d3";



const width = 650;
const height = 650;
const rectWidth = 50;
const rectMargin =10;
const svgHeight = 100;
const margin = {top: 20,
right: 5,
bottom: 20,
left: 5};


const memberColors = {
    enter: "#FF665A",
    update: "#7D6B7D",
    exit: "#FF8C64"
}



class Chart extends Component {
      
   
    
    componentDidMount(){
        
        this.chart = d3.select(".graph").append('svg')
        .attr('height', svgHeight)
        .attr('overflow', "visible");
        
        this.drawBars();
    }

    drawBars(){
       //draw
    }

    render (){
        return (null)
    }
}