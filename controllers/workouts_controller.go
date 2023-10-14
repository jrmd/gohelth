package controllers

import (
	"encoding/json"
	"fmt"
	"helth/infra/database"
	"helth/models"
	"helth/routers/middleware"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type ExerciseSet struct {
	Reps     int64   `json:"reps"`
	Distance float64 `json:"distance"`
	Weight   float64 `json:"weight"`
	Time     string  `json:"time"`
	Type     string  `json:"type"`
}

type WorkoutExercise struct {
	ID         int64         `json:"id,string"`
	ExerciseID int64         `json:"exerciseId,string"`
	Sets       []ExerciseSet `json:"sets"`
	RestTime   string        `json:"restTime"`
}

type Workout struct {
	ID        int64             `json:"id,string"`
	Name      string            `json:"name"`
	StartTime time.Time         `json:"startTime"`
	EndTime   time.Time         `json:"endTime"`
	Public    bool              `json:"public"`
	Exercises []WorkoutExercise `json:"exercises"`
}

func CreateWorkout(ctx *gin.Context) {
	user, authErr := middleware.GetUser(ctx)

	if authErr != nil {
		return
	}

	workout := new(Workout)
	err := ctx.BindJSON(&workout)

	if err != nil {
		ctx.JSON(400, gin.H{
			"status":  "error",
			"message": "bad request",
		})
		return
	}

	if workout.StartTime.Unix() < 0 {
		workout.StartTime = time.Now()
	}

	if workout.EndTime.Unix() < 0 {
		workout.EndTime = time.Now()
	}

	model := new(models.Workout)
	model.Name = workout.Name
	model.StartTime = workout.StartTime
	model.EndTime = workout.EndTime
	model.Public = workout.Public

	exercises := make([]models.WorkoutExercise, 0)

	for i, v := range workout.Exercises {
		sets, err := json.Marshal(v.Sets)

		if err != nil {
			continue
		}

		exercise := new(models.Exercise)

		database.DB.Model(models.Exercise{}).Where("id = ?", v.ExerciseID).Find(&exercise)
		fmt.Println(exercise)

		if exercise.ID == 0 {
			continue
		}
		exercises = append(exercises, models.WorkoutExercise{
			ExerciseID: v.ExerciseID,
			Sets:       string(sets),
			RestTime:   v.RestTime,
			Order:      i,
		})
	}

	model.Exercises = exercises

	model.UserID = strconv.FormatInt(user.ID, 10)

	database.DB.Model(models.Workout{}).Save(model)

	ctx.JSON(200, model)
}

func UpdateWorkout(ctx *gin.Context) {
	// user, authErr := middleware.GetUser(ctx)

	// if authErr != nil {
	// 	return
	// }

}

func DeleteWorkout(ctx *gin.Context) {}

func GetWorkout(ctx *gin.Context) {
	user, authErr := middleware.GetUser(ctx)

	if authErr != nil {
		return
	}

	id := ctx.Param("id")

	workout := models.Workout{}

	database.DB.Model(models.Workout{}).Preload("Exercises").Where("id = ?", id).Find(&workout)

	if workout.ID == 0 || (fmt.Sprint(user.ID) != workout.UserID && !workout.Public) {
		ctx.JSON(404, gin.H{
			"message": "not found sorry mate",
		})
		return
	}

	ctx.JSON(200, workout)
}

func GetWorkouts(ctx *gin.Context) {}
