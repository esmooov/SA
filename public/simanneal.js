SA = {}
SA.datareal = [[3, 2, 3, 4, 3, 2, 4, 2, 2, 1], [1, 2, 3, 4, 2, 2, 3, 2, 2, 1], [3, 3, 4, 2, 4, 4, 4, 2, 2, 4], [2, 3, 2, 4, 4, 1, 4, 4, 4, 1], [3, 4, 2, 3, 3, 4, 3, 4, 3, 3], [3, 2, 4, 2, 2, 1, 3, 4, 3, 4], [4, 4, 2, 1, 1, 1, 4, 3, 4, 1], [3, 4, 2, 4, 1, 3, 2, 3, 4, 3], [3, 1, 1, 2, 4, 4, 2, 3, 1, 3], [4, 1, 2, 3, 3, 2, 3, 2, 4, 1]]
SA.datatest = [[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3],[4,4,4,4,4,4,4,4,4,4],[4,4,4,4,4,4,4,4,4,4],[4,4,4,4,4,4,4,4,4,4]]
SA.twodeepCopy = function(arr){
  var onedeep = _(arr).map(function(r){return r.slice();});
  return onedeep.slice();
}
SA.friends = function(data,cell,ridx,cidx){
  var l = cidx > 0 ? data[ridx][cidx-1] : 0,
      r = cidx < 9 ? data[ridx][cidx+1] : 0,
      t = ridx > 0 ? data[ridx-1][cidx] : 0,
      b = ridx < 9 ? data[ridx+1][cidx] : 0,
      ans = _([l,r,t,b]).reduce(function(memo,val){
        var newmemo = memo;
        if (val === cell){newmemo[0] += 1} else if (val !== 0) {newmemo[1] += 1}
        return newmemo;
      },[0,0])
      return (ans[0] > 0 ? ans[0]*-1 : ans[1]);
}

SA.scoreGen = function(data){
  var ev_data = _(data).map(function(row,ridx){
    return _(row).map(function(cell,cidx){
      return SA.friends(data,cell,ridx,cidx)
    })
  });
  var total = _(ev_data).reduce(function(rmem,row){
    return _(row).reduce(function(cmem,cell){
      return cmem+cell;
    },0) + rmem
  },0);
  return total;
}

SA.randCells = function(){
  var rowindexa = Math.floor(Math.random()*10),
      colindexa = Math.floor(Math.random()*10);
      rowindexb = Math.floor(Math.random()*10),
      colindexb = Math.floor(Math.random()*10);
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

SA.anneal = function(){
  var temp = 4,
      i = 0,
      oldscore = SA.scoreGen(SA.datareal),
      states = [],
      rule,p,candp,candidate,score,theta,state;
  while(temp > .7){
    rule = SA.randCells();
    p = Math.random();
    candidate = SA.exchangeCells(SA.datareal,rule);
    score = SA.scoreGen(candidate);
    theta = oldscore - score;
    candp = 1/(1+(Math.pow(Math.E,-1*(theta/temp))));
    if (candp > p) {
      SA.datareal = candidate;
      oldscore = score;
      state = SA.twodeepCopy(SA.datareal);
      states.push(state);
    }
    temp = temp * Math.pow(Math.E,-.0002);
    i++;
  }
  return states;
}

SA.palette = {1: "red",
              2: "blue",
              3: "yellow",
              4: "white"
              }

SA.drawState = function(data){
  var canvas = document.getElementById("canvas"),
      c = canvas.getContext("2d");
  for (i = 0; i < 10; i++){
    for (j = 0; j < 10; j++){
      var cell = data[i][j];
      c.fillStyle = SA.palette[cell];
      c.fillRect(i*40,j*40,40,40);
    }
  }
}
$(function(){
  $('#canvas').click(function(){
    a = SA.anneal();
    SA.i = setInterval(function(){var s = a.shift(); SA.drawState(s); if (a.length === 0){clearInterval(SA.i)}},1000/240);
  });
});
