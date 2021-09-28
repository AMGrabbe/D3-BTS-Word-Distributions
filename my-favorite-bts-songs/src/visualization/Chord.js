/* eslint-disable react/prop-types */
import React, { Component } from "react";
import * as ch from "./new_chord";
import * as rib from "./new_ribbons";
import * as d3 from "d3";
import "../fonts.css";
import { indexOf } from "lodash";

let _ = require("lodash");
// TODO: Store radius in variable
let textFielddimension = (100 * Math.cos(Math.PI/4))-(100 * Math.cos(3*Math.PI/4))
let currentSingerIndex = 0;
let names = ["RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "Junkook"];
let colors = [
      "#162D59",
      "#E99FBD",
      "#B4B8BF",
      "#F20505",
      "#D9AA1E",
      "#05A66B",
      "#B430D9",
    ];
let memberColors = _.zipObject(names, colors);

class Chord extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.svg = d3
      .select(".diagram")
      .append("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("height", 1000)
      .attr("width", 1000);

    this.chord = this.svg.append("g")
      .attr("transform", "translate(500, 500)");
  }

  displayText(timeStamp, textData) {
    for (let [index, element] of textData.entries()) {
      for (let line of element) {
        if (timeStamp >= line.Start && timeStamp <= line.End) {
          currentSingerIndex = index;
          return line.Text;
        }
      }
    }
  }

  async componentDidUpdate(nextProps) {
    if (this.props.data !== nextProps.data) this.drawChord();

    let sequence = this.props.data.Sequence
    if (this.props.value !== nextProps.value) {
      const textData = _.map(sequence, "Lines");
      d3.select(".songtext")
        .style("color", memberColors[sequence[currentSingerIndex].Name])
        .html(() => this.displayText(this.props.value, textData));
        
    }
  }

  drawChord() {
    const { data } = this.props;
    const test = ch.new_chord().padAngle(0.05)(data.Sequence);
    const start = _.filter(test, (el) => {
      return el.source.isStart === true;
    });
    const groups = this.chord
      .datum(test)
      .append("g")
      .selectAll("g")
      .data((d) => d.groups)
      .enter();

    

    this.svg
      .append('foreignObject')
      .attr("width", textFielddimension)
      .attr("height",textFielddimension)
      .attr("x", 500 - (100 * Math.cos(Math.PI/4)))
      .attr("y", 500 - (100 * Math.sin(Math.PI/4)))
      .attr("font-family", "Cute Font")
      .attr("font-size", `${textFielddimension/4}px`)
      .attr("requiredExtensions","http://www.w3.org/1999/xhtml")
      .append("xhtml:div")
      .attr("xmlns","http://www.w3.org/1999/xhtml")
      .attr("x", 0)
      .attr("y", 0)
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "center")
      .append("xhtml:div")
      .attr("xmlns","http://www.w3.org/1999/xhtml")
      .style("height", `${textFielddimension}px`)
      .style("display", "flex")
      .style("align-items", "center")
      .append("xhtml:div")
      .attr("class", "songtext")
      .style("justify-content", "center")
      .style("word-break", "keep-all");
    
    groups
      .append("g")
      .append("path")
      .style("fill", (d, i) => memberColors[d.membername])
      .attr("d", d3.arc().innerRadius(100).outerRadius(110));

    // TODO: return subgroups in an array
    const subgroups = this.chord.datum(test).append("g");

    const ribbons = subgroups
      .selectAll("g")
      .data((d) => d)
      .join("g");

    ribbons
      .append("g")
      //.append("clipPath")
      .attr("id", (d) => `clip${d.source.index}`)
      .append("path")
      //.style("fill", (d, i) =>memberColors[d.source.membername])
      .attr("d", rib.ribbon().radius(115).padAngle(0.1))
      // .call((d) => createConicalGradtient(d));
      .attr("fill", (d) => calculateGradient(d));
    //.style('opacity', 0.3);

    //.append("foreignObject")
    //.attr("width", 1000)
    //.attr("height", 1000)
    function createConicalGradient(d) {
      d3.select("svg")
        .append("image")
        .attr("href", "chord.jpg")
        //.attr("background-color", "yellow")
        .attr("width", 1000)
        .attr("height", 1000)
        .attr("clip-path", `url(#clip${0})`);
    }

    let outside = this.chord.data(start).append("g");

    outside
      .selectAll("g")
      .data((d) => groupTicks(d.source)) // Controls the number of ticks: one tick each 25 here.
      .join("g")
      .attr(
        "transform",
        (d) => `rotate(${(d.angle * 180) / Math.PI - 90}) translate(220, 0)`
      )
      .append("circle")
      .attr("r", 5)
      .attr("fill", "orange");

    function groupTicks(d) {
      return d3.range(0, d.value, 100).map(function (value) {
        let t = {
          value: value,
          angle: d.endAngle / 2,
        };
        return t;
      });
    }

    function calculateGradient(d) {
      // TODO: store in data
      var ang = calcRad(
        d.source.startAngle - Math.PI / 2,
        d.target.startAngle - Math.PI / 2
      );
      d3.select("svg")
        .append("radialGradient")
        .attr("id", `line-gradient-${d.source.index}`)
        .attr("gradientUnits", "userSpaceOnUse")
        // TODO: Can I add this to the data
        .attr("cx", ang * Math.cos(d.source.endAngle - Math.PI / 2))
        .attr("cy", ang * Math.sin(d.source.endAngle - Math.PI / 2))
        .attr("r", ang)
        .selectAll("stop")
        .data([
          {
            offset: "0%",
            color: memberColors[d.source.membername],
            opacity: 1,
          },
          {
            offset: "100%",
            color: memberColors[d.source.membername],
            opacity: 0.1,
          },
        ])
        .enter()
        .append("stop")
        .attr("offset", function (d) {
          return d.offset;
        })
        .attr("stop-color", function (d) {
          return d.color;
        })
        .attr("stop-opacity", function (d) {
          return d.opacity;
        });
      return `url(#line-gradient-${d.source.index})`;
    }
    function calcRad(sa0, ta1) {
      var a = 110 * Math.cos(ta1) - 110 * Math.cos(sa0);
      var b = 110 * Math.sin(ta1) - 110 * Math.sin(sa0);
      return Math.sqrt(a * a + b * b);
    }
  }

  render() {
    return null;
  }
}

export default Chord;
