package models

import play.modules.reactivemongo.json.collection.JSONCollection
import play.modules.reactivemongo.ReactiveMongoPlugin
import play.api.libs.json.{Json, Format}
import play.api.Play.current

/**
 * User: Björn Reimer
 * Date: 1/15/14
 * Time: 11:59 AM
 */
case class FileChunk(
                      chunk: String
                      )

object FileChunk {

  // mongo collection
  def col: JSONCollection = ReactiveMongoPlugin.db.collection[JSONCollection]("fileChunks")

  implicit val defaultFormat: Format[FileChunk] = Json.format[FileChunk]

}
