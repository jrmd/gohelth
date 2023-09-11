package routers

import (
	"fresh-perspectives/helpers"
	"github.com/gin-gonic/gin"
)

func RegisterAdminRoutes(route *gin.RouterGroup) {
	route.GET("/", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Hello",
		})
	})

	route.GET("/test", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Hello",
		})
	})
}
