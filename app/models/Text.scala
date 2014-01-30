package models

import scala.util.Random
import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.Play.current
import play.modules.reactivemongo.json.collection.JSONCollection
import play.modules.reactivemongo.ReactiveMongoPlugin

/**
 * User: Björn Reimer
 * Date: 1/9/14
 * Time: 12:07 PM
 */
case class Text(
                 id: String,
                 text: JsString
                 )


object Text {

  // mongo collection
  def col: JSONCollection = ReactiveMongoPlugin.db.collection[JSONCollection]("text")

  def inputReads: Reads[Text] = {
    (
      Reads.pure[String](Random.nextInt(10000).toString) and
        (__ \ 'text).read[JsString]
      )(Text.apply _)
  }

  implicit val defaultFormat: Format[Text] = Json.format[Text]

}