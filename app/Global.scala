import play.api.GlobalSettings
import play.api.http.HeaderNames._
import play.api.mvc.EssentialAction
import scala.concurrent.ExecutionContext
import ExecutionContext.Implicits.global

/**
 * User: Björn Reimer
 * Date: 1/9/14
 * Time: 12:53 PM
 */

object Global extends GlobalSettings {

   // wrap action to modify the headers of every request
  override def doFilter(action: EssentialAction): EssentialAction = EssentialAction {
    request =>
      action.apply(request).map(_.withHeaders(ACCESS_CONTROL_ALLOW_METHODS -> "GET, POST, DELETE, PUT, OPTIONS",
        ACCESS_CONTROL_ALLOW_ORIGIN -> "*", ACCESS_CONTROL_ALLOW_HEADERS -> "Authorization, Content-type"))
  }
}
