package routers

import (
	"fresh-perspectives/controllers"
	"fresh-perspectives/helpers"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"net/http"
)

// RegisterRoutes add all routing list here automatically get main router
func RegisterRoutes(route *gin.Engine) {
	route.NoRoute(func(ctx *gin.Context) {
		ctx.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Route Not Found"})
	})

	route.GET("/api/v1/health", func(ctx *gin.Context) { ctx.JSON(http.StatusOK, gin.H{"live": "ok"}) })

	route.POST("/api/v1/auth/sign-up", controllers.SignUp)
	route.POST("/api/v1/auth/sign-in", controllers.SignIn)
	route.POST("/api/v1/auth/sign-out", controllers.SignOut)
	route.GET("/api/v1/auth/me", controllers.GetCurrentUser)

	route.POST("/api/v1/users", controllers.SearchUsers)

	route.GET("/api/v1/user", controllers.GetCurrentUser)
	route.GET("/api/v1/user/settings", controllers.GetSettings)
	route.POST("/api/v1/user", controllers.UpdateProfile)
	route.POST("/api/v1/user/settings", controllers.UpdateSettings)

	route.GET("/", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Home",
		})
	})

	route.GET("/auth/activate/error", func(ctx *gin.Context) {
		helpers.Page(ctx, 400, &gin.H{
			"title": "Activation failed",
		})
	})
	route.GET("/auth/activate/success", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Activation success",
		})
	})
	route.GET("/auth/activate/:user/:token", controllers.ActivateUserPage)
	route.GET("/auth/sign-in", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Sign In",
		})
	})
	route.GET("/auth/sign-out", func(ctx *gin.Context) {
		session := sessions.Default(ctx)
		session.Delete("user")
		session.Save()

		ctx.Redirect(302, "/")
	})

	route.NoRoute(func(ctx *gin.Context) {
		helpers.Page(ctx, 404, &gin.H{
			"title": "Not Found",
		})
	})
}
