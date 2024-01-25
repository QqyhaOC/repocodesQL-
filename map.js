var map,marker = [],infowindow;

function initMap(location, address, query , target, restParam) {
    if(restParam == null)restParam="generative";    
    console.log("restParam", restParam);
    let tokyo = { lat: 35.681, lng: 139.767 };
    if (location) {
        tokyo = { lat: location.lat, lng: location.lon };
    }
    $('#lat').val(tokyo.lat);
    $('#lng').val(tokyo.lng);


    if( restParam == "withPlaces"){
        map = new google.maps.Map(
            document.getElementById("map"),
            {
                zoom: 13,
                center: tokyo,
                mapTypeControl: false,
                fullscreenControl: true, 
                streetViewControl: false,
                zoomControl: true,
            }
        );
        var request = {
            location: tokyo,
            radius: 200,
            query: query
        };
        
        var service = new google.maps.places.PlacesService(map);
        var find;

        var results_place = service.textSearch(request, function(results_place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log("findcount:"+results_place.length);
                for (var i = 0; i < results_place.length; i++) {
                    console.log("name:"+results_place[i].name);

                  
                    find = false;
                    target.forEach((v,index) => {
                        console.log("v.address:"+v.address);
                        console.log("formatted_address:"+results_place[i].formatted_address.replace("日本、",'').substr(10));
                        if(v.address == results_place[i].formatted_address.replace("日本、",'').substr(10)){
                            find = true;
                            console.log(" find をtrueにしました");
                        }

                    });
                    if(find){
                        console.log( "i :", i , "results_place[" + i + "]", results_place[i], "  map: ", map );
                        createMarker(i,results_place[i], map);
                    }
                };
            }
            map.setCenter(results_place[0].geometry.location);
        });
     

    
        if(location){
           
            var geocoder = new google.maps.Geocoder();
            var results = geocoder.geocode({"latLng" : tokyo},function(results, status) {
                console.log("latLng:"+tokyo.lat + "," + tokyo.lng);
                console.log("status:"+status);
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log("results[0].formatted_address:"+results[0].formatted_address.replace("日本、",'').substr(10));
                    address = results[0].formatted_address.replace("日本、",'');
                    address = address.split(' ')[1];
                    document.getElementById("address").innerHTML = address;
                    map.panTo(tokyo);
            
                }
            });
        }
    }

    if( restParam == "generative"){
        map = new google.maps.Map(
        document.getElementById("map"),
        {
            zoom: 15,
            maxZoom:15,
            center: tokyo,
            mapTypeControl: false,
            fullscreenControl: true, 
            streetViewControl: false,
            zoomControl: true, 
            }
        );
        
        target.forEach((v,i)=>{
           
            console.log("latLng:"+v.geometry.location.lat + "," + v.geometry.location.lng);
            console.log("formatted_address:"+v.formatted_address);
            console.log("name:"+v.name);
            createMarker(i,v,map);
        });

        map.fitBounds(new google.maps.LatLngBounds(
      
        {
          lat: Math.min(...target.map(d => d.geometry.location.lat)),
          lng: Math.min(...target.map(d => d.geometry.location.lng))
        },
       
        {
          lat: Math.max(...target.map(d => d.geometry.location.lat)),
          lng: Math.max(...target.map(d => d.geometry.location.lng))
        }
        ));
       

    }



}


function createMarker(index,place,map) {
    if (!place.geometry || !place.geometry.location) return;
   
    marker[index] = new google.maps.Marker({
      map,
      position: place.geometry.location
    });

  
    google.maps.event.addListener(marker[index], "click", () => {
        console.log('set location :', place.geometry.location);
        console.log('set address :', place.formatted_address.replace("日本",''));
        console.log('set marker_name :', place.name);

       
        $('#lat').val(place.geometry.location.lat);
        $('#lng').val(place.geometry.location.lng);
        document.getElementById("address").innerHTML = place.formatted_address.replace("日本、",'');
        document.getElementById("marker_name").innerHTML = place.name;
        
        document.set
        showInfowindow(marker[index],place.name,map);
    });

  }

function showInfowindow(marker,name,map){
   
    if(typeof infowindow !== 'undefined'){
        if(infowindow) infowindow.close();
    }
    infowindow = new google.maps.InfoWindow();
    infowindow.setContent(name || "");
    infowindow.open(map,marker);

}

window.initMap = initMap;
