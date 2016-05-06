var DuckMap = function(cfg) {
    this.canvas = cfg.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.vertex_buffer = cfg.buffer; 
    this.polygons = cfg.polygons;
    this.dataset = cfg.dataset;
    this.key = cfg.key;
}

DuckMap.prototype = {
    
    "redraw": function() {
        for (var shapename in this.polygons) {
            var shape = this.polygons[shapename];
            this.ctx.fillStyle = this.key[this.dataset[shapename]];
            console.log(shapename, this.dataset[shapename], this.key[this.dataset[shapename]]);
            this.ctx.beginPath();
            this.ctx.moveTo(this.vertex_buffer[shape[0]], this.vertex_buffer[shape[0] + 1]);
            for (var i = 1; i < shape.length; i++) {
                this.ctx.lineTo(this.vertex_buffer[shape[i]], this.vertex_buffer[shape[i] + 1]);
            }
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.fill()
        }
    }
    
}