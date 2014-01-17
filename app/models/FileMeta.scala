package models

import play.modules.reactivemongo.ReactiveMongoPlugin
import play.api.libs.json._
import scala.util.Random
import play.modules.reactivemongo.json.collection.JSONCollection
import play.api.Play.current

/**
 * User: Björn Reimer
 * Date: 1/15/14
 * Time: 10:51 AM
 */
case class FileMeta(
                     assetId: String,
                     chunks: JsObject,
                     fileName: String,
                     maxChunks: Int,
                     fileSize: Int,
                     fileType: String
                     )

object FileMeta {

  // mongo collection
  def col: JSONCollection = ReactiveMongoPlugin.db.collection[JSONCollection]("fileMeta")

  implicit val defaultFormat: Format[FileMeta] = Json.format[FileMeta]

}
