package controllers

import (
	"fresh-perspectives/models"
	"github.com/gin-gonic/gin"
)

func GetStatistics(ctx *gin.Context) {
	category := models.Category{}
	exercise := models.Exercise{}
	routine := models.Routine{}
	workout := models.Workout{}
	user := models.User{}
	
	ctx.JSON(200, gin.H{
		"categories": category.Count(),
		"exercises":  exercise.Count(),
		"routines":   routine.Count(),
		"workouts":   workout.Count(),
		"users":      user.Count(),
	})
}
