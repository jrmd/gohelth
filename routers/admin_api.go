package routers

import (
	"github.com/gin-gonic/gin"
	"helth/controllers"
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

	route.GET("/muscle/:id", controllers.GetMuscle)
	route.PUT("/muscle", controllers.CreateMuscle)
	route.DELETE("/muscle/:id", controllers.DeleteMuscle)
	route.PATCH("/muscle/:id", controllers.UpdateMuscle)

	route.GET("/users", controllers.GetAllUsers)

	route.GET("/stats", controllers.GetStatistics)
}
