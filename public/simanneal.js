SA = {}
SA.datareal = [[3, 2, 3, 4, 3, 2, 4, 2, 2, 1], [1, 2, 3, 4, 2, 2, 3, 2, 2, 1], [3, 3, 4, 2, 4, 4, 4, 2, 2, 4], [2, 3, 2, 4, 4, 1, 4, 4, 4, 1], [3, 4, 2, 3, 3, 4, 3, 4, 3, 3], [3, 2, 4, 2, 2, 1, 3, 4, 3, 4], [4, 4, 2, 1, 1, 1, 4, 3, 4, 1], [3, 4, 2, 4, 1, 3, 2, 3, 4, 3], [3, 1, 1, 2, 4, 4, 2, 3, 1, 3], [4, 1, 2, 3, 3, 2, 3, 2, 4, 1]]
SA.datatest = [[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3],[4,4,4,4,4,4,4,4,4,4],[4,4,4,4,4,4,4,4,4,4],[4,4,4,4,4,4,4,4,4,4]]
SA.twodeepCopy = function(arr){
  var onedeep = _(arr).map(function(r){return r.slice();});
  return onedeep.slice();
}
SA.friends = function(data,cell,ridx,cidx){
  var l = cidx > 0 ? data[ridx][cidx-1] : cell,
      r = cidx < 9 ? data[ridx][cidx+1] : cell,
      t = ridx > 0 ? data[ridx-1][cidx] : cell,
      b = ridx < 9 ? data[ridx+1][cidx] : cell,
      ans = _([l,r,t,b]).filter(function(c){return c !== cell}).length;
      return (ans < 2 ? 0 : ans);
}

SA.sumArray = function(arr){
  return _(arr).reduce(function(i,m){return i+m},0);
}

SA.scoreGen = function(data){
  var ev_data = _(data).map(function(row,ridx){
    return _(row).map(function(cell,cidx){
      return SA.friends(data,cell,ridx,cidx)
    })
  });
  var total = _(ev_data).map(function(r,m){
    var rowsum;
    rowsum = SA.sumArray(r);
    return rowsum;
  },0);
  return SA.sumArray(total);
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
  var temp = 40,
      i = 0,
      oldscore = SA.scoreGen(SA.datareal),
      rule,p,candp,candidate,score,theta;
  while(temp > 8){
    rule = SA.randCells();
    p = Math.random();
    candidate = SA.exchangeCells(SA.datareal,rule);
    score = SA.scoreGen(candidate);
    theta = oldscore - score;
    candp = 1/(1+(Math.pow(Math.E,-1*(theta/temp))));
    if (candp > p) {
      SA.datareal = candidate;
    }
    temp = temp * Math.pow(Math.E,-.0001);
    oldscore = score;
    i++;
  }
  return i;
}
