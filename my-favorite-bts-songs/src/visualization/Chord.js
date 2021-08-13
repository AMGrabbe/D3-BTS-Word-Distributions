/* eslint-disable react/prop-types */
import React, {Component} from "react";
import * as ch from "./new_chord";
import * as rib from "./new_ribbons";
import * as d3 from "d3";

var _ = require('lodash');


class Chord extends Component {
    constructor(props)
    {
        super(props);
    }   

    async componentDidMount(){
        
        this.chord = d3.select(".diagram").append('svg')
        .attr('height', 1000)
        .attr('width', 1000)
        .append("g")
        .attr('transform', "translate( 500, 500)")
       
        
    }

    async componentDidUpdate(){
        this.drawChord();
    }
    
    drawChord(){
        const {data} = this.props;      
        const names = ["RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "Junkook" ]
        const colors =  ["#162D59", "#E99FBD", "#B4B8BF", "#F20505", "#D9AA1E", "#05A66B", "#B430D9"]
        const memberColors = _.zipObject(names, colors);
    
        
        const test = ch.new_chord().padAngle(0.05)
        (data.Sequence)  
   
        const sData = d3.groups(test, d => d.source.isStart).keys();

        const start = _.filter(test, (el) =>{
            return el.source.isStart === true;
        } )
        console.log(sData);
        console.log(start);

        const groups = this.chord
            .datum(test)
            .append("g")
            .selectAll("g")
            .data(d =>  d.groups)
            .enter()

        groups.append("g")
            .append("path")
                .style("fill", (d, i) =>memberColors[d.membername])
                .attr("d", d3.arc()
                .innerRadius(100)
                .outerRadius(110)
                );
        
        
        // TODO: return subgroups in an array
        const subgroups = this.chord
            .datum(test)
            .append("g");
            
        const ribbons = subgroups.selectAll("g")
            .data(d => d)
            .join("g");
            
     
        ribbons.append("path")
        //.style("fill", (d, i) =>memberColors[d.source.membername])
        .attr("fill", (d) => calculateGradient(d)) 
        .attr("d", rib.ribbon()
            .radius(115)
            .padAngle(0.1))
        //.style('opacity', 0.3);
        console.log(ribbons);

        let outside = this.chord
            .data(start)
            .append("g")

        outside
        .selectAll("g")
        .data(d => groupTicks(d.source))    // Controls the number of ticks: one tick each 25 here.
        .join("g")
        .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(220,0)`)
        .append('circle')
            .attr('r', 5)
            .attr('fill', 'orange')
           
     
        function groupTicks(d) {
                return d3.range(0, d.value, 100).map(function(value) {
                     let t = {
                         value: value, 
                        angle: d.endAngle /2};
                    console.log(t);
                    return t;
                });
              
        }

        function calculateGradient(d) {
            d3.select('svg').append("linearGradient")
                .attr("id", `line-gradient-${d.source.index}`)
                .attr("gradientUnits", "userSpaceOnUse")
                // TODO: Can I add this to the data
                .attr("x0", 200 * Math.cos(d.source.startAngle) ) // source start
                .attr("y0",  200 * Math.cos(d.target.endAngle)) //target end
                .attr("x1",   200 * Math.sin(d.source.startAngle))
                .attr("y1",   200 * Math.sin(d.target.endAngle))
                .selectAll("stop")
                .data([
                    {offset: "0%", color: memberColors[d.source.membername]}, // TODO: Add degree and opacity
                    {offset: "100%", color: "black"}
                ])
                .enter().append("stop")
               .attr("offset", function(d) { return d.offset; })
                .attr("stop-color", function(d) { return d.color; });
                return `url(#line-gradient-${d.source.index})` 
            }
           
    }
 
    render (){
        return (null)
    }
}

export default Chord;