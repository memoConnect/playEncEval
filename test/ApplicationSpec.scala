import org.specs2.mutable._
import org.specs2.runner._
import org.junit.runner._

import play.api.libs.json.Json
import play.api.test._
import play.api.test.Helpers._

/**
 * Add your spec here.
 * You can mock out a whole application including requests, plugins etc.
 * For more information, consult the wiki.
 */
@RunWith(classOf[JUnitRunner])
class ApplicationSpec extends Specification {

  "Application" should {

    var id = ""

    "render the index page" in new WithApplication{
      val home = route(FakeRequest(GET, "/")).get

      status(home) must equalTo(OK)
      contentType(home) must beSome.which(_ == "text/html")
      contentAsString(home) must contain ("moin")
    }

    "receive Text" in new WithApplication {

      val json = Json.obj("text" -> "abcdef")

      val req = FakeRequest(POST, "/sendText").withJsonBody(json)
      val res = route(req).get

      val idOpt = (contentAsJson(res) \ "id").asOpt[String]

      idOpt must not beEmpty

      id = idOpt.getOrElse("")
    }

    "get Text" in new WithApplication {

      val req = FakeRequest(GET, "/getText/" + id)
      val res = route(req).get

      (contentAsJson(res) \ "text").as[String] must equalTo("abcdef")

    }
  }
}
