package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"helth/infra/database"
	"helth/models"
	"helth/repository"
	"math"
	"net/http"
	"strconv"
)

func CreateCategory(ctx *gin.Context) {
	name := ctx.DefaultPostForm("name", "")
	parentId := ctx.DefaultPostForm("parent", "")

	category := new(models.Category)
	category.Name = name

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
		category.ParentId = parent
	}

	err := repository.Save(category)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Something went wrong whilst trying to create the category",
		})
		return
	}

	ctx.JSON(http.StatusCreated, category)
}

func UpdateCategory(ctx *gin.Context) {
	id := ctx.Param("id")
	category := new(models.Category)
	database.DB.Where("id = ?", id).First(category)

	if category.ID == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Not found!",
		})
		return
	}

	name := ctx.DefaultPostForm("name", "")
	parentId := ctx.DefaultPostForm("parent", "")

	if name != "" {
		category.Name = name
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
		category.ParentId = parent
	}

	err := database.DB.Save(category).Error

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Something went wrong whilst trying to delete the category",
		})
		return
	}

	ctx.JSON(http.StatusOK, category)
}

func GetCategory(ctx *gin.Context) {
	id := ctx.Param("id")
	category := new(models.Category)
	database.DB.Where("id = ?", id).First(category)

	if category.ID == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Not found!",
		})
		return
	}

	ctx.JSON(http.StatusOK, category)
}

func GetCategories(ctx *gin.Context) {
	const PerPage = 20
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)

	if err != nil {
		page = 1
	}

	var categories []models.Category
	db := database.DB.Model(categories)

	var count int64
	db.Count(&count)

	db.Limit(PerPage).Offset((page - 1) * PerPage).Order("name asc").Find(&categories)

	fmt.Println(categories)

	ctx.JSON(http.StatusOK, gin.H{
		"data":        categories,
		"maxPages":    math.Ceil(float64(count) / PerPage),
		"currentPage": page,
	})
}

func DeleteCategory(ctx *gin.Context) {
	id := ctx.Param("id")
	category := new(models.Category)
	database.DB.Where("id = ?", id).First(category)

	err := database.DB.Delete(category).Error
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Something went wrong whilst trying to delete the category",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Category deleted",
	})
}
