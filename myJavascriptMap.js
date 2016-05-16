var map1;
var map2;
var map3;

// Sanitizer function to protect the data to be inserted in the HTML 
function escapeText(t){
	return document.createTextNode(t).textContent;
}

function myJobHelper()
{
	// Getting the data to be displayed from the XML
	var title = escapeText($(this).find("title").text());
	var link = escapeText($(this).find("link").text());
	var date = escapeText($(this).find("pubDate").text());
	var description = escapeText($(this).find("description").text());
	var coordinates = escapeText($(this).find("point").text());
	
	// Extract the latitude and longitude from the coordinates
	var space = coordinates.indexOf(" ");
	var myLat = coordinates.substring(0,space);
	var myLon = coordinates.substring(space+1, coordinates.length);
	// Create Google Maps coordinates from that latitude and longitude
	var point = new google.maps.LatLng(myLat,myLon);
	
	// Creating a button to center the map to this point
	var button = "<button onClick='findPoint(" + myLat + "," + myLon + ", 2)'>Show me!</button>";
		
	// Creating the strings containing the previous information
	var location = "This job offer is located at (" + coordinates + ").";
	var offer = "<b>TITLE</b>: " + title + "<br/>";
	offer += "<b>DESCRIPTION</b>: " + description;
	var link = "For futher information, please visit this <a href=" + link + ">link</a>."
	
	// Inserting new row in the corresponding 'table' for each result of the feed and displaying the previous information
	var myHTML = "<div class='row myOutline'>";
	myHTML += "<div class='col-md-6 text-center myPadding'>" + location + button + "</div>";
	//myHTML += "<div class='col-md-4 text-justify myPadding'>" + offer + "</div>";
	myHTML += "<div class='col-md-6 text-center myPadding'>" + link + "</div>";
	myHTML += "</div>";
	$("#myJobs").append(myHTML);

	// Creating the content of the info window in a string variable
	var contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h4 id="firstHeading" class="firstHeading">OFFER DESCRIPTION</h4>'+
		'<div id="bodyContent">'+
		'<p>' + offer + '</p>' +
		'</div>' +
		'</div>';
	
	// Creating the info window
	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});
	
	// Creating the custom icon for the marker
	var imageIcon = {
		url: 'http://students.ics.uci.edu/~garciad7/myjobmarkersmall.png',
		size: new google.maps.Size(39, 50),
		origin: new google.maps.Point(0,0),
		//anchor: new google.maps.Point(0, 64)
	};
	
	// Creating the the marker
	var marker = new google.maps.Marker({
		position: point,
		map: map2,
		icon: imageIcon,
		animation: google.maps.Animation.DROP,
		title:"Job!"
	});	
	
	// Creating a listener to catch the click in the marker and open the info window
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map2,marker);
	});
}


function myJobParser(data) {
	initializeJobMap();
	$(data).find("item").each(myJobHelper);
}


function myInstaParser(data){
	initializeInstaMap()
	for(i=0; i<data.data.length; i++){
		if(data.data[i].location != null && data.data[i].location.latitude != undefined){
			// Getting data about the IG picture and creating HTML code to display it
			var src = escapeText(data.data[i].images.standard_resolution.url);
			var img = "<a href='" + src + "'><img src='" + src + "' width='150'/></a>";
		   
			// Getting data about the IG user and creating HTML code to display it
			var name = escapeText(data.data[i].user.username);
			var user = "<a href='http://instagram.com/" + name + "'>" + name + "</a>";
			
			// Getting data about the IG user profile picture and creating HTML code to display it
			var prof_src = escapeText(data.data[i].user.profile_picture);
			var prof_img = "<a href='" + prof_src + "'><img src='" + prof_src + "' width='50'/></a>";
		   
			// Getting data about the description of the picture
			var text = escapeText(data.data[i].caption.text);
			
			// Getting data about location and checking whether it is provided
			var lat = escapeText(data.data[i].location.latitude);
			var lon = escapeText(data.data[i].location.longitude);
			var coordinates = "This picture was taken at (" + lat + ", " + lon + ").";
			
			// Create Google Maps coordinates from that latitude and longitude
			var point = new google.maps.LatLng(lat,lon);
			
			// Creating a button to center the map to this point
			var button = "<button onClick='findPoint(" + lat + "," + lon + ", 3)'>Show me!</button>";
			
			// Inserting new row in the corresponding 'table' for each result of the feed displaying the previous information
			var myHTML = "<div class='row myOutline'>";
			myHTML += "<div class='col-md-4 text-center myPadding'>" + coordinates + button + "</div>";
			myHTML += "<div class='col-md-4 text-center myPadding'>" + img + "</div>";
			myHTML += "<div class='col-md-4 text-center myPadding'> By " + user + "<br/>" + prof_img + "<br/><br/>" + text + "</div>";
			myHTML += "</div>";
			$("#myInsta").append(myHTML);

			// Creating the custom icon for the marker
			var imageIcon = {
				url: 'http://students.ics.uci.edu/~garciad7/myIGmarkersmall.png',
				size: new google.maps.Size(39, 50),
				origin: new google.maps.Point(0,0),
				//anchor: new google.maps.Point(0, 64)
			};
			
			// Creating the the marker			
			var marker = new google.maps.Marker({
				position: point,
				map: map3,
				icon: imageIcon,
				animation: google.maps.Animation.BOUNCE,
				title:"Instagram!"
			});
		}
	}
}


function myQuakeParser(data){
	initializeQuakeMap();
	
	for(i = 0; i<data.features.length; i++){
        // Getting data about the quake magnitude and creating a string to display it
		var mag = escapeText(data.features[i].properties.mag);
		var scale = "This earthquake has a magnitude of " + mag + " in the Richter scale.";
        
		// Getting data about the quake location and creating a string to display it
		var place = escapeText(data.features[i].properties.place);
		var coordinates = escapeText(data.features[i].geometry.coordinates);
		var location = "This earthquake happened " + place + ". Specifically, at (" + coordinates + ").";
         
		// Extract the latitude and longitude from the coordinates
		var comma1 = coordinates.indexOf(",");
		var comma2 = coordinates.lastIndexOf(",");
		var myLon = coordinates.substring(0,comma1);
		var myLat = coordinates.substring(comma1+1, comma2);
		// Create Google Maps coordinates from that latitude and longitude
		var point = new google.maps.LatLng(myLat,myLon);
		
		// Creating a button to center the map to this point
		var button = "<button onClick='findPoint(" + myLat + "," + myLon + ", 1)'>Show me!</button>";
		
		// Getting data about the quake time and creating a string to display it
		var time = new Date(escapeText(data.features[i].properties.time) * 1000);
		var hour = time.getHours() + ":" + time.getMinutes();
		var moment = "This earthquake occurred at " + hour + ".";
        
		// Inserting new row in the corresponding 'table' for each result of the feed displaying the previous information	
		var myHTML = "<div class='row myOutline'>";
		myHTML += "<div class='col-md-4 text-center myPadding'>" + location + button + "</div>";
		myHTML += "<div class='col-md-4 text-center myPadding'>" + moment + "</div>";
		myHTML += "<div class='col-md-4 text-center myPadding'>" + scale + "</div>";
		myHTML += "</div>";
		$("#myQuake").append(myHTML);
		
		// Creating the custom icon for the marker
		var imageIcon = {
			url: 'http://students.ics.uci.edu/~garciad7/myquakemarkersmall.png',
			size: new google.maps.Size(39, 50),
			origin: new google.maps.Point(0,0),
			//anchor: new google.maps.Point(0, 64)
		};
		
		// Creating the the marker		
		var marker = new google.maps.Marker({
			position: point,
			map: map1,
			icon: imageIcon,
			animation: google.maps.Animation.BOUNCE,
			title:"Quake!"
		});		
	}
}


// Centers a map in a point and zooms to a specified scale
function findPoint(lat, lon, i){
	// Determining which map to center
	if(i == 1){
		map1.setCenter(new google.maps.LatLng(lat,lon));
		map1.setZoom(8);
	} else if (i == 2){
		map2.setCenter(new google.maps.LatLng(lat,lon));
		map2.setZoom(8);
	} else if (i == 3){
		map3.setCenter(new google.maps.LatLng(lat,lon));
		map3.setZoom(8);
	}
}


function initializeQuakeMap(){
	var latlng = new google.maps.LatLng(39.833333, -98.583333); // Map centered in the center of the US
	var myOptions = {
		zoom: 3,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	var temp = $("#map_canvas1");
	map1 = new google.maps.Map(temp[0], myOptions);
}


function initializeJobMap(){
	var latlng = new google.maps.LatLng(39.833333, -98.583333); // Map centered in the center of the US
	var myOptions = {
		zoom: 3,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	var temp = $("#map_canvas2");
	map2 = new google.maps.Map(temp[0], myOptions);
}

	
function initializeInstaMap(){
	var latlng = new google.maps.LatLng(39.833333, -98.583333); // Map centered in the center of the US
	var myOptions = {
		zoom: 3,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	var temp = $("#map_canvas3");
	map3 = new google.maps.Map(temp[0], myOptions);
}


function myBadLoadFunction(XMLHttpRequest,errorMessage,errorThrown) {
	alert("Load failed:"+errorMessage+":"+errorThrown);
}


function myReadyFunction(){
	// AJAX call for the job search feed, in XML
    $.ajax({
		url: "//students.ics.uci.edu/~garciad7/myProxy.php?http://www.indeed.com/opensearch?q=%22java%22",
		dataType: "xml",
		success: myJobParser,
		error: myBadLoadFunction
	});

	// AJAX call for the Instagram feed, in JSONP
	$.ajax({
		url: "//api.instagram.com/v1/media/popular?client_id=12f944cc24b14a50a5f379e64bf26c1a&access_token=212135500.12f944c.bffb82d404e44f3aa7fd892152d4e1d0",
		//type: "GET",
		dataType: "jsonp",
        //cache: false,
        //jsonp: false,
        //jsonpCallback: "myGoodIG",
		success: myInstaParser,
		error: myBadLoadFunction
    });
    
	// AJAX call for the earthquake feed, in JSON
	$.ajax({
		url: "//students.ics.uci.edu/~garciad7/myProxy.php?http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
		dataType: "json",
		success: myQuakeParser,
		error: myBadLoadFunction,
	});
}

$(document).ready(
	myReadyFunction
);