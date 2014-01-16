package controllers

import play.api.mvc._
import play.api.libs.json._
import models.{FileChunk, FileMeta, Text}
import scala.concurrent.{Future, ExecutionContext}
import ExecutionContext.Implicits.global
import play.modules.reactivemongo.MongoController
import reactivemongo.api.gridfs.GridFS
import scala.util.Random
import reactivemongo.bson.BSONObjectID
import play.api.Logger


object Application extends Controller with MongoController {

  def index = Action {
    Ok("moin")
  }

  def sendText = Action(parse.tolerantJson) {

    request => {
      request.body.validate[Text](Text.inputReads).fold(
        invalid = e => BadRequest(JsError.toFlatJson(e)),
        valid = t => {
          Text.col.insert(t)
          Ok(Json.toJson(t))
        }
      )
    }
  }

  def getText(id: String) = Action.async {
    request => {
      Text.col.find(Json.obj("id" -> id)).one[Text].map {
        case None => NotFound
        case Some(t) => Ok(Json.toJson(t))
      }
    }
  }

  def sendTextOptions = Action {
    request =>
      Ok("")
  }

  val gridFS = new GridFS(db)
  gridFS.ensureIndex()

  def sendFile = Action(parse.tolerantJson(512 * 1024)) {
    request =>

      val assetId = String.valueOf(Random.nextInt(1000000))
      val fileName = request.headers.get("X-File-Name")
      val maxChunks = request.headers.get("X-Max-Chunks")
      val fileSize = request.headers.get("X-File-Size")
      val chunkIndex = request.headers.get("X-Index").get

      if (fileName.isEmpty || maxChunks.isEmpty || fileSize.isEmpty) {
        BadRequest("Header information missing.")
      }
      else {

        val objectId = BSONObjectID.generate.stringify
        val objJson = Json.obj("_id" -> Json.obj("$oid" -> objectId))

        val fileMeta = new FileMeta(assetId, Json.obj(chunkIndex -> objectId), fileName.get, Integer.parseInt(maxChunks.get), Integer.parseInt(fileSize.get))

        request.body.validate[FileChunk].map {
          chunk =>
            val c = Json.toJson(chunk).as[JsObject] ++ objJson
            FileChunk.col.insert(c)
        }.recoverTotal(e => BadRequest(JsError.toFlatJson(e)))

        FileMeta.col.insert(fileMeta)
        Ok(Json.toJson(fileMeta))
      }
  }

  def sendFileChunks(assetId: String) = Action.async(parse.tolerantJson(512 * 1024)) {
    request => {
      val fileName = request.headers.get("X-File-Name")
      val maxChunks = request.headers.get("X-Max-Chunks")
      val fileSize = request.headers.get("X-File-Size")
      val chunkIndex = request.headers.get("X-Index").get

      val objectId = BSONObjectID.generate.stringify
      val objJson = Json.obj("_id" -> Json.obj("$oid" -> objectId))

      if (fileName.isEmpty || maxChunks.isEmpty || fileSize.isEmpty) {
        Future.successful(BadRequest("Header information missing."))
      } else {
        FileMeta.col.find(Json.obj("assetId" -> assetId)).one[FileMeta].map {
          case None => NotFound("Invalid assetId")
          case Some(fileMeta) => {
            request.body.validate[FileChunk].map {
              chunk =>
                val c = Json.toJson(chunk).as[JsObject] ++ objJson
                FileChunk.col.insert(c)

                val query = Json.obj("assetId" -> assetId)
                val set = Json.obj("$set" -> Json.obj("chunks." + chunkIndex -> objectId))

              Logger.debug(set.toString())

                FileMeta.col.update(query, set)
                Ok(Json.obj("assetId" -> assetId))
            }.recoverTotal(e => BadRequest(JsError.toFlatJson(e)))
          }
        }
      }
    }
  }

  def getFile(assetId: String) = Action.async {
    request =>
      FileMeta.col.find(Json.obj("assetId" -> assetId)).one[FileMeta].map {
        case None => NotFound("Invalid assetId")
        case Some(fileMeta) => {
          Ok(Json.toJson(fileMeta))
        }
      }

  }

  def getFileChunk(assetId: String, chunkIndex: String) = Action.async {
    request =>
      FileMeta.col.find(Json.obj("assetId" -> assetId)).one[FileMeta].flatMap {
        case None => Future(NotFound("Invalid assetId"))

        case Some(fileMeta) => {

          val oid = (fileMeta.chunks \ chunkIndex).asOpt[String].getOrElse("")

          FileChunk.col.find(Json.obj("_id" -> Json.obj("$oid" -> oid))).one[FileChunk].map {
            case None => NotFound("invalid oid")
            case Some(chunk) =>
              Ok(Json.toJson(chunk))
          }
        }
      }
  }

  def staticAssets(path: String, file: String, foo: String) =
    controllers.Assets.at(path, file)
}