(function(){
	'use strict';
	
	angular
		.module('PLMApp')
		.factory('AddLine', AddLine);
	
	function AddLine () {
		
		var AddLine = function (data) {
			this.turtleID = data.turtleID;
			this.x1 = data.x1;
			this.x2 = data.x2;
			this.y1 = data.y1;
			this.y2 = data.y2;
			this.color = data.color;
			this.msg = data.msg;
			this.firstApply = true;
		};
		
		AddLine.prototype.apply = function (currentWorld) {
			currentWorld.addShape({
				type: "line",
				x1: this.x1,
				x2: this.x2,
				y1: this.y1,
				y2: this.y2,
				color: this.color
			});
			if(this.firstApply) {
				var obj = {
					step: currentWorld.steps.length,
					msg: this.msg
				};
				currentWorld.steps.push(obj);
				this.firstApply = false;
			}
		};

		return AddLine;
	}
})();