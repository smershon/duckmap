function initMap() {
    var myLatlng = {lat: -25.363, lng: 131.044};

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatlng
    });

    map.addListener('click', function(e) {
        console.log(e.latLng.lat());
        console.log(e.latLng.lng());
    });
}