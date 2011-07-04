SA = {}
SA.datareal = [[3, 2, 3, 1, 3, 2, 4, 1, 2, 1], [1, 2, 3, 4, 2, 2, 3, 2, 2, 1], [3, 3, 4, 2, 4, 1, 4, 2, 2, 4], [2, 3, 2, 1, 4, 1, 4, 4, 4, 1], [3, 4, 2, 3, 3, 4, 3, 4, 3, 3], [3, 2, 4, 2, 2, 1, 3, 4, 3, 4], [1, 4, 2, 1, 1, 1, 4, 3, 4, 1], [1, 4, 2, 4, 1, 3, 2, 3, 4, 3], [3, 1, 1, 2, 4, 4, 2, 3, 1, 3], [4, 1, 2, 3, 1, 2, 3, 2, 4, 1]]

SA.datareala = (function(){
  var output = [];
  for (i = 0; i < 10; i++){
    for (j = 0; j < 10; j++){
      if (_.isUndefined(output[i])) {output[i] = []}
      output[i][j] = Math.floor(Math.random() * 4+1);
    }
  }
  return output;
})();

SA.datatest = [[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3],[4,4,4,4,4,4,4,4,4,4],[4,4,4,4,4,4,4,4,4,4],[4,4,4,4,4,4,4,4,4,4]]
SA.twodeepCopy = function(arr){
  var onedeep = _(arr).map(function(r){return r.slice();});
  return onedeep.slice();
}
SA.friends = function(data,memo,cell,ridx,cidx){
  var l = cidx > 0 ? data[ridx][cidx-1] : 0,
      r = cidx < 9 ? data[ridx][cidx+1] : 0,
      t = ridx > 0 ? data[ridx-1][cidx] : 0,
      b = ridx < 9 ? data[ridx+1][cidx] : 0,
      lm = cidx > 0 ? memo[ridx][cidx-1] : 0,
      tm = ridx > 0 ? memo[ridx-1][cidx] : 0,
      score = _([[l,lm],[r,0],[t,tm],[b,0]]).reduce(function(m,val){
        if(val[0] == cell){
          return m+val[1]+1;
        } else {
          return m;
        } 
      },0);
      if (_.isUndefined(memo[ridx])){
        memo[ridx] = [];
      }
      memo[ridx][cidx] = score;
      return score;
}

SA.countBlocks = function(data){
  SA.touching = 0;
  var countdata = _(data).map(function(row,ri){
    return _(row).map(function(cell,ci){
      return [cell,ri,ci,false]
    })
  }),
    end = false,
    blocks = 0,
    score = 0;
  while(! end){
    result = SA.trace(countdata);
    score = result[1]*(-0.125)+4.125;
    blocks = blocks + score;
    end = result[0];
  }
  return blocks-1 - (3*SA.touching);
}

SA.touching = 0;

SA.trace = function(data){
  var row = _(data).detect(function(r){return _(r).detect(function(c){return ! c[3];})}),
      counter = 0,
      cell,
      moveMark = function(c){
        var l = c[2] > 0 ? data[c[1]][c[2]-1] : [-1,-1,-1,true],
            r = c[2] < 9 ? data[c[1]][c[2]+1] : [-1,-1,-1,true],
            t = c[1] > 0 ? data[c[1]-1][c[2]] : [-1,-1,-1,true],
            b = c[1] < 9 ? data[c[1]+1][c[2]] : [-1,-1,-1,true];
            c[3] = true;
            _([l,r,t,b]).each(function(n){
              if (n[0] === c[0]){ 
                SA.touching++;
                if(! n[3]){ 
                  counter++; moveMark(n) 
                }
              }
            });
      };
      if (row){
        cell = _(row).detect(function(c){return ! c[3];});
        moveMark(cell);
        return [false,counter];
      } else {
        return [true,counter];
      }
}

SA.scoreGen = function(data){
  SA.memo = []
  var ev_data = _(data).map(function(row,ridx){
    return _(row).map(function(cell,cidx){
      return SA.friends(data,SA.memo,cell,ridx,cidx)
    })
  });
  var total = _(ev_data).reduce(function(rmem,row){
    return _(row).reduce(function(cmem,cell){
      return cmem+cell;
    },0) + rmem
  },0);
  return total;
}

SA.randCells = function(data){
  var l = data.length;
      rowindexa = Math.floor(Math.random()*l),
      colindexa = Math.floor(Math.random()*l);
      rowindexb = Math.floor(Math.random()*l),
      colindexb = Math.floor(Math.random()*l);
  return [rowindexa,colindexa,rowindexb,colindexb];
}

SA.exchangeCells = function(data,rule){
  var cella = data[rule[0]][rule[1]],
      cellb = data[rule[2]][rule[3]],
      newdata = SA.twodeepCopy(data);
  newdata[rule[0]][rule[1]] = cellb;
  newdata[rule[2]][rule[3]] = cella;
  return newdata;
}

SA.anneal = function(data){
  var temp = 35,
      i = 0,
      oldscore = SA.scoreGen(data),
      states = [],
      rule,p,candp,candidate,score,theta,state;
  while(temp > 7){
    rule = SA.randCells(data);
    p = Math.random();
    candidate = SA.exchangeCells(data,rule);
    score = SA.scoreGen(candidate);
    theta = score - oldscore;
    candp = 1/(1+(Math.pow(Math.E,-1*(theta/temp))));
    if (candp > p) {
      data = candidate;
      oldscore = score;
      state = SA.twodeepCopy(data);
      states.push(state);
    }
    temp = temp * Math.pow(Math.E,-.0004);
    i++;
  }
  return states;
}

SA.anneala = function(data){
  var temp = 4,
      i = 0,
      oldscore = SA.countBlocks(data),
      states = [],
      rule,p,candp,candidate,score,theta,state;
  while(oldscore > -850){
    rule = SA.randCells(data);
    p = Math.random();
    candidate = SA.exchangeCells(data,rule);
    score = SA.countBlocks(candidate);
    theta = oldscore-score;
    candp = 1/(1+(Math.pow(Math.E,-1*(theta/temp))));
    if (candp > p) {
      data = candidate;
      oldscore = score;
      state = SA.twodeepCopy(data);
      states.push(state);
    }
    temp = temp * Math.pow(Math.E,-.01);
    i++;
    if (i > 40000) {return SA.anneala(SA.datareal);}
  }
  SA.generations = i; 
  return states;
}

SA.palette = {1: "red",
              2: "blue",
              3: "yellow",
              4: "white"
              }

SA.drawState = function(data){
  var canvas = document.getElementById("canvas"),
      c = canvas.getContext("2d"),
      len = data[0].length,
      size = 600/len;
  for (i = 0; i < len; i++){
    for (j = 0; j < len; j++){
      var cell = data[i][j];
      c.fillStyle = SA.palette[cell];
      c.fillRect(i*size,j*size,size,size);
    }
  }
}
$(function(){
  SA.drawState(SA.datareal);
  $('#start').click(function(){
    $('#loading').show();
    setTimeout(function(){
    a = SA.anneala(SA.datareala);
    $('#gens').html(SA.generations);
    $('#loading').hide();
    SA.i = setInterval(function(){var s = a.shift(); SA.drawState(s); if (a.length === 0){clearInterval(SA.i)}},1000/240);
    },100);
  });
});
