(function(){
	'use strict';
	
	angular
		.module('PLMApp')
		.factory('MoveTurtle', MoveTurtle);
	
	function MoveTurtle () {
		
		var MoveTurtle = function (data) {
			this.turtleID = data.turtleID;
			this.newX = data.newX;
			this.newY = data.newY;
			this.msg = data.msg;
			this.firstApply = true;
		};
		
		MoveTurtle.prototype.apply = function (currentWorld) {
			var turtle = currentWorld.getEntity(this.turtleID);
			turtle.x = this.newX;
			turtle.y = this.newY;
			if(this.firstApply) {
				var obj = {
					step: currentWorld.steps.length,
					msg: this.msg
				};
				currentWorld.steps.push(obj);
				this.firstApply = false;
			}
		};

		return MoveTurtle;
	}
})();