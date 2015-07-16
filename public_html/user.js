/*Copyright (C) Tyler Hackett 2015*/

var user;
	  
function User(id, name)
{
	console.log(name);
	console.log(id);
	
	this.id			= id;
	this.name		= name;
	this.friends	= [];
	
	usr = this;
	
	FB.api('/'+this.id+'?fields=location', function(response)
	{			
		FB.api('/'+response.location.id+'?fields=location',function(response)
		{
			var longitude 	= response.location.longitude;
			var latitude 	= response.location.latitude;
		
			usr.location 	= new google.maps.LatLng(latitude, longitude);
			usr.icon		= new google.maps.Circle(usr.getIconOptions());
		});
	});
	
	this.loadFriends();
}

User.prototype.getName = function()
{
	return this.name;
}

User.prototype.loadFriends = function()
{
	usr = this;
	
	FB.api('/'+this.id+'/friends',function(response)
	{
		response.data.forEach(function(userData)
		{
			usr.addFriend(new User(userData.id, userData.name));
		});
	});
}

User.prototype.getFriends = function()
{
	return this.friends;
}

User.prototype.setFriends = function(friends)
{
	this.friends = friends;
}

User.prototype.addFriend = function(friend)
{
	if(!this.friends.includes(friend))
		this.friends.push(friend);
}

User.prototype.removeFriend = function(friend)
{
	var index = this.friends.indexOf(friend);
	
	if(index > -1)
		this.friends.splice(index, 1);
}

User.prototype.getIconOptions = function()
{
	var iconOptions;
	
	if(this == user) //If this is the instance of the current user
	{
		iconOptions = {
			strokeColor: '#992E2E',
			strokeOpacity: 1,
			strokeWeight: 5,
			fillColor: '#FF4D4D',
			fillOpacity: 1,
			map: map,
			center: this.location,
			radius: 50000
		};
	}
	else
	{
		iconOptions = {
			strokeColor: '#5370EC',
			strokeOpacity: 1,
			strokeWeight: 5,
			fillColor: '#99B8FF',
			fillOpacity: 1,
			map: map,
			center: this.location,
			radius: 50000
		};
	}
	return iconOptions;
}
