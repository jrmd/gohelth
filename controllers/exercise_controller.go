package controllers

import (
	"fmt"
	"fresh-perspectives/helpers"
	"fresh-perspectives/infra/database"
	"fresh-perspectives/models"
	"github.com/gin-gonic/gin"
	"math"
	"net/http"
	"strconv"
	"strings"
)

func CreateExercise(ctx *gin.Context) {
	name := ctx.DefaultPostForm("name", "")
	supportsWeight := ctx.DefaultPostForm("supportsWeight", "")
	supportsTime := ctx.DefaultPostForm("supportsTime", "")
	supportsDistance := ctx.DefaultPostForm("supportsDistance", "")
	instructions := ctx.DefaultPostForm("instructions", "")
	public := ctx.DefaultPostForm("public", "")
	categories := ctx.DefaultPostForm("categories", "")

	if name == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Name is required",
		})
	}

	exercise := new(models.Exercise)
	exercise.Name = name

	exercise.SupportsTime = supportsTime == "true"
	exercise.SupportsWeight = supportsWeight == "true"
	exercise.SupportsDistance = supportsDistance == "true"
	exercise.Public = public == "true"

	exercise.Instructions = instructions

	categoryIds := strings.Split(categories, ",")

	var Categories []models.Category

	database.DB.Find(&Categories, categoryIds)
	exercise.Categories = Categories

	err := database.DB.Create(&exercise).Error

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Something went wrong whilst trying to create the exercise",
		})
		return
	}

	ctx.JSON(http.StatusCreated, exercise)
}

func UpdateExercise(ctx *gin.Context) {
	id := ctx.Param("id")
	exercise := new(models.Exercise)
	database.DB.Where("id = ?", id).First(exercise)

	if exercise.ID == "" {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Not found!",
		})
		return
	}

	name := ctx.DefaultPostForm("name", "")
	supportsWeight := ctx.DefaultPostForm("supportsWeight", "")
	supportsTime := ctx.DefaultPostForm("supportsTime", "")
	supportsDistance := ctx.DefaultPostForm("supportsDistance", "")
	instructions := ctx.DefaultPostForm("instructions", "")
	public := ctx.DefaultPostForm("public", "")
	categories := ctx.DefaultPostForm("categories", "")

	categoryIds := strings.Split(categories, ",")
	categoryIds = helpers.RemoveEmptyStrings(categoryIds)

	fmt.Println(categoryIds)

	if name != "" {
		exercise.Name = name
	}

	if supportsTime != "" {
		exercise.SupportsTime = supportsTime == "true"
	}

	if supportsWeight != "" {
		exercise.SupportsWeight = supportsWeight == "true"
	}

	if supportsDistance != "" {
		exercise.SupportsDistance = supportsDistance == "true"
	}

	if public != "" {
		exercise.Public = public == "true"
	}

	if instructions != "" {
		exercise.Instructions = instructions
	}

	err := database.DB.Save(exercise).Error

	if err == nil && len(categoryIds) > 0 {
		fmt.Println("here?!", len(categoryIds))
		var Categories []models.Category

		database.DB.Find(&Categories, categoryIds)
		fmt.Println("here?!", Categories)
		err = database.DB.Model(&exercise).Association("Categories").Replace(Categories)
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Something went wrong whilst trying to delete the exercise",
		})
		return
	}

	ctx.JSON(http.StatusOK, exercise)
}

func GetExercise(ctx *gin.Context) {
	id := ctx.Param("id")
	exercise := new(models.Exercise)
	database.DB.Preload("Categories").Where("id = ?", id).First(exercise)

	if exercise.ID == "" {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Not found!",
		})
		return
	}

	ctx.JSON(http.StatusOK, exercise)
}

func GetExercises(ctx *gin.Context) {
	const PerPage = 10
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)

	if err != nil {
		page = 1
	}

	var exercises []models.Exercise
	database.DB.Preload("Categories").Limit(PerPage).Offset((page - 1) * PerPage).Order("created_at desc").Find(&exercises)

	var exercise models.Exercise

	ctx.JSON(http.StatusOK, gin.H{
		"data":        exercises,
		"maxPages":    math.Ceil(float64(exercise.Count()) / PerPage),
		"currentPage": page,
	})
}

func DeleteExercise(ctx *gin.Context) {
	id := ctx.Param("id")
	exercise := new(models.Exercise)
	database.DB.Where("id = ?", id).First(exercise)

	err := database.DB.Delete(exercise).Error
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Something went wrong whilst trying to delete the exercise",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Exercise deleted",
	})
}
