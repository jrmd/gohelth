package routers

import (
	"github.com/gin-gonic/gin"
	"helth/helpers"
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
	route.GET("/categories/import", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Categories",
		})
	})
	route.GET("/muscles", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Muscles",
		})
	})
	route.GET("/muscles/import", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Muscles",
		})
	})
	route.GET("/exercises", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Exercises",
		})
	})
	route.GET("/exercises/import", func(ctx *gin.Context) {
		helpers.Page(ctx, 200, &gin.H{
			"title": "Exercises",
		})
	})
}
