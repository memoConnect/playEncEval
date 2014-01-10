package controllers

import play.api.mvc._
import play.api.libs.json._
import models.Text
import scala.concurrent.ExecutionContext
import ExecutionContext.Implicits.global


object Application extends Controller {

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

  def staticAssets(path: String, file: String, foo: String) =
    controllers.Assets.at(path, file)
}