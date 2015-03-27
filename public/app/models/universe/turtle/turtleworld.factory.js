(function(){
	'use strict';
	
	angular
		.module('PLMApp')
		.factory('TurtleWorld', TurtleWorld);
	
	TurtleWorld.$inject = ['Turtle', 'MoveTurtle', 'ChangeTurtleHeading', 'AddLine', 'AddCircle'];
	
	function TurtleWorld (Turtle, MoveTurtle, ChangeTurtleHeading, AddLine, AddCircle) {
		
		var TurtleWorld = function (world) {
			this.type = world.type;
			this.width = world.width;
			this.height = world.height;
			this.operations = [];
			this.currentState = -1;
			this.steps = [];
			this.shapes = [];

			this.sizeHints = world.sizeHints;
			
			this.entities = {};
			for(var turtleID in world.entities) {
				if(world.entities.hasOwnProperty(turtleID)) {
					var turtle = world.entities[turtleID];
					this.entities[turtleID] = new Turtle(turtle);
				}	
			}
		};
		
		TurtleWorld.prototype.clone = function () {
			return new TurtleWorld(this);
		};
		
		TurtleWorld.prototype.getEntity = function (entityID) {
			return this.entities[entityID];
		};

		Turtle.prototype.addShape = function (shape) {
			this.shapes.push(shape);
		}

		TurtleWorld.prototype.addOperations = function (operations) {
			var step = [];
			for(var i=0; i<operations.length; i++) {
				var operation = operations[i];
				var generatedOperation = this.generateOperation(operation);
				step.push(generatedOperation);
			}
			this.operations.push(step);
		};

		TurtleWorld.prototype.setState = function (state) {
			var i, j;
			var step;
			if(state < this.operations.length && state >= -1) {
				this.shapes = [];
				for(i=0; i<=state; i++) {
					step = this.operations[i];
					for(j=0; j<step.length; j++) {
						step[j].apply(this);
					}
				}
				this.currentState = state;
			}
		};
		
		TurtleWorld.prototype.generateOperation = function (operation) {
			switch(operation.type) {
				case 'moveTurtleOperation':
					return new MoveTurtle(operation);
				case 'changeTurtleDirection':
					return new ChangeTurtleHeading(operation);
				case 'addLine':
					return new AddLine(operation);
				case 'addCircle':
					return new AddCircle(operation);
			}
		};
		
		return TurtleWorld;
	}
})();