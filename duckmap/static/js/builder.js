function initMap() {
    
    var borderStyles = {
        national: {strokeColor: "#000000", strokeWeight: 4},
        state: {strokeColor: "#000000", strokeWeight: 1},
        county: {strokeColor: "#7f7f7f", strokeWeight: 1},
        coast: {strokeColor: "#3f3fff", strokeWeight: 4, strokeOpacity: 0.5}
    };
    
    var myLatlng = {lat: 45.0, lng: -121.044};
    
    var segments = [];
    var areas = [];
    var area_borders = [];
    var building = false;
    var currentSegment = null;
    var currentArea = null;
    var currentAreaBorders = null;
    var drawing = false;
    
    var data = [];
    
    var type_html = `
        <select>
          <option value="county">County</option>
          <option value="state" selected>State</option>
          <option value="national">National</option>
          <option value="coast">Coast</option>
        </select>`;
        
    var area_html = `<input type="text"></input>`
    
    var poly = new google.maps.Polyline({
        path: data,
        editable: true,
        geodesic: true,
        strokeColor: "#ffcf3f",
        strokeOpacity: 0.8,
        strokeWeight: 2
    });

    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: myLatlng
    });
    
    google.maps.event.addDomListener(document, "keypress", function (e) {

        if (e.keyCode == 115) {
            // 's'
            if (drawing) {
                segments.push(currentSegment);
                var idx = segments.length - 1;
                $("#border_info tbody").append("<tr id=\"border_" + idx + "\"><td>" + 
                        segments.length + "</td><td>" + type_html + "</td></tr>")
                $("#border_info tbody select").unbind("change");
                $("#border_info tbody select").change(function() {
                    var uid = $(this).parent().parent().attr("id");
                    var idx = parseInt(uid.split("_").pop());
                    segments[idx].setOptions(borderStyles[$(this).val()]);
                });
                currentSegment = null;
                drawing = false;
            } else if (building) {
                areas.push(currentArea);
                area_borders.push(currentAreaBorders);
                var idx = areas.length - 1;
                $("#area_info tbody").append("<tr id=\"area_" + idx + "\"><td>" + 
                        areas.length + "</td><td>" + area_html + 
                        "</td><td><button class=\"show\">hide</button></td></tr>");
                $("#area_info .show").unbind("click");
                $("#area_info .show").click(function() {
                    var uid = $(this).parent().parent().attr("id");
                    var idx = parseInt(uid.split("_").pop());
                    if ($(this).html() == "hide") {
                        areas[idx].setMap(null);
                        $(this).html("show");
                    } else {
                        areas[idx].setMap(map);
                        $(this).html("hide");
                    }
                });
                currentArea = null;
                currentAreaBorders = null;
                building = false;
            } 
        }
    });
    
    map.setOptions({draggableCursor:"crosshair"});

    map.addListener("click", function(e) {
        pushEdge(e);
    });
    
    function vertexMatch(v0, v1) {
        return (v0.lat() == v1.lat() && v0.lng() == v1.lng()); 
    }
    
    function pushEdge(e) {
        if (drawing) {
            // Add a vertex to the current segment
            currentSegment.getPath().push(e.latLng);
        } else {
            // Place a marker and start a new segment
            currentSegment = new google.maps.Polyline({
                editable: true,
                geodesic: true,
                strokeColor: "#7f0000",
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            currentSegment.setMap(map);
            drawing = true;
            google.maps.event.addListener(currentSegment, "click", function(e) {
                if (e.vertex == undefined) {
                    highlightBorder(this);
                } else {
                    pushEdge(e);
                }
            });
            google.maps.event.addListener(currentSegment, "rightclick", function(e) {
                if (!building) {
                    building = true;
                    currentArea = new google.maps.Polygon({
                        path: [],
                        strokeColor: '#FFFFFF',
                        strokeOpacity: 1.0,
                        strokeWeight: 0,
                        fillColor: '#FFFF00',
                        fillOpacity: 0.4,
                        zIndex: -1                        
                    });
                    currentAreaBorders = [];
                    currentArea.setMap(map);
                }
                currentAreaBorders.push(segments.indexOf(this));
                var existingPath = currentArea.getPath();
                var endPoint = existingPath.getAt(existingPath.getLength() - 1);
                if (existingPath.getLength() <= 0 || vertexMatch(endPoint, this.getPath().getAt(0))) {
                    this.getPath().forEach(function(ll) {
                        currentArea.getPath().push(ll);
                    });
                } else {
                    // Reverse the order of this.getPath() before pushing
                    var newPath = this.getPath();
                    for (var i = newPath.getLength() - 1; i--; i >= 0) {
                        currentArea.getPath().push(newPath.getAt(i));
                    }
                }
            });
            currentSegment.getPath().push(e.latLng);
        }
    }
    
    function highlightBorder(border) {
        idx = segments.indexOf(border);
        border.setOptions({strokeColor: "#ffff00", strokeWeight: 3});
        if (idx >= 0) {
            console.log($("#info tbody tr")[idx]);
            $("#info tbody tr").eq(idx).css("background-color", "#ffff00");
        }
    }
    
    $(".save_map").click(function() {
        var map_name = $("#map_name").html();
        var flat_borders = [];
        var flat_areas = {};
        
        $("#border_info tbody tr").each(function(i, row) {
            var border = segments[i];
            var border_type = $(row).find("select").val();
            var flat_border = []
            border.getPath().forEach(function(ll) {
                flat_border.push({
                    lat: ll.lat(),
                    lng: ll.lng()
                });
            });
            flat_borders.push({
                type: border_type,
                points: flat_border
            });
        });
        
        $("#area_info tbody tr").each(function(i, row) {
            var area_name = $(row).find("input").val();
            if (flat_areas[area_name]) {
                flat_areas[area_name].push(area_borders[i]);
            } else {
                flat_areas[area_name] = [area_borders[i]];
            }
        });
        
        var data = {
            mapname: map_name,
            borders: flat_borders,
            areas: flat_areas 
        };
        
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: "savemap",
            data: JSON.stringify(data),
            success: function(data) {
                console.log(data);
            }
        });

    });
    
}