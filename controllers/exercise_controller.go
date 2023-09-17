package controllers

import (
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
	primaryMuscles := ctx.DefaultPostForm("primaryMuscles", "")
	secondaryMuscles := ctx.DefaultPostForm("secondaryMuscles", "")
	equipment := ctx.DefaultPostForm("equipment", "")
	mechanic := ctx.DefaultPostForm("mechanic", "")
	level := ctx.DefaultPostForm("level", "")
	force := ctx.DefaultPostForm("force", "")

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
	exercise.Equipment = equipment
	exercise.Mechanic = mechanic
	exercise.Level = level
	exercise.Force = force

	exercise.Instructions = instructions

	categoryIds := strings.Split(categories, ",")

	var Categories []models.Category

	database.DB.Find(&Categories, categoryIds)
	exercise.Categories = Categories

	primaryMusclesIds := strings.Split(primaryMuscles, ",")

	var PrimaryMuscles []models.Muscle

	database.DB.Find(&PrimaryMuscles, primaryMusclesIds)
	exercise.PrimaryMuscles = PrimaryMuscles

	secondaryMusclesIds := strings.Split(secondaryMuscles, ",")

	var SecondaryMuscles []models.Muscle

	database.DB.Find(&SecondaryMuscles, secondaryMusclesIds)
	exercise.SecondaryMuscles = SecondaryMuscles

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

	if exercise.ID == 0 {
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

	equipment := ctx.DefaultPostForm("equipment", "")
	mechanic := ctx.DefaultPostForm("mechanic", "")
	level := ctx.DefaultPostForm("level", "")
	force := ctx.DefaultPostForm("force", "")

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

	if equipment != "" {
		exercise.Equipment = equipment
	}

	if mechanic != "" {
		exercise.Mechanic = mechanic
	}

	if level != "" {
		exercise.Level = level
	}

	if force != "" {
		exercise.Force = force
	}

	err := database.DB.Save(exercise).Error

	categories := ctx.DefaultPostForm("categories", "")
	categoryIds := strings.Split(categories, ",")
	categoryIds = helpers.RemoveEmptyStrings(categoryIds)

	if err == nil && len(categoryIds) > 0 {
		var Categories []models.Category

		database.DB.Find(&Categories, categoryIds)
		err = database.DB.Model(&exercise).Association("Categories").Replace(Categories)
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Something went wrong whilst trying to save categories on the exercise",
		})
		return
	}

	primaryMuscles := ctx.DefaultPostForm("primaryMuscles", "")
	primaryMusclesIds := strings.Split(primaryMuscles, ",")
	primaryMusclesIds = helpers.RemoveEmptyStrings(primaryMusclesIds)

	if err == nil && len(primaryMusclesIds) > 0 {
		var PrimaryMuscles []models.Muscle
		database.DB.Find(&PrimaryMuscles, primaryMusclesIds)
		err = database.DB.Model(&exercise).Association("PrimaryMuscles").Replace(PrimaryMuscles)
	}

	secondaryMuscles := ctx.DefaultPostForm("secondaryMuscles", "")
	secondaryMusclesIds := strings.Split(secondaryMuscles, ",")
	secondaryMusclesIds = helpers.RemoveEmptyStrings(secondaryMusclesIds)

	if err == nil && len(secondaryMusclesIds) > 0 {
		var SecondaryMuscles []models.Muscle
		database.DB.Find(&SecondaryMuscles, secondaryMusclesIds)
		err = database.DB.Model(&exercise).Association("SecondaryMuscles").Replace(SecondaryMuscles)
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Something went wrong whilst trying to save categories on the exercise",
		})
		return
	}

	ctx.JSON(http.StatusOK, exercise)
}

func GetExercise(ctx *gin.Context) {
	id := ctx.Param("id")
	exercise := new(models.Exercise)
	database.DB.Preload("Categories").Preload("PrimaryMuscles").Preload("SecondaryMuscles").Where("id = ?", id).First(exercise)

	if exercise.ID == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Not found!",
		})
		return
	}

	ctx.JSON(http.StatusOK, exercise)
}

func GetExercises(ctx *gin.Context) {
	var PerPage float64 = 100
	pageStr := ctx.Query("page")
	name := ctx.Query("name")
	level := ctx.Query("level")
	machine := ctx.Query("machine")
	force := ctx.Query("force")
	equipment := ctx.Query("equipment")
	public := ctx.Query("public")
	mechanic := ctx.Query("mechanic")
	categories := ctx.Query("categories")
	categoryIds := strings.Split(categories, ",")
	categoryIds = helpers.RemoveEmptyStrings(categoryIds)

	primary := ctx.Query("primary")
	primaryIds := strings.Split(primary, ",")
	primaryIds = helpers.RemoveEmptyStrings(primaryIds)

	secondary := ctx.Query("secondary")
	secondaryIds := strings.Split(secondary, ",")
	secondaryIds = helpers.RemoveEmptyStrings(secondaryIds)

	page, err := strconv.Atoi(pageStr)

	if err != nil {
		page = 1
	}

	var exercises []models.Exercise

	db := database.DB.Preload("Categories").Preload("PrimaryMuscles").Preload("SecondaryMuscles").Model(&models.Exercise{})

	if name != "" {
		db.Where("name iLIKE ?", "%"+name+"%")
	}

	if level != "" {
		db.Where("level = ?", level)
	}

	if machine != "" {
		db.Where("machine = ?", machine)
	}

	if force != "" {
		db.Where("force = ?", force)
	}

	if equipment != "" {
		db.Where("equipment = ?", equipment)
	}

	if public != "" {
		db.Where("public = ?", public == "true")
	}

	if mechanic != "" {
		db.Where("mechanic = ?", mechanic)
	}

	if len(categoryIds) > 0 {
		db.Joins("inner join exercise_category ec on ec.exercise_id = exercises.id").
			Where("ec.category_id in ?", categoryIds)
	}

	if len(primaryIds) > 0 {
		db.Joins("inner join exercise_primary_muscle epm on epm.exercise_id = exercises.id").
			Where("epm.muscle_id in ?", primaryIds)
	}

	if len(secondaryIds) > 0 {
		db.Joins("inner join exercise_secondary_muscle esm on esm.exercise_id = exercises.id").
			Where("esm.muscle_id in ?", secondaryIds)
	}

	var count int64
	db.Count(&count)

	if page == -1 {
		db.Order("name asc").Find(&exercises)
	} else {
		db.Limit(int(PerPage)).Offset((page - 1) * int(PerPage)).Order("name asc").Find(&exercises)
	}

	var data []models.Exercise

	if count > 0 {
		data = exercises
	} else {
		data = make([]models.Exercise, 0)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":        data,
		"maxPages":    math.Ceil(float64(count) / PerPage),
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
