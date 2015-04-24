var Firebase = require("firebase");
var piblaster = require("pi-blaster.js"); // Import package
// get item id 
var item = process.env.ITEM

// reset servo
piblaster.setPwm(0, 0.1); // Sets servo on pin 22 to 0 %

// init firebase
var ref = new Firebase("https://hacker-news.firebaseio.com/v0/item/" + item);

var prevVoteCount;

// watch HN store for changes to item score
ref.child("score").on("value", function(snapshot) {
	// get new score from HN
	console.log(snapshot.val());
	var voteCount = snapshot.val();
	if (prevVoteCount) {
		// calc the change
		var voteDiff = voteCount - prevVoteCount;
		console.log("diff: " + voteDiff);

		var g = 0;
		// for every new point fire servo
	 	var repeater = setInterval(function () {
		  if (g < voteDiff) {
		  	console.log('gong!');
		    piblaster.setPwm(0, 0.9);
		  	setTimeout(function() {
		  		// reset servo
		  		piblaster.setPwm(0, 0.1);
		  	}, 500);
		    g += 1;
		  } 
		}, 1500);
	}
  	prevVoteCount = voteCount;
});