(function(){
	'use strict';
	
	angular
		.module('PLMApp')
		.factory('ChangeTurtleHeading', ChangeTurtleHeading);
	
	function ChangeTurtleHeading () {
		
		var ChangeTurtleHeading = function (data) {
			this.turtleID = data.turtleID;
			this.newHeading = data.newHeading;
			this.msg = data.msg;
			this.firstApply = true;
		};
		
		ChangeTurtleHeading.prototype.apply = function (currentWorld) {
			var turtle = currentWorld.getEntity(this.turtleID);
			turtle.heading = this.newHeading;
			if(this.firstApply) {
				var obj = {
					step: currentWorld.steps.length,
					msg: this.msg
				};
				currentWorld.steps.push(obj);
				this.firstApply = false;
			}
		};

		return ChangeTurtleHeading;
	}
})();