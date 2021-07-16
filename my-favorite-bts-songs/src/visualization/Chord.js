import React, {Component} from "react";
import * as ch from "./new_chord";
import * as d3 from "d3";


const memberColors = {
    enter: "#FF665A",
    update: "#7D6B7D",
    exit: "#FF8C64"
}


class Chord extends Component {
    constructor(props)
    {
        super(props);
    }   

    async componentDidMount(){
        
        this.chord = d3.select(".diagram").append('svg')
        .attr('height', 500)
        .attr('width', 500)
        .append("g")
        .attr('transform', "translate( 250, 250)")
       
        
    }

    async componentDidUpdate(){
        this.drawChord();
    }
    
    drawChord(){
        const {data} = this.props;

        /*const res = ch.chord(false,false)
        .padAngle(0.05)    // padding between entities (black arc)
        (data.WordsSep)*/

        console.log(data.Sequence)
        
        const test = ch.new_chord()
        (data.Sequence)  // padding between entities (black arc)
        

        console.log(test)

        this.chord
        .datum(test)
        .append("g")
        .selectAll("g")
        .data(d => {
            console.log(d)
            return d.groups;

        }
            )
        .join("g")
        .append("path")
            .style("fill", "grey")
            .style("stroke", "black")
            .attr("d", d3.arc()
            .innerRadius(200)
            .outerRadius(210)
            )

            var colors = [ "red", "black", "green", "yellow", "violet", "pink", "blue"];

            this.chord
            .datum(test)
            .append("g")
            .selectAll("path")
            .data(d => d)
            .join("path")
            .style("fill", function(d, i){ return colors[i] })
              .attr("d", d3.ribbon()
                .radius(200)
              )
              .style("stroke", "black")
              .style('opacity', 0.3);

              console.log(this.chord)
    }
 
    render (){
        return (null)
    }
}

export default Chord;