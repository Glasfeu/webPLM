package controllers

import javax.inject.Inject
import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.api.exceptions.ProviderException
import com.mohiva.play.silhouette.api.services.AuthInfoService
import com.mohiva.play.silhouette.impl.authenticators.JWTAuthenticator
import com.mohiva.play.silhouette.impl.providers._
import models.User
import models.services.UserService
import play.api.i18n.Messages
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json.Json
import play.api.mvc.Action
import scala.concurrent.Future
import akka.actor.ActorSystem
import actors.ActorsMap
import play.api.Logger
import utils.CookieUtils
import java.util.UUID
import utils.LangUtils
import play.api.i18n.Lang

/**
 * The social auth controller.
 *
 * @param env The Silhouette environment.
 */
class SocialAuthController @Inject() (
  val env: Environment[User, JWTAuthenticator],
  val userService: UserService)
  extends Silhouette[User, JWTAuthenticator] {

  /**
   * Authenticates a user against a social provider.
   *
   * @param provider The ID of the provider to authenticate against.
   * @return The result to display.
   */
  def authenticate(provider: String) = Action.async { implicit request =>
    var actorUUID: String = CookieUtils.getCookieValue(request, "actorUUID")
    if(actorUUID.isEmpty) {
      Unauthorized(Json.obj("message" -> Messages("could.not.authenticate")))
    }
    (env.providers.get(provider) match {
      case Some(p: SocialProvider with CommonSocialProfileBuilder) =>
        p.authenticate().flatMap {
          case Left(result) => Future.successful(result)
          case Right(authInfo) => 
            var preferredLang: Lang = LangUtils.getPreferredLang(request)
            for {
            profile <- p.retrieveProfile(authInfo)
            user <- userService.save(profile, None, Some(preferredLang))
            authenticator <- env.authenticatorService.create(user.loginInfo)
            token <- env.authenticatorService.init(authenticator)
            } yield {
            if(!userService.error) {
              ActorsMap.get(actorUUID) match {
                case Some(actor) =>
                  actor ! Json.obj(
                    "cmd" -> "signIn",
                    "user" -> user
                  )
                case _ =>
                  Logger.debug("Actor not found... Weird isn't it?")
              }
              env.eventBus.publish(LoginEvent(user, request, request2lang))
              Ok(Json.obj("token" -> token))
            }
            else {
              userService.setError(false)
              InternalServerError(Json.obj("error" -> "An error occurred while saving the user"))
            }
          }
        }
      case _ => Future.failed(new ProviderException(s"Cannot authenticate with unexpected social provider $provider"))
    }).recover {
      case e: ProviderException =>
        logger.error("Unexpected provider error", e)
        Unauthorized(Json.obj("message" -> Messages("could.not.authenticate")))
    }
  }
}
