/*Copyright (C) Tyler Hackett 2015*/

function Person(name, location)
{
	this.name		= name;
	this.location 	= location;
	this.friends	= [];
}

Person.prototype.getName = function()
{
	return this.name;
}

Person.prototype.getFriends = function()
{
	return this.friends;
}

Person.prototype.setFriends = function(friends)
{
	this.friends = friends;
}

Person.prototype.addFriend = function(friend)
{
	if(!this.friends.includes(friend)
		this.friends.push(friend);
}

Person.prototype.removeFriend = function(friend)
{
	var index = this.friends.indexOf(friend);
	
	if(index > -1)
		this.friends.splice(index, 1);
}
