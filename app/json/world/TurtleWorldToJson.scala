package json.world

import play.api.libs.json._
import play.api.libs.json.Json.toJsFieldJsValueWrapper
import plm.universe.turtles.TurtleWorld

object TurtleWorldToJson {
  
  def turtleWorldWrite(turtleWorld: TurtleWorld): JsValue = {
    Json.obj(
      "type" -> "TurtleWorld",
      "width" -> turtleWorld.getWidth,
      "height" -> turtleWorld.getHeight
    )
  }
}