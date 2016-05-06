$(function() {
    
  var map = $(".duckmap")[0];
  var ctx = map.getContext("2d");
  ctx.moveTo(0,0);
  ctx.lineTo(200,100);
  ctx.stroke();
    
})