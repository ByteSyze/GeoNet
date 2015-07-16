/*Copyright (C) Tyler Hackett 2015*/

var map;
var geocoder;

$('[data-goto]').click(function()
{
	var gt = $(this).attr('data-goto');
	
	var pageHeight;
	
	$('.active').animate({'height':'0px'}, 500, function()
	{
		$(this).removeClass('active');
		$(this).css('height','');
		
		$page = $('[data-page="'+gt+'"]');
		$popup = $('#fb-login-popup > div');
		
		$page.addClass('active');
		pageHeight = $page.height();
		popupOuterHeight = $popup.outerHeight();
		$page.removeClass('active');
		
		$popup.animate({'margin-top':-(popupOuterHeight/2)});
		$page.animate({'height':pageHeight+'px'}, 500, function()
		{ 
			$page.addClass('active');
			$page.css('height','');
		});
	});
	
});

/**
 *	initialize FB API
 **/
$(document).ready(function()
{	
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_US/sdk.js', function()
	{
		FB.init({
			appId: '1610996765822675',
			xfbml: true,
			version: 'v2.4' // or v2.0, v2.1, v2.0
		});     
		$('#loginbutton,#feedbutton').removeAttr('disabled');
		FB.getLoginStatus(statusChangeCallback);
	});
});
// This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      initializeFB();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'You must login to use GeoNet.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'You must login to use GeoNet.';
    }
  }
  
  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
}

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
function initializeFB()
{
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me?fields=name,id', function(response) {
		console.log('Successful login for: ' + response.name);
		document.getElementById('status').innerHTML =
        'Welcome, ' + response.name;
		$('#continue').css('display','block');
		
		$popup = $('#fb-login-popup > div');
		$popup.animate({'margin-top':-($popup.outerHeight()/2)});
		
		user = new User(response.id, response.name);
    });
}

/**
 *	Retrieve user's location from Facebook.
 **/
function getLocation(uid, callback)
{
	FB.api('/'+uid+'?fields=location', function(response)
	{
		console.log(response.location);
		
		FB.api('/'+response.location.id+'?fields=location',function(response)
		{
			var longitude 	= response.location.longitude;
			var latitude 	= response.location.latitude;
			
			console.log(longitude);
			
			callback(new google.maps.LatLng(latitude, longitude));
		});
	});
}

/**
 *	Convert postal address into longitude & latitude.
 *	A LatLng object & status will be passed
 *	to callback on success, or false on fail.
 **/
function getGeocode(address, callback)
{
	geocoder.geocode({'address':address}, function(results, status)
	{
		if(status === google.maps.GeocoderStatus.OK)
			callback(results[0].geometry.location, status);
		else
			callback(false, status);
	});
}

function initializeMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 8,
	minZoom: 3,
    center: {lat: -34.397, lng: 150.644}
  });
  
  geocoder = google.maps.Geocoder();
}

$('body').on('click', '[data-show]',function(){ $($(this).attr('data-show')).show(); return false; });
$('body').on('click', '[data-hide]',function(){ $($(this).attr('data-hide')).hide(); return false; });
$('body').on('click', '[data-togg]',function(){ $($(this).attr('data-togg')).toggle(); return false; });

google.maps.event.addDomListener(window, 'load', initializeMap);

