(function(){
	'use strict';
	
	angular
		.module('PLMApp')
		.factory('AddCircle', AddCircle);
	
	function AddCircle () {
		
		var AddCircle = function (data) {
			this.x = data.x;
			this.y = data.y;
			this.radius = data.radius;
			this.color = data.color;
			this.msg = data.msg;
			this.firstApply = true;
		};
		
		AddCircle.prototype.apply = function (currentWorld) {
			currentWorld.addShape({
				type: "circle",
				x: this.x,
				y: this.y,
				radius: this.radius,
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

		return AddCircle;
	}
})();