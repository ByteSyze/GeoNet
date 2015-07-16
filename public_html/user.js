/*Copyright (C) Tyler Hackett 2015*/
	  
function User(id, name, location)
{
	this.id			= id;
	this.name		= name;
	this.location 	= location;
	this.friends	= [];
	
	this.icon		= new google.maps.Circle(this.getIconOptions());
	
	/*getGeocode(this.location, function(geoLocation)
	{
		this.geoLocation = geoLocation;
	});*/
}

User.prototype.getName = function()
{
	return this.name;
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
	var iconOptions = {
		strokeColor: '#5370EC',
		strokeOpacity: 1,
		strokeWeight: 5,
		fillColor: '#99B8FF',
		fillOpacity: 1,
		map: map,
		center: this.location,
		radius: 50000
	};
	
	return iconOptions;
}
