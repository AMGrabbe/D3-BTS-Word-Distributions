/*Based on the d3v6 d3.chord() function by Mike Bostock
** Adjusted by Anne-Marie Grabbe - July 2021 */
import {path} from "d3-path";
import {slice} from "./array.js";
import constant from "./constant.js";

var abs = Math.abs;
var cos = Math.cos;
var sin = Math.sin;
var pi = Math.PI;
var halfPi = pi / 2;
var epsilon = 1e-12;

function defaultSource(d) {
  return d.source;
}

function defaultTarget(d) {
  return d.target;
}

function defaultRadius(d) {
  return d.radius;
}

function defaultStartAngle(d) {
  return d.startAngle;
}

function defaultEndAngle(d) {
  return d.endAngle;
}

function defaultPadAngle() {
  return 0;
}

function defaultArrowheadRadius() {
  return 10;
}

export function ribbon(headRadius) {
  var source = defaultSource,
      target = defaultTarget,
      sourceRadius = defaultRadius,
      targetRadius = defaultRadius,
      startAngle = defaultStartAngle,
      endAngle = defaultEndAngle,
      padAngle = defaultPadAngle,
      context = null;

  function ribbon() {
    var buffer,
        s = source.apply(this, arguments),
        t = target.apply(this, arguments),
        ap = padAngle.apply(this, arguments) / 2,
        argv = slice.call(arguments),
        sr = +sourceRadius.apply(this, (argv[0] = s, argv)),
        sa0 = startAngle.apply(this, argv) - halfPi,
        sa1 = endAngle.apply(this, argv) - halfPi,
        tr = +targetRadius.apply(this, (argv[0] = t, argv)),
        ta0 = startAngle.apply(this, argv) - halfPi,
        ta1 = endAngle.apply(this, argv) - halfPi,
        sweepflag = 1;
      

    if (!context) context = buffer = path();

  /*  if (ap > epsilon) {
      if (abs(sa1 - sa0) > ap * 2 + epsilon) sa1 > sa0 ? (sa0 += ap, sa1 -= ap) : (sa0 -= ap, sa1 += ap);
      else sa0 = sa1 = (sa0 + sa1) / 2;
      if (abs(ta1 - ta0) > ap * 2 + epsilon) ta1 > ta0 ? (ta0 += ap, ta1 -= ap) : (ta0 -= ap, ta1 += ap);
      else ta0 = ta1 = (ta0 + ta1) / 2;
    }*/

    context.moveTo(sr * cos(sa0), sr * sin(sa0));
    context.arc(0, 0, sr, sa0, sa1); // base bow to sa1
    if (sa0 !== ta0 || sa1 !== ta1) {
        // Calculate radius eqqual to distance between points
        var a = sr * cos(sa1) - sr * cos(ta0);
        var b = sr * sin(sa1) - sr * sin(ta0);
        var rad = Math.sqrt(a*a + b*b);
        
        var da = (sa1 - ta0)/ Math.PI;
        if( (da > -1 && da <= 0) || (da > 1 && da <= 2) )
          sweepflag = 1;
        else
          sweepflag = 0;
        context._ += "A" + rad + ","+ rad +",0,1," + sweepflag + "," + tr*cos(ta0) +"," +  tr*sin(ta0)
        context.arc(0, 0, tr, ta0, ta1);
    }
    var a = sr * cos(ta1) - sr * cos(sa0);
        var b = sr * sin(ta1) - sr * sin(sa0);
        var rad = Math.sqrt(a*a + b*b);
    var da = (sa0 - ta1)/Math.PI;
    sweepflag = Math.abs(sweepflag -1);
    context._ += "A" + Math.abs(rad)  + ","+ Math.abs(rad) +",0,1," + sweepflag + "," + sr*cos(sa0) +"," +  sr*sin(sa0)
    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  if (headRadius) ribbon.headRadius = function(_) {
    return arguments.length ? (headRadius = typeof _ === "function" ? _ : constant(+_), ribbon) : headRadius;
  };

  ribbon.radius = function(_) {
    return arguments.length ? (sourceRadius = targetRadius = typeof _ === "function" ? _ : constant(+_), ribbon) : sourceRadius;
  };

  ribbon.sourceRadius = function(_) {
    return arguments.length ? (sourceRadius = typeof _ === "function" ? _ : constant(+_), ribbon) : sourceRadius;
  };

  ribbon.targetRadius = function(_) {
    return arguments.length ? (targetRadius = typeof _ === "function" ? _ : constant(+_), ribbon) : targetRadius;
  };

  ribbon.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), ribbon) : startAngle;
  };

  ribbon.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), ribbon) : endAngle;
  };

  ribbon.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), ribbon) : padAngle;
  };

  ribbon.source = function(_) {
    return arguments.length ? (source = _, ribbon) : source;
  };

  ribbon.target = function(_) {
    return arguments.length ? (target = _, ribbon) : target;
  };

  ribbon.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), ribbon) : context;
  };

  return ribbon;
}

export default function() {
  return ribbon();
}

export function ribbonArrow() {
  return ribbon(defaultArrowheadRadius);
}