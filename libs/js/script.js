let latitude, longitude;
let cordinates = [];
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'
	
    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

	
	

}, 1000);


window.onload = function(){
	navigator.geolocation.getCurrentPosition(getLocation, errorCallback);
}

const errorCallback = (error) => {
	console.log("The error = ",error);
};

const getLocation = (position) => {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	onPositionReady();
	mapLoad();
	currentLoactionAddress();
	//presetting weather for current location
	const API_KEY ='33c8219f1dd1996bc7eff7d8690f8f8a';
	fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

	//console.log(data)
	showWeatherData(data);
	
	})
}

const onPositionReady = () => {
    console.log(`Latitude: ${latitude} Longtitude: ${longitude}`)
}   

const mapLoad = () => {
	let base = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
						maxZoom: 19,
						subdomains: 'abcd',
						attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
					});
	// let base = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	// 				maxZoom: 19,
	// 				subdomains: 'abcd',
	// 				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	// 			});
				
				let map = L.map('map', {
					layers: [base],
					tap: false, // ref https://github.com/Leaflet/Leaflet/issues/7255
					center: new L.LatLng(latitude, longitude),
					zoom: 5,
					fullscreenControl: true,
					fullscreenControlOptions: { // optional
						title:"Show me the fullscreen !",
						titleCancel:"Exit fullscreen mode"
					}
				//}).fitWorld();
				}).setView([latitude, longitude], 5);
				
				//Red Marker
				var redMarker = L.ExtraMarkers.icon({
					icon: 'fa-graduation-cap',
					markerColor: 'red',
					shape: 'circle',
					prefix: 'fa'
				  });
				
				L.marker([latitude, longitude], {icon: redMarker}).addTo(map);
									
				//Marker Cluster
				var markers = L.markerClusterGroup();
				
					//Point of Interest
					$.ajax({
						url: "libs/php/PointOfInterest.php",
						type: 'GET',
						dataType: 'JSON',
						data: {
							lat: latitude,
							lng: longitude
							
					},
					success: function(result){
						//console.log("Point Of Interest",JSON.stringify(result));
												
						result['data'].forEach(element => {
							cordinates.push(
								[
									element.properties.lat, element.properties.lon, element.properties.name
								]
							)
						});
						//console.log("Point of Interest Array", cordinates);
						
						for (let i = 0; i < cordinates.length; i++) {
							let a = cordinates[i];
							let title = a[2];
							let marker = L.marker(new L.LatLng(a[0], a[1]), {
							title: title
							});
							marker.bindPopup(title);
							markers.addLayer(marker);
						}
						
						map.addLayer(markers);
					},
					error: function(jqXHR, textStatus, errorThrown){

					}
					})

				// detect fullscreen toggling
				map.on('enterFullscreen', function(){
					if(window.console) window.console.log('enterFullscreen');
				});
				map.on('exitFullscreen', function(){
					if(window.console) window.console.log('exitFullscreen');
				});
				
				
				//Get Latitude and Longtitude on Map on Mouse Over
				map.on('mousemove',function(e){
					document.getElementsByClassName('cordinate')[0].innerHTML = '<b>Lat:</b> ' + e.latlng.lat + ' <b>Lng:</b> ' + e.latlng.lng;
					//console.log('Lat: ' + e.latlng.lat , 'Lng: ' + e.latlng.lng);
				})

				//Logo Image
				L.Control.Watermark = L.Control.extend({
					onAdd(map) {
						const img = L.DomUtil.create('img','img1');

						img.src = './libs/images/logo.png';
						img.style.width = '100px';
						return img;
					},
					onRemove(map) {
					
					}
				});

				L.control.watermark = function (opts) {
					return new L.Control.Watermark(opts);
				};
				
				const watermarkControl = L.control.watermark({position: 'bottomright'}).addTo(map);

}

//Cureent Location Address
const currentLoactionAddress = () => {
	$.ajax({
		url: "libs/php/currentLocation.php",
		type: 'GET',
		dataType: 'json',
		data: {
			lat: latitude,
			lng: longitude
			
		},
		success: function(result) {

			currentLocation(result['data']);
			
			
		},
		error: function(jqXHR, textStatus, errorThrown) {
			// your error code
		}
	}); 
}

const showWeatherData = (data) => {
    let {humidity, pressure,temp_min, temp_max, feels_like} = data.main;
    let {lon, lat} = data.coord;
    countryEl.innerHTML = lat + 'N ' + lon+'E'

	currentWeatherItemsEl.innerHTML = `
	<div class="weather-item">
	 	${data.weather[0].description}
	</div>
	<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
    
    <div class="weather-item">
        <div>Min Temp &nbsp;&nbsp;</div>
        <div>${temp_min}&#176;C</div>
    </div>
    <div class="weather-item">
        <div>Max Temp&nbsp;&nbsp;</div>
        <div>${temp_max}&#176;C</div>
    </div>
	<div class="weather-item">
        <div>Feel Like&nbsp;&nbsp;</div>
        <div>${feels_like}&#176;C</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}&#176;C</div>
    </div>
	<div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}&#176;C</div>
    </div>
    `;
}

//Current Location Function
const currentLocation = (data) => {
	const address = data[0].formatted;
	const mysplit = address.split(",")[0];
	console.log("Full Address: ",address);
	console.log("Split Address :", mysplit);
	timezone.innerHTML = mysplit;
}



