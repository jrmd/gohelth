package routers

import (
	"fresh-perspectives/routers/middleware"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
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

	return router
}
