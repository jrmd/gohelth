package routers

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"helth/routers/middleware"
)

func SetupRoute() *gin.Engine {

	environment := viper.GetBool("DEBUG")
	if environment {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)

	}

	allowedHosts := viper.GetString("ALLOWED_HOSTS")
	router := gin.New()
	router.SetTrustedProxies([]string{allowedHosts})
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware())

	router.Use(static.Serve("/assets", static.LocalFile("./frontend/dist/assets", false)))
	router.LoadHTMLFiles("./frontend/dist/index.html")

	store := cookie.NewStore([]byte(viper.GetString("SECRET")))
	router.Use(sessions.Sessions(viper.GetString("SESSION_NAME"), store))

	RegisterRoutes(router) //routes register
	RegisterUserApiRoutes(router.Group("/api/v1/", middleware.RequireLoggedIn))
	RegisterAdminRoutes(router.Group("/admin", middleware.RequireAdmin))
	RegisterAdminApiRoutes(router.Group("/api/v1/admin", middleware.RequireAdmin))
	return router
}
