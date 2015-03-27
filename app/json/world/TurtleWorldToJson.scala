package json.world

import play.api.libs.json._
import play.api.libs.json.Json.toJsFieldJsValueWrapper
import plm.universe.turtles.TurtleWorld
import plm.universe.turtles.SizeHint

object TurtleWorldToJson {
  
  def turtleWorldWrite(turtleWorld: TurtleWorld): JsValue = {
    var sizeHintsAsJson: JsArray = JsArray()
    turtleWorld.getSizeHints.toArray(Array[SizeHint]()).foreach { sizeHint: SizeHint => 
      sizeHintsAsJson.append(Json.obj(
        "x1" -> sizeHint.getX1,
        "x2" -> sizeHint.getX2,
        "y1" -> sizeHint.getY1,
        "y2" -> sizeHint.getY2,
        "text" -> sizeHint.getText
      ))
    }
    
    Json.obj(
      "type" -> "TurtleWorld",
      "width" -> turtleWorld.getWidth,
      "height" -> turtleWorld.getHeight,
      "sizeHints" -> sizeHintsAsJson
    )
  }
}