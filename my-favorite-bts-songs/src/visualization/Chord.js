import React, {Component} from "react";
import * as d3 from "d3";


const memberColors = {
    enter: "#FF665A",
    update: "#7D6B7D",
    exit: "#FF8C64"
}


class Chord extends Component {
       
    componentDidMount(){
        
        this.chord = d3.select(".diagram").append('svg')
        .attr('height', 500)
        .attr('width', 500)
        .append("g")
        .attr('transform', "translate( 250, 250)")
        
        this.drawChord()
    }

    drawChord(){
        const {data} = this.props;
       // console.log(matrix.length)

        const matrix = [
            [51, 0, 0, 0, 0, 0, 0],
            [27, 0, 0, 0, 0, 0, 0],
            [58, 0, 0, 0, 0, 0, 0],
            [92, 0, 0, 0, 0, 0, 0],
            [25, 0, 0, 0, 0, 0, 0],
            [59, 0, 0, 0, 0, 0, 0],
            [76, 0, 0, 0, 0, 0, 0]
        ];
        const res = d3.chord()
            .padAngle(0.05)     // padding between entities (black arc)
            .sortSubgroups(d3.descending)
            (matrix)

        console.log(res)

        this.chord
          .datum(res)
          .append("g")
          .selectAll("g")
          .data(d => d.groups)
          .join("g")
          .append("path")
            .style("fill", "grey")
            .style("stroke", "black")
            .attr("d", d3.arc()
              .innerRadius(200)
              .outerRadius(210)
            )
    }

    render (){
        return (null)
    }
}

export default Chord;