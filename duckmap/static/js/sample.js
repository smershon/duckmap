$(function() {

    var buffer = [10.0, 10.0, 100.0, 150.0, 25.0, 170.0, 125.0, 15.0];
    var polygons = {
        "sample1": [[0, 1, 2]],
        "sample2": [[0, 2, 3]]
    };
    var dataset = {
        "sample1": "toast",
        "sample2": "biscuits"
    };
    var key = {
        "toast": "#ffcf7f",
        "biscuits": "#ffff7f",
        "default": "#7f7f7f"
    }

    var map = new DuckMap({
        "canvas": $(".duckmap")[0], 
        "buffer": buffer, 
        "polygons": polygons,
        "dataset": dataset,
        "key": key
    });
    map.redraw();
 
    
})