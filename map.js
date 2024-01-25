
// Initialize and add the map
function initMap(location,address) {
    // The location of Tokyo
    //lat: マーカーの緯度35.68127139541008
    // lng: マーカーの経度139.76727662658692
    let tokyo = { lat: 35.681, lng: 139.767 };
    if (location) {
        tokyo = { lat: location.lat, lng: location.lon };
    }

    // 20230331開いた時の座標修正
    $('#lat').val(tokyo.lat);
    $('#lng').val(tokyo.lng);

    // 2022/12/09 住所から地図検索
    if(address){
        //document.getElementById('address').value = address;
        var geocoder = new google.maps.Geocoder();
        var results = geocoder.geocode({"address" : address},function(results, status) {
            console.log("address:"+address);
            console.log("status:"+status);
            if (status == google.maps.GeocoderStatus.OK) {
                console.log("results[0].geometry.location:"+results[0].geometry.location);
                tokyo = results[0].geometry.location;
                map.panTo(tokyo);
                marker.setPosition(tokyo);
            }
        });
    }

    console.log("tokyo.lat:"+tokyo.lat + " tokyo.lng:"+tokyo.lng);

    // 20221209 住所指定時に読み込むよう修正
    //if(address){
        // The map, centered 
        const map = new google.maps.Map(
            document.getElementById("map"),
            {
                zoom: 19,
                center: tokyo,
                mapTypeControl: false, //マップタイプ コントロール
                fullscreenControl: true, //全画面表示コントロール
                streetViewControl: false, //ストリートビュー コントロール
                zoomControl: true, //ズーム コントロール
            }
        );
    //}

    // 20221209 住所指定時に読み込むよう修正
    //if(address){
        // The marker, positioned at Uluru
        const marker = new google.maps.Marker({
            position: tokyo,
            map: map,
            draggable: true,
        });
    //}

    //マーカーのドロップ（ドラッグ終了）時のイベント
    google.maps.event.addListener(marker, 'dragend', function (e) {
        //イベントの引数eの、プロパティ.latLngがmarkerの緯度経度。
        $('#lat').val(e.latLng.lat());
        $('#lng').val(e.latLng.lng());
    });
}

window.initMap = initMap;