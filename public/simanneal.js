SA = {}
SA.data = [[3, 2, 3, 4, 3, 2, 4, 2, 2, 1], [1, 2, 3, 4, 2, 2, 3, 2, 2, 1], [3, 3, 4, 2, 4, 4, 4, 2, 2, 4], [2, 3, 2, 4, 4, 1, 4, 4, 4, 1], [3, 4, 2, 3, 3, 4, 3, 4, 3, 3], [3, 2, 4, 2, 2, 1, 3, 4, 3, 4], [4, 4, 2, 1, 1, 1, 4, 3, 4, 1], [3, 4, 2, 4, 1, 3, 2, 3, 4, 3], [3, 1, 1, 2, 4, 4, 2, 3, 1, 3], [4, 1, 2, 3, 3, 2, 3, 2, 4, 1]]
SA.datatest = [[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3],[4,4,4,4,4,4,4,4,4,4],[4,4,4,4,4,4,4,4,4,4],[4,4,4,4,4,4,4,4,4,4]]
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
