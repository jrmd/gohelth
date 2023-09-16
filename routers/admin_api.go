package routers

import (
	"fresh-perspectives/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterAdminApiRoutes(route *gin.RouterGroup) {
	route.GET("/category/:id", controllers.GetCategory)
	route.PUT("/category", controllers.CreateCategory)
	route.DELETE("/category/:id", controllers.DeleteCategory)
	route.PATCH("/category/:id", controllers.UpdateCategory)

	route.GET("/exercise/:id", controllers.GetExercise)
	route.PUT("/exercise", controllers.CreateExercise)
	route.DELETE("/exercise/:id", controllers.DeleteExercise)
	route.PATCH("/exercise/:id", controllers.UpdateExercise)
}
