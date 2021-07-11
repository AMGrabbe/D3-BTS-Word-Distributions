/*Based on the d3v6 d3.chord() function by Mike Bostock
** Adjusted by Anne-Marie Grabbe - July 2021 */
import * as d3 from "d3";

const halfPi = Math.PI / 2;
const tau = Math.PI * 2;
const max = Math.max;

function range(i, j) {
  return Array.from({length: j - i}, (_, k) => i + k);
}

function compareValue(compare) {
  return function(a, b) {
    return compare(
      a.source.value + a.target.value,
      b.source.value + b.target.value
    );
  };
}

export function new_chord(){
  var padAngle = 0,
    sortGroups = null,
    sortSubgroups = null,
    sortChords = null,
    oterValues = []
    
    function new_chord(d)
    {
        // calculate outer ringfrom grouped sequence
        const sequence = d;
        const data = d3.group(d, d => d.Name);

        var n = sequence.length,
          groupSums = [], // how many singing parts
          groupIndex = Array.from(data.keys()),
          chords = new Array(sequence.length),
          groups = new Array(3),
          subgroups,
          k = 0, dx;
          //subgrouos, subgroupindex, numsubgroupt if two people sing one line
          
          // TODO: iterate map
          data.forEach( el => {
             let x = el.length,
              sum = 0;
              for (let j = 0; j < x; j++){
              console.log(el[j].Words);
              sum += el[j].Words;
              } 
            groupSums.push(sum);
            k += sum;
          })

        k = max(0, tau - padAngle * 3) / k;
        dx = k ? padAngle : tau / 3;

         { //loop sequence and define target ans source
          let x = 0;
          for (let i = 0; i < n; i++){
            let x0 = x;
            console.log(groupIndex.findIndex(el => el === sequence[i].Name));

              var index = groupIndex.findIndex(el => el === sequence[i].Name);
              console.log(groupSums);
              //groupName = sequence[index].key // member name
              let chord = chords[i] = {source : null, target : null};
              chord.source = {
                index: index, 
                //groupindex: index,
                startAngle: x, //angle will maybe depend on group indexes?
                endAngle: x += matrix[i * n + j] * k, 
                value: sequence.Words};
              chord.target = {index: i + 1 ,
                //groupIndex: groupIndex[i+1],
                startAngle: x, 
                endAngle: x += matrix[i * n + j] * k,
                value: sequence[i +1]};
           
            groups[index] = {
                index: index,
                startAngle: x0,
                endAngle: x,
                value: groupSums[index],
                //groupname: groupname
            }
            x +=dx
          
          }
            
          }
              chords = Object.values(chords);
              chords.groups = groups;
              return  chords;
          
        }
    new_chord.padAngle = function(_) {
      return arguments.length ? (padAngle = max(0, _), chord) : padAngle;
    };
  
    return new_chord;   
}


 export function chord(directed, transpose) {
  var padAngle = 0,
      sortGroups = null,
      sortSubgroups = null,
      sortChords = null;

  function chord(matrix) {
    var n = matrix.length,
        groupSums = new Array(n),
        groupIndex = range(0, n),
        chords = new Array(n * n),
        groups = new Array(n),
        k = 0, dx;

    matrix = Float64Array.from({length: n * n}, transpose
        ? (_, i) => matrix[i % n][i / n | 0]
        : (_, i) => matrix[i / n | 0][i % n]);

    // Compute the scaling factor from value to angle in [0, 2pi].
    for (let i = 0; i < n; ++i) {
      let x = 0;
      for (let j = 0; j < n; ++j) x += matrix[i * n + j] + directed * matrix[j * n + i];
      k += groupSums[i] = x;
    }
    k = max(0, tau - padAngle * n) / k;
    dx = k ? padAngle : tau / n;

    // Compute the angles for each group and constituent chord.
    {
      let x = 0;
      if (sortGroups) groupIndex.sort((a, b) => sortGroups(groupSums[a], groupSums[b]));
      for (const i of groupIndex) {
        const x0 = x;
        if (directed) {
          const subgroupIndex = range(~n + 1, n).filter(j => j < 0 ? matrix[~j * n + i] : matrix[i * n + j]);
          if (sortSubgroups) subgroupIndex.sort((a, b) => sortSubgroups(a < 0 ? -matrix[~a * n + i] : matrix[i * n + a], b < 0 ? -matrix[~b * n + i] : matrix[i * n + b]));
          for (const j of subgroupIndex) {
            if (j < 0) {
              const chord = chords[~j * n + i] || (chords[~j * n + i] = {source: null, target: null});
              chord.target = {index: i, startAngle: x, endAngle: x += matrix[~j * n + i] * k, value: matrix[~j * n + i]};
            } else {
              const chord = chords[i * n + j] || (chords[i * n + j] = {source: null, target: null});
              chord.source = {index: i, startAngle: x, endAngle: x += matrix[i * n + j] * k, value: matrix[i * n + j]};
            }
          }
          groups[i] = {index: i, startAngle: x0, endAngle: x, value: groupSums[i]};
        } else {
          const subgroupIndex = range(0, n).filter(j => matrix[i * n + j] || matrix[j * n + i]);
          if (sortSubgroups) subgroupIndex.sort((a, b) => sortSubgroups(matrix[i * n + a], matrix[i * n + b]));
          for (const j of subgroupIndex) {
            let chord;
            if (i < j) {
              chord = chords[i * n + j] || (chords[i * n + j] = {source: null, target: null});
              chord.source = {index: i, startAngle: x, endAngle: x += matrix[i * n + j] * k, value: matrix[i * n + j]};
            } else {
              chord = chords[j * n + i] || (chords[j * n + i] = {source: null, target: null});
              chord.target = {index: i, startAngle: x, endAngle: x += matrix[i * n + j] * k, value: matrix[i * n + j]};
              if (i === j) chord.source = chord.target;
            }
            if (chord.source && chord.target && chord.source.value < chord.target.value) {
              const source = chord.source;
              chord.source = chord.target;
              chord.target = source;
            }
          }
          groups[i] = {index: i, startAngle: x0, endAngle: x, value: groupSums[i]};
        }
        x += dx;
      }
    }

    // Remove empty chords.
    chords = Object.values(chords);
    chords.groups = groups;
    return sortChords ? chords.sort(sortChords) : chords;
  }

  chord.padAngle = function(_) {
    return arguments.length ? (padAngle = max(0, _), chord) : padAngle;
  };

  chord.sortGroups = function(_) {
    return arguments.length ? (sortGroups = _, chord) : sortGroups;
  };

  chord.sortSubgroups = function(_) {
    return arguments.length ? (sortSubgroups = _, chord) : sortSubgroups;
  };

  chord.sortChords = function(_) {
    return arguments.length ? (_ == null ? sortChords = null : (sortChords = compareValue(_))._ = _, chord) : sortChords && sortChords._;
  };

  return chord;
}
