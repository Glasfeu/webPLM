package json.entity

import play.api.libs.json._
import play.api.libs.json.Json.toJsFieldJsValueWrapper
import plm.universe.turtles.Turtle

object TurtleToJson {
  def turtleWrite(turtle: Turtle): JsValue = {
    Json.obj(
      "x" -> turtle.getX,
      "y" -> turtle.getY,
      "color" -> List[Int](turtle.getColor.getRed, turtle.getColor.getGreen, turtle.getColor.getBlue, turtle.getColor.getAlpha),
      "heading" -> turtle.getHeading
    )
  }
}