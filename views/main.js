var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = document.body.offsetWidth;
canvas.height = document.body.offsetHeight;
canvas.oncontextmenu = function (e) {
    e.preventDefault();
};
document.body.appendChild(canvas);

var x = 390,
	y = 30,
    velX = 0,
    speed = 2,
	jumps = 2,
	friction = 0.87,
	gravity = 0,
	jumpHeight = 5,
    keys = [],
	bullets = [],
	canShoot = true,
	clicks = 30,
	socket = io(),
	users = 1,
	id,
	health = 100,
	kills = 0,
	deaths = 0,
	name = prompt("enter a name"),
	colour = "#"+((1<<24)*Math.random()|0).toString(16),
	killfeed = [],
	damage = 25,
	cooldown = 0,
	hovered = {
		x:0,
		y:0
	},
	players = [],
	xServer = x,
	yServer = y,
	respawning = false,
	powerups = [],
	powerupText = "",
	paused = false,
	points = 0;

if(name == ""){
	name = "unnamed";
}

var level = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
//var level = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,1,0,0],[0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,1,0,0,1,1,0,0],[0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1,1,0,0,1,1,0,0],[0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,1,0,0],[0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0],[0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],[0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,1,0,0],[0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1,1,0,0,1,1,0,0],[0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,1,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
var blockPlacer = [];
for(var i=0;i<level.length;i++){
	blockPlacer[i] = [];
}

var thing = Math.floor(Math.random() * (1500-30));
while(level[Math.floor(thing/30)][Math.floor(y/30)] == 1 || level[Math.ceil(thing/30)][Math.floor(y/30)] == 1){
	thing = Math.floor(Math.random() * (1500-30));
}
x = thing;
xServer = thing;

/* random generation
var level = [];

for (var i = 0 ; i < 3; i++) { // y
    level[i] = [];
    for (var j = 0; j < 50; j++) { // x
        level[i][j] = Math.floor(Math.random() * 2);
    }
}
*/
var startTime;
var latency;

setTimeout(function(){
	startTime = Date.now();
	socket.emit('getLatency');
},100);

setInterval(function() {
	startTime = Date.now();
	socket.emit('getLatency');
}, 2000);

socket.on('sendLatency', function() {
	latency = Date.now() - startTime;
});

setInterval(function(){
	console.log(latency + "ms");
},20000);

socket.on('connectlevel', function () {
	socket.emit('level', {
		level:level,
		blockPlacer:blockPlacer
	});
});

socket.on('users', function (socketusers) {
	users = socketusers;
});

socket.on('id', function (socketid) {
	id = socketid;
});

socket.on('leave', function (data) {
	for(var i=0;i<players.length;i++){
		if(players[i] != null){
			if(players[i].id == data){
				players.splice(i, 1);
			}
		}
	}
});

socket.on('position', function (data) {
	users = data.users;
	players[data.id] = {
		health:data.health,
		id:data.id,
		x:data.x,
		y:data.y,
		kills:data.kills,
		name:data.name,
		colour:data.colour,
		deaths:data.deaths,
		latency:data.latency,
		points:data.points
	};
});

socket.on('kill', function (data) {
	var dieSound = new Audio("die.wav");
	dieSound.play();
	if(data.id == id){
		Respawn();
		console.log("respawn from socket on");
		deaths++;
	}

	if(data.killer == "suicide"){
		killfeed.push(data.idName + " commited suicide");
	} else {
		if(data.killer == id){
			clicks += 15;
			kills++;
			points += 1;
		}
		killfeed.push(data.killerName + " killed " + data.idName);
	}

	if(killfeed.length > 0){
		document.getElementById("killfeed").style.opacity = 1;
	}

	window.setTimeout(function(){
		if(killfeed.length == 1){
			document.getElementById("killfeed").style.opacity = 0;
			window.setTimeout(function(){
				killfeed.splice(0,1);
			},200);
		} else {
			killfeed.splice(0,1);
		}
	},4000);
});

socket.on('chat', function(messages){
	document.getElementById("chat").innerHTML = "";
	for(var i=0;i<messages.length;i++){
		document.getElementById("chat").innerHTML += messages[i];
	}
	var chatSound = new Audio("chat.wav");
	chatSound.play();
	document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
});

//remove later
socket.on('hit', function (data) {
	if(data.id == id){
		health -= data.damage;
		if(health <= 0){
			socket.emit('kill', {
				killer:data.killer,
				id:data.id,
				killerName:data.killerName,
				idName:data.idName,
			});
		}
	}
});

socket.on('bullets', function (socketbullet) {
	if(socketbullet.id != id){
		bullets.push(socketbullet);
		var latencyDelay = (bullets[bullets.length-1].latency/(1000/60))*5;
		bullets[bullets.length-1].x += latencyDelay;
	}
});

socket.on('bulletHit', function (i) {
	bullets.splice(i, 1);
});

socket.on('level', function (data) {
	for(var i=0;i<data.level.length;i++){
		if(data.level[i] != level[i]){
			level[i] = data.level[i];
		}
	}
	for(var i=0;i<data.blockPlacer.length;i++){
		if(data.level[i] != level[i]){
			level[i] = data.level[i];
		}
	}
	blockPlacer = data.blockPlacer;
});

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
	if(e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 9){
		e.preventDefault();
	}
    if(e.keyCode == 87){
		if (jumps > 0 && respawning == false) {
			if(level[Math.floor(x/30)][Math.ceil(y/30)-1] != 1 && level[Math.ceil(x/30)][Math.ceil(y/30)-1] != 1){
				Jump();
			}
		}
	}
	
    if(e.keyCode == 27){
    	paused = !paused;
	}

	if(e.keyCode == 49 && document.getElementById("gunSelect").style.opacity == ""){
		SelectGun(50,500);
	}

	if(e.keyCode == 50 && document.getElementById("gunSelect").style.opacity == ""){
		SelectGun(100,2000);
	}

	if(e.keyCode == 51 && document.getElementById("gunSelect").style.opacity == ""){
		SelectGun(25,250);
	}
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;

    if(e.keyCode == 9){
    	paused = false;
    }
});

function Jump(){
	var jumpSound = new Audio("jump.wav");
	jumpSound.play();
	y -= 1;
	gravity = -jumpHeight;
	var height = -jumpHeight;
	window.setTimeout(function(){
		yServer -= 1;
		gravityServer = height;
	},latency);
	jumps--;
}

function Hit(killerHit,idHit,killerNameHit,idNameHit,damageHit,i){
	if(killerHit == "suicide"){
		console.log("suicide in hit");
    	respawning = true;
		socket.emit('kill', {
			killer:"suicide",
			id:id,
			killerName:"suicide",
			idName:name
		});
	} else {
		if(idHit == id){
			var hitSound = new Audio("hit.wav");
			hitSound.play();
			health -= damageHit;
			console.log("Hit player: " + idHit);
			if(health <= 0){
	    		respawning = true;
				socket.emit('kill', {
					killer:killerHit,
					id:idHit,
					killerName:killerNameHit,
					idName:idNameHit
				});
			}
		} else {
			var hitSound = new Audio("hit.wav");
			hitSound.play();
			console.log("Hit player: " + idHit);
			socket.emit('hit', {
				killer:killerHit,
				id:idHit,
				killerName:killerNameHit,
				idName:idNameHit,
				damage:damageHit
			});
			socket.emit('bulletHit',i);
		}
	}
}

function Respawn(){
	y = 30;
	yServer = y;
	var thing = Math.floor(Math.random() * (1500-30));
	while(level[Math.floor(thing/30)][Math.floor(y/30)] == 1 || level[Math.ceil(thing/30)][Math.floor(y/30)] == 1){
		thing = Math.floor(Math.random() * (1500-30));
	}
	x = thing;
	xServer = thing;
	gravity = 0;
	gravityServer = 0;
	health = 100;
	respawning = false;
}

function CheckY(){
	if(gravity == 0){
		var goingLow = level[Math.ceil((x+velX)/30)][Math.ceil((y+0.2)/30)];
		var goingHigh = level[Math.floor((x+velX)/30)][Math.ceil((y+0.2)/30)];
		var goingLow2 = level[Math.ceil((x+velX)/30)][Math.floor((y+0.2)/30)];
		var goingHigh2 = level[Math.floor((x+velX)/30)][Math.floor((y+0.2)/30)];
	} else {
		var goingLow = level[Math.ceil((x+velX)/30)][Math.ceil((y+gravity)/30)];
		var goingHigh = level[Math.floor((x+velX)/30)][Math.ceil((y+gravity)/30)];
		var goingLow2 = level[Math.ceil((x+velX)/30)][Math.floor((y+gravity)/30)];
		var goingHigh2 = level[Math.floor((x+velX)/30)][Math.floor((y+gravity)/30)];
	}
	if(goingLow == 1 || goingHigh == 1 || goingLow2 == 1 || goingHigh2 == 1){
		return true;
	} else {
		return false;
	}
}

function CheckX(vel){
	var goingLow = level[Math.ceil((x+vel)/30)][Math.floor(y/30)];
	var goingHigh = level[Math.floor((x+vel)/30)][Math.floor(y/30)];
	var goingLow2 = level[Math.ceil((x+vel)/30)][Math.ceil(y/30)];
	var goingHigh2 = level[Math.floor((x+vel)/30)][Math.ceil(y/30)];
	if(goingLow == 1 || goingLow2 == 1){
		return "right";
	} else if (goingHigh == 1 || goingHigh2 == 1){
		return "left";
	} else {
		return "none";
	}
}

function SelectGun(gunDamage,gunCooldown){
	damage = gunDamage;
	cooldown = gunCooldown;
	document.getElementById("gunSelect").style.opacity=0;
	document.getElementById("upgrades").style.opacity=1;
	document.getElementById("chat").style.opacity=1;
	document.getElementById("chatHide").style.opacity=1;
	document.getElementById("chatInput").style.opacity=1;
	window.setTimeout(function(){
		document.getElementById("gunSelect").style.display="none";
	},200);
	Update();
}

function HexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

function CreatePowerup(){
	var rand = Math.floor(Math.random() * 4)+1;
	if(rand == 1){
		var type = "damage";
	} else if (rand == 2){
		var type = "cooldown";
	} else if (rand == 3){
		var type = "speed";
	} else if (rand == 4){
		var type = "points";
	}
	var xCheck = Math.floor(Math.random()*50)*30;
	var yCheck = 0;
	while(level[parseInt(xCheck/30)][parseInt(yCheck/30)+1] == 0){
		yCheck += 30;
		if(yCheck == 24*30){
			xCheck = Math.floor(Math.random() * ((50*30)-30));
			yCheck = 0;
		}
		if(yCheck == 24*30){
			xCheck = Math.floor(Math.random() * ((50*30)-30));
			yCheck = 0;
		}
	}
	powerups.push({
		x:xCheck,
		y:yCheck,
		type:type
	});
}

function Upgrade(upgrade){
	var required = parseFloat(document.getElementById(upgrade+"Cost").innerHTML);
	if(points >= required && eval(upgrade) > 0){
		points -= required;
		required += Math.floor(required/2);
		document.getElementById(upgrade+"Cost").innerHTML = required;
		var buySound = new Audio("success.wav");
		if(upgrade == "damage"){
			damage += 5;
			powerupText = "+5 damage: " + damage + " total";
			document.getElementById(upgrade+"Cost").innerHTML = required;
			window.setTimeout(function(){
				powerupText = "";
			},5000);
		} else if(upgrade == "cooldown"){
			if(cooldown > 0){
				buySound.play();
				cooldown -= 100;
				powerupText = "-100 cooldown: " + cooldown + " total";
				window.setTimeout(function(){
					powerupText = "";
				},5000);
			}
		} else if(upgrade == "speed"){
			buySound.play();
			speed += 1;
			powerupText = "+1 speed: " + speed + " total";
			window.setTimeout(function(){
				powerupText = "";
			},5000);
		} else if(upgrade == "jump"){
			buySound.play();
			jumpHeight += 1;
			powerupText = "+1 jump height: " + jumpHeight + " total";
			window.setTimeout(function(){
				powerupText = "";
			},5000);
		}
	} else {
		var errorSound = new Audio("error.wav");
		errorSound.play();
	}
}

function checkTime(i) {
    if (i < 10){
		i = "0" + i
	};
    return i;
}

document.getElementById("chat").style.width="400px"
document.getElementById("chatInput").style.width="414px";

document.getElementById("chat").style.fontSize="13pt";

document.getElementById("chat").style.height="197px";
document.getElementById("chatInput").style.height="40px";

document.getElementById("chat").style.bottom="48px";
document.getElementById("chatInput").style.bottom="10px";
function ShowChat(){
	document.getElementById("chatHide").style.display="none";
	if(document.getElementById("chat").style.width!="400px"){
		document.getElementById("chat").style.width="400px";
		document.getElementById("chatInput").style.width="414px";

		document.getElementById("chat").style.fontSize="13pt";

		document.getElementById("chat").style.height="197px";
		document.getElementById("chatInput").style.height="40px";

		document.getElementById("chat").style.bottom="48px";
		document.getElementById("chatInput").style.bottom="10px";

		document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
	} else {
		document.getElementById("chat").style.width="35px";
		document.getElementById("chatInput").style.width="54px";

		document.getElementById("chat").style.fontSize="0";

		document.getElementById("chat").style.height="37px";
		document.getElementById("chatInput").style.height="0px";

		document.getElementById("chat").style.bottom="10px";
		document.getElementById("chatInput").style.bottom="-5px";
	}
}

function SendMessage(){
	var date = new Date;
	var seconds = date.getSeconds();
	var minutes = date.getMinutes();
	var hours = date.getHours();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	var time = hours + ":" + checkTime(minutes) + " " + ampm;
	
	var message = document.getElementById("chatInput").value;
	socket.emit('chat', {
		message: message,
		name: name,
		time: time,
		colour: colour
	});
	document.getElementById("chatInput").value = "";
}

function Update() {
	y = Math.round(y);
	x = Math.round(x);
	
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//pause
	if(paused && document.getElementById("gunSelect").style.opacity != ""){
		document.getElementById("pause").style.opacity = 1;
		document.getElementById("pause").style.pointerEvents = "all";
		canvas.style.pointerEvents = "none";
		canvas.style.filter = "blur(3px)";
		document.getElementById("overlay").style.opacity = "0.2";
	} else {
		document.getElementById("pause").style.opacity = 0;
		document.getElementById("pause").style.pointerEvents = "none";
		canvas.style.pointerEvents = "all";
		canvas.style.filter = "";
		document.getElementById("overlay").style.opacity = "0";
	}

	//left
    if(keys[65]) {
        //if (velX > -speed) {
		if(CheckX(-speed) != "left"){
			velX = -speed;
		} else {
			velX = 0;
		}
        //}
    }
	
	//right
    if (keys[68]) {
        //if (velX < speed) {
		if(CheckX(speed) != "right"){
			velX = speed;
		} else {
			velX = 0;
		}
        //}
    }
	
	//reset if none
    if (!keys[65] && !keys[68]){
		velX = 0;
    }
	
	//shoot left
    if (keys[37]){
		if(canShoot == true){// && level[Math.floor(x/30)-1][Math.floor(y/30)] == 0
			var shootSound = new Audio("shoot"+(Math.floor(Math.random() * 4) + 1)+".wav");
			shootSound.volume = 0.3;
			shootSound.play();
			bullets.push({
				id:id,
				direction:"left",
				x:x,
				y:y,
				latency:-latency, //remove later
				damage:damage,
				colour:colour,
				created:Date.now()
			});
			socket.emit('bullets', bullets[bullets.length-1]);
			canShoot = false;
			window.setTimeout(function(){
				canShoot = true;
			},cooldown);
		}
    }
	
	//shoot right
    if (keys[39]){
		if(canShoot == true){// && level[Math.floor(x/30)-1][Math.floor(y/30)] == 0
			var shootSound = new Audio("shoot"+(Math.floor(Math.random() * 4) + 1)+".wav");
			shootSound.volume = 0.3;
			shootSound.play();
			bullets.push({
				id:id,
				direction:"right",
				x:x+30,
				y:y,
				latency:latency, //remove later
				damage:damage,
				colour:colour,
				created:Date.now()
			});
			socket.emit('bullets', bullets[bullets.length-1]);
			canShoot = false;
			window.setTimeout(function(){
				canShoot = true;
			},cooldown);
		}
    }
	
	//pause hold tab
    if (keys[9]){
    	paused = true;
    }
	
	if(respawning == false){
		if(CheckY()){
			gravity = 0;
			jumps = 2;
		} else {
			gravity += 0.2;
			y += gravity;
		}
	}
	
	//velX *= friction;
	x += velX;
	var xNow = x;
	var yNow = y;
	window.setTimeout(function(){
		if(!respawning){
			xServer = xNow;
			yServer = yNow;
		}
	},latency);

	//sides and bottom
    if (x >= 1470-speed) {
        x = 1470-speed;
    } else if (x <= speed) {
        x = speed;
    }
	
    if (y >= 692) {
    	y = 691;
    	yServer = 691;
		console.log(respawning);
    	Hit("suicide");
    } else if (y <= 5) {
        y = 5;
        window.setTimeout(function(){
    		yServer = 5;
        },latency);
    }
	
	//update multiplayer players
	if(id != null){
		players[id] = {
			health:health,
			id:id,
			x:x,
			y:y,
			kills:kills,
			name:name,
			colour:colour,
			deaths:deaths,
			latency:latency,
			points:points
		};
		
		socket.emit('position', {
			id:id,
			x:x,
			y:y,
			health:health,
			kills:kills,
			name:name,
			colour:colour,
			deaths:deaths,
			latency:latency,
			points:points
		});
	}

	//---------------------------
	//---------rendering---------
	//---------------------------
	
	//bg
	/*
	ctx.fillStyle="rgba(255,255,255,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    */
	
	//blocks
	for(var xBlock=0;xBlock<level.length;xBlock++){
		for(var yBlock=0;yBlock<level[xBlock].length;yBlock++){
			if(level[xBlock][yBlock] == 1){
				if(blockPlacer[xBlock][yBlock] != null){
					var colourId = blockPlacer[xBlock][yBlock];
					if(players[colourId] != null){
						ctx.fillStyle = players[colourId].colour;
					} else {
						ctx.fillStyle = "#2ecc71";
					}
				} else {
					ctx.fillStyle = "#2ecc71";
				}
				ctx.fillRect(xBlock*30, yBlock*30, 30, 30);
				ctx.fill();
				//ctx.lineWidth = 5;
				//ctx.strokeStyle = "black";
				//ctx.stroke();

				/*
				if(blockPlacer[xBlock][yBlock] != null){
					ctx.globalAlpha = 0.3;
					ctx.textAlign="center";
					ctx.fillStyle = "#ecf0f1";
					ctx.font="14px Arial";
					var nameFromId = blockPlacer[xBlock][yBlock];
					ctx.fillText(players[nameFromId].name, xBlock*30+15, yBlock*30+20);
					ctx.fill();
					ctx.globalAlpha = 1;
					ctx.textAlign="start";
				}
				*/
			}
		}
	}

	//bullets
	for(var i=0;i<bullets.length;i++){
		//bullet collision
		for(var q=0;q<players.length;q++){
			if(players[q] != null && bullets[i] != undefined){
				var bulletX = Math.floor(bullets[i].x/30)
				var playerX = Math.floor(players[q].x/30);
				var bulletY = Math.floor(bullets[i].y/30)
				var playerY = Math.floor(players[q].y/30);
				
				if(playerX == bulletX && playerY == bulletY){
					if(bullets[i].id != q){//bullets[i].id is killer | q is dead
						var latencyDelay = (bullets[bullets.length-1].latency/(1000/60))*5;

						console.log(bullets[i].x-x<latencyDelay);

						if(q == id && players[q].health > 0 || bullets[i].x-x<latencyDelay){
							Hit(bullets[i].id,q,players[bullets[i].id].name,players[q].name,bullets[i].damage,i);
						}
						if(bullets[i] != null){
							bullets.splice(i, 1);
						}
					}
				}
			}
		}
		if(bullets[i] != undefined){
			ctx.fillStyle = bullets[i].colour;
			var bulletSize = bullets[i].damage/3.5;
			ctx.fillRect(bullets[i].x, bullets[i].y+15-bulletSize/2, 15, bulletSize);
			ctx.fill();
			if(bullets[i].direction == "left"){
				bullets[i].x -= 5;
			} else {
				bullets[i].x += 5;
			}
			if(level[parseInt((bullets[i].x)/30)][parseInt(bullets[i].y/30)] == 1 || bullets[i].x <= 1 || bullets[i].x >= 1500-15){
				bullets.splice(i, 1);
			}
		}
	}

	//powerups
	for(var i=0;i<powerups.length;i++){
		for(var q=0;q<players.length;q++){
			if(players[q] != null && powerups[i] != undefined){
				var powerupX = Math.floor(powerups[i].x/30)
				var playerX = Math.floor(players[q].x/30);
				var powerupY = Math.floor(powerups[i].y/30)
				var playerY = Math.floor(players[q].y/30);
				var playerXHigh = Math.ceil(players[q].x/30);
				var playerYHigh = Math.ceil(players[q].y/30);
				
				if(playerX == powerupX && playerY == powerupY || playerXHigh == powerupX && playerYHigh == powerupY){
					if(powerups[i].type == "damage"){
						damage += 50;
						powerupText = "+50 damage: " + damage + " total";
						window.setTimeout(function(){
							damage -= 50;
							powerupText = "";
						},5000);
					} else if(powerups[i].type == "cooldown"){
						cooldown -= 150;
						powerupText = "-150ms cooldown: " + (cooldown+150) + " -> " + cooldown;
						window.setTimeout(function(){
							cooldown += 150;
							powerupText = "";
						},5000);
					} else if(powerups[i].type == "speed"){
						speed += 2;
						jumpHeight += 1;
						powerupText = "faster speed: " + (speed-2) + " -> " + speed + "<br>jump higher: " + (jumpHeight-1) + " -> " + jumpHeight;
						window.setTimeout(function(){
							speed -= 2;
							jumpHeight -= 1;
							powerupText = "";
						},5000);
					} else if(powerups[i].type == "points"){
						points += 5;
						powerupText = "+2 points: " + (points-5) + " -> " + points;
					}
					powerups.splice(i, 1);
				}
			}
		}
		if(powerups[i] != undefined){
			if(powerups[i].type == "damage"){
				ctx.fillStyle = "red";
			} else if(powerups[i].type == "cooldown"){
				ctx.fillStyle = "blue";
			} else if(powerups[i].type == "speed"){
				ctx.fillStyle = "orange";
			} else if(powerups[i].type == "points"){
				ctx.fillStyle = "yellow";
			}
			ctx.arc(powerups[i].x+15,powerups[i].y+15,15,0,2*Math.PI);
			ctx.fill();
			ctx.beginPath();

			ctx.fillStyle = "black";
			ctx.textAlign="center";
			ctx.font="10px Verdana";
			ctx.fillText(powerups[i].type, powerups[i].x+15, powerups[i].y-7);
			ctx.fill();
			ctx.textAlign="start"; 
		}
	}

	//powerup text
	if(powerupText.length > 0){
		document.getElementById("powerup").innerHTML = powerupText;
		document.getElementById("powerup").style.opacity = 1;
	} else {
		if(document.getElementById("powerup").style.opacity == 1){
			document.getElementById("powerup").style.opacity = 0;
		}
	}

	//player lag shoot thing
	ctx.fillStyle = HexToRGB(colour,0.5);
	ctx.arc(xServer+30-16,yServer+30-16,8,0,2*Math.PI);
	ctx.fill();

	//player lag shoot thing line
	ctx.beginPath();
	ctx.strokeStyle = HexToRGB(colour,0.5);
	ctx.lineWidth = 1;
	ctx.moveTo(x+15,y+15);
	ctx.lineTo(xServer+14.5,yServer+14.5);
	ctx.stroke();
	ctx.beginPath();

	//player
	for(var i=0;i<players.length;i++){
		if(players[i] != null){
			ctx.fillStyle = players[i].colour;
			ctx.fillRect(players[i].x, players[i].y, 30, 30);
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.textAlign="center";
			ctx.font="10px Verdana";
			ctx.fillText(players[i].health, players[i].x+15, players[i].y+15);
			ctx.fill();
			ctx.textAlign="start"; 
		}
	}
	
	//name
	for(var i=0;i<players.length;i++){
		if(players[i] != null){
			ctx.fillStyle = "black";
			ctx.textAlign="center"; 
			ctx.font="10px Verdana";
			ctx.fillText(players[i].name, players[i].x+15, players[i].y-7);
			ctx.fill();
			ctx.textAlign="start"; 
		}
	}
	
	//hover
	if(clicks > 0){
		ctx.fillStyle = "black";
	} else {
		ctx.fillStyle = "red";
	}
	ctx.globalAlpha = 0.1;
	ctx.fillRect(hovered.x*30, hovered.y*30, 30, 30);
	ctx.fill();
	ctx.globalAlpha = 0.8;
	ctx.font="12px Arial";
	ctx.fillText(clicks + " remaining", hovered.x*30, hovered.y*30-5);
	ctx.fill();
	ctx.globalAlpha = 1;
	
	//id
	ctx.fillStyle = "black";
	ctx.font="20px Arial";
	ctx.fillText("id: " + id + " | name: " + name, 50, 50);
	ctx.fill();
	
	//killfeed
	var killfeedText = "";
	for(var i=0;i<killfeed.length;i++){
		killfeedText += killfeed[i] + "<br>";
	}
	document.getElementById("killfeed").innerHTML = killfeedText;
	
	//stats
	var table = "<table align='center' rules='cols'><tr>"
				//+ "<th>id</th>"
				+ "<th>name</th>"
				//+ "<th>hp</th>"
				//+ "<th>x</th>"
				//+ "<th>y</th>"
				+ "<th>kills</th>"
				+ "<th>deaths</th>"
				+ "<th>points</th>"
				+ "</tr>";

	for(var i=0;i<players.length;i++){
		if(players[i] != null){
			table += "<tr><td>"
					//+ players[i].id
					//+ "</td><td>"
					+ players[i].name
					+ "</td><td>"
					//+ players[i].health
					//+ "</td><td>"
					//+ Math.round(players[i].x)
					//+ "</td><td>"
					//+ Math.round(players[i].y)
					//+ "</td><td>"
					+ players[i].kills
					+ "</td><td>"
					+ players[i].deaths
					+ "</td><td>"
					+ players[i].points
					+ "</td></tr>";
		}
	}
	table += "</table>";
	document.getElementById("data").innerHTML = table;
	
    //requestAnimationFrame(Update);
	window.setTimeout(Update,1000/60);
}

window.addEventListener("beforeunload", function(){
	socket.emit('leave', id);
});

window.onblur = function() {
	drawing = false;
	erasing = false;
};

var drawing = false;
var erasing = false;
function Draw(x,y){
	if(level[parseInt(x/30)][parseInt(y/30)] == 0 && clicks > 0){
		blockPlacer[parseInt(x/30)][parseInt(y/30)] = id;
		level[parseInt(x/30)][parseInt(y/30)] = 1;
		clicks--;
		
		socket.emit('level', {
			level:level,
			blockPlacer:blockPlacer
		});
	}
}

function Erase(x,y){
	if(level[parseInt(x/30)][parseInt(y/30)] == 1 && clicks > 0){
		level[parseInt(x/30)][parseInt(y/30)] = 0;
		clicks--;
		
		socket.emit('level', {
			level:level,
			blockPlacer:blockPlacer
		});
	}
}

//get mouse
window.onresize = function(){
	canvas.width = document.body.offsetWidth;
	canvas.height = document.body.offsetHeight;
	scaleX = document.body.offsetWidth/canvas.width;
	scaleY = document.body.offsetHeight/canvas.height;
	scale = scaleY/scaleX;
};

var scaleX = document.body.offsetWidth/canvas.width,
	scaleY = document.body.offsetHeight/canvas.height,
	scale = scaleX/scaleY,
	errorSound = new Audio("error.wav");

canvas.addEventListener("mousedown",function(e){
	var x = (e.pageX - this.offsetLeft) / scale,
		y = (e.pageY - this.offsetTop) / scale;
	
	if(parseInt(x/30) < 50 && parseInt(y/30) < 25){
		if(e.button == 0){
			for(var i=0;i<players.length;i++){
				if(players[i] != null){
					if(Math.floor(x/30) == Math.floor(players[i].x/30) && Math.floor(y/30) == Math.floor(players[i].y/30) || Math.floor(x/30) == Math.ceil(players[i].x/30) && Math.floor(y/30) == Math.ceil(players[i].y/30)){
						errorSound.play();
					} else {
						drawing = true;
						Draw(x,y);
					}
				}
			}
		} else if (e.button == 2){
			erasing = true;
			Erase(x,y);
		}
	}
});

canvas.addEventListener("mouseup",function(e){
	drawing = false;
	erasing = false;
});

canvas.addEventListener("mousemove",function(e){
	var x = (e.pageX - this.offsetLeft) / scale,
		y = (e.pageY - this.offsetTop) / scale;

	hovered = {
		x:Math.floor(x/30),
		y:Math.floor(y/30)
	};

	if(parseInt(x/30) < 50 && parseInt(y/30) < 25){
		if(drawing){
			for(var i=0;i<players.length;i++){
				if(players[i] != null){
					if(Math.floor(x/30) == Math.floor(players[i].x/30) && Math.floor(y/30) == Math.floor(players[i].y/30) || Math.floor(x/30) == Math.ceil(players[i].x/30) && Math.floor(y/30) == Math.ceil(players[i].y/30)){
						if(errorSound.paused){
							errorSound.play();
						}
					} else {
						Draw(x,y);
					}
				}
			}
		}
		
		if(erasing){
			Erase(x,y);
		}
	}
});

window.setInterval(function(){
	clicks++;
},5000);

window.setInterval(function(){
	CreatePowerup();
},20000);