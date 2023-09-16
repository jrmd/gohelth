package routers

import (
	"fresh-perspectives/helpers"
	"github.com/gin-gonic/gin"
)

func RegisterAdminRoutes(route *gin.RouterGroup) {
	route.GET("/", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Admin Dashboard",
		})
	})

	route.GET("/categories", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Categories",
		})
	})
	route.GET("/exercises", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Exercises",
		})
	})
}
