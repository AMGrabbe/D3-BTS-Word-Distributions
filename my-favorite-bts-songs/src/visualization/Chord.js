/* eslint-disable react/prop-types */
import React, { Component } from "react";
import * as ch from "./new_chord";
import * as rib from "./new_ribbons";
import * as d3 from "d3";
import "../fonts.css";

var _ = require("lodash");

class Chord extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.chord = d3
      .select(".diagram")
      .append("svg")
      .attr("height", 1000)
      .attr("width", 1000)
      .append("g")
      .attr("transform", "translate(500, 500)");
  }

  async componentDidUpdate() {
    this.drawChord();
  }

  drawChord() {
    const { data } = this.props;
    const names = ["RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "Junkook"];
    const colors = [
      "#162D59",
      "#E99FBD",
      "#B4B8BF",
      "#F20505",
      "#D9AA1E",
      "#05A66B",
      "#B430D9",
    ];
    const memberColors = _.zipObject(names, colors);

    const test = ch.new_chord().padAngle(0.05)(data.Sequence);

    const sData = d3.groups(test, (d) => d.source.isStart).keys();

    const start = _.filter(test, (el) => {
      return el.source.isStart === true;
    });

    const textData = _.map(data.Sequence, "Lines");

    console.log(textData);
    console.log(start);

    const groups = this.chord
      .datum(test)
      .append("g")
      .selectAll("g")
      .data((d) => d.groups)
      .enter();

    // Add test field with test text
    // TODO: give class to element intead grabbing the first g element
    this.chord
      .select("g")
      .append("text")
      .attr("class", "songtext")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("font-family", "Cute Font")
      .attr("font-size", "90px")
      .attr("x", 0)
      .attr("y", 0)
      .text(() => displayText(0.2)); // TODO: Add event: if somethign happens (right timing has come) set text to next line

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
    //console.log(ribbons);

    //.append("foreignObject")
    //.attr("width", 1000)
    //.attr("height", 1000)
    function createConicalGradtient(d) {
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
        console.log(t);
        return t;
      });
    }

    function displayText(timeStamp) {
      console.log(textData);
      for (let element of textData) {
        for (let line of element) {
          if (timeStamp >= line.Start && timeStamp <= line.End) {
            return line.Text;
          }
        }
      }
    }

    function calculateGradient(d) {
      // TODO: store in data
      var ang = calcRad(
        d.source.startAngle - Math.PI / 2,
        d.target.startAngle - Math.PI / 2
      );
      console.log(ang);
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
