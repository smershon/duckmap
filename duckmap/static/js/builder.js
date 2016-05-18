function initMap() {
    
    var borderStyles = {
        national: {strokeColor: "#000000", strokeWeight: 4},
        state: {strokeColor: "#000000", strokeWeight: 1},
        county: {strokeColor: "#7f7f7f", strokeWeight: 1},
        coast: {strokeColor: "#3f3fff", strokeWeight: 4, strokeOpacity: 0.5}
    };
    
    var myLatlng = {lat: 45.0, lng: -121.044};
    
    var segments = [];
    var currentSegment = null;
    var drawing = false;
    
    var data = [];
    
    var type_html = `
        <select>
          <option value="county">County</option>
          <option value="state">State</option>
          <option value="national">National</option>
          <option value="coast">Coast</option>
        </select>`;
    
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
            segments.push(currentSegment);
            var idx = segments.length - 1;
            $("#info tbody").append("<tr id=\"border_" + idx + "\"><td>" + segments.length + "</td><td>" + type_html + "</td></tr>")
            $("#info tbody select").unbind("change");
            $("#info tbody select").change(function() {
                var uid = $(this).parent().parent().attr("id");
                var idx = parseInt(uid.split("_").pop());
                segments[idx].setOptions(borderStyles[$(this).val()]);
            });
            currentSegment = null;
            drawing = false;
        }
    });
    
    map.setOptions({draggableCursor:"crosshair"});

    map.addListener("click", function(e) {
        pushEdge(e);
    });
    
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
                console.log(this);
                console.log(segments.indexOf(this));
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
    
}