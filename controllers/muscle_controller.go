package controllers

import (
	"github.com/gin-gonic/gin"
	"helth/infra/database"
	"helth/models"
	"helth/repository"
	"math"
	"net/http"
	"strconv"
)

func CreateMuscle(ctx *gin.Context) {
	name := ctx.DefaultPostForm("name", "")
	parentId := ctx.DefaultPostForm("parent", "")

	muscle := new(models.Muscle)
	muscle.Name = name

	if name == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Name is required",
		})
		return
	}

	if parentId != "" {
		parent, err := strconv.ParseInt(parentId, 10, 64)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Invalid Parent ID",
			})
			return
		}
		muscle.ParentId = parent
	}

	err := repository.Save(muscle)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Something went wrong whilst trying to create the muscle",
		})
		return
	}

	ctx.JSON(http.StatusCreated, muscle)
}

func UpdateMuscle(ctx *gin.Context) {
	id := ctx.Param("id")
	muscle := new(models.Muscle)
	database.DB.Where("id = ?", id).First(muscle)

	if muscle.ID == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Not found!",
		})
		return
	}

	name := ctx.DefaultPostForm("name", "")
	parentId := ctx.DefaultPostForm("parent", "")

	if name != "" {
		muscle.Name = name
	}

	if parentId != "" {
		parent, err := strconv.ParseInt(parentId, 10, 64)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Invalid Parent ID",
			})
			return
		}
		muscle.ParentId = parent
	}

	err := database.DB.Save(muscle).Error

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Something went wrong whilst trying to delete the muscle",
		})
		return
	}

	ctx.JSON(http.StatusOK, muscle)
}

func GetMuscle(ctx *gin.Context) {
	id := ctx.Param("id")
	muscle := new(models.Muscle)
	database.DB.Where("id = ?", id).First(muscle)

	if muscle.ID == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Not found!",
		})
		return
	}

	ctx.JSON(http.StatusOK, muscle)
}

func GetMuscles(ctx *gin.Context) {
	const PerPage = 100
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)

	if err != nil {
		page = 1
	}

	var muscles []models.Muscle
	database.DB.Limit(PerPage).Offset((page - 1) * PerPage).Order("name asc").Find(&muscles)

	var muscle models.Muscle

	ctx.JSON(http.StatusOK, gin.H{
		"data":        muscles,
		"maxPages":    math.Ceil(float64(muscle.Count()) / PerPage),
		"currentPage": page,
	})
}

func DeleteMuscle(ctx *gin.Context) {
	id := ctx.Param("id")
	muscle := new(models.Muscle)
	database.DB.Where("id = ?", id).First(muscle)

	err := database.DB.Delete(muscle).Error
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Something went wrong whilst trying to delete the muscle",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Muscle deleted",
	})
}
