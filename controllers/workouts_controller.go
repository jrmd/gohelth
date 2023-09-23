package controllers

import (
	"github.com/gin-gonic/gin"
	"helth/models"
	"helth/routers/middleware"
	"time"
)

//type WorkoutExercise struct {
//}
//
//type Workout struct {
//	id   string
//	name string
//}

func CreateWorkout(ctx *gin.Context) {
	user, authErr := middleware.GetUser(ctx)

	if authErr != nil {
		return
	}

	workout := new(models.Workout)
	err := ctx.BindJSON(&workout)

	if err != nil {
		ctx.JSON(400, gin.H{
			"status":  "error",
			"message": "bad request",
		})
		return
	}

	if workout.StartTime.Unix() == 0 {
		workout.StartTime = time.Now()
	}

	if workout.EndTime.Unix() == 0 {
		workout.EndTime = time.Now()
	}

	workout.UserID = user.IO

	ctx.JSON(200, workout)
}

func UpdateWorkout(ctx *gin.Context) {}

func DeleteWorkout(ctx *gin.Context) {}

func GetWorkout(ctx *gin.Context) {}

func GetWorkouts(ctx *gin.Context) {}
