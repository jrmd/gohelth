package routers

import (
	"github.com/gin-gonic/gin"
	"helth/controllers"
)

func RegisterUserApiRoutes(route *gin.RouterGroup) {
	route.GET("/user", controllers.GetCurrentUser)
	route.GET("/user/settings", controllers.GetSettings)
	route.POST("/user", controllers.UpdateProfile)
	route.POST("/user/settings", controllers.UpdateSettings)

	route.GET("/auth/me", controllers.GetCurrentUser)

	route.GET("/category", controllers.GetCategories)
	route.GET("/exercise", controllers.GetMyExercises)
	route.GET("/muscles", controllers.GetMuscles)

	route.GET("/exercise/:id", controllers.GetExercise)
	route.PUT("/exercise", controllers.CreateExercise)
	route.DELETE("/exercise/:id", controllers.DeleteExercise)
	route.PATCH("/exercise/:id", controllers.UpdateExercise)

}
