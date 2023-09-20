package controllers

import (
	"github.com/gin-gonic/gin"
	"helth/infra/database"
	"helth/models"
	"math"
	"net/http"
	"strconv"
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

func GetAllUsers(ctx *gin.Context) {
	var PerPage float64 = 100
	pageStr := ctx.Query("page")

	page, err := strconv.Atoi(pageStr)

	if err != nil {
		page = 1
	}

	db := database.DB.Model(&models.User{})

	var count int64
	db.Count(&count)

	var users []models.User

	if page == -1 {
		db.Order("created_at asc").Find(&users)
	} else {
		db.Limit(int(PerPage)).Offset((page - 1) * int(PerPage)).Order("created_at asc").Find(&users)
	}

	var data []models.User

	if count > 0 {
		data = users
	} else {
		data = make([]models.User, 0)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":        data,
		"maxPages":    math.Ceil(float64(count) / PerPage),
		"currentPage": page,
	})
}
