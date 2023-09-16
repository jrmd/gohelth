package controllers

import (
	"fresh-perspectives/infra/database"
	"fresh-perspectives/models"
	"fresh-perspectives/repository"
	"github.com/gin-gonic/gin"
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
		category.ParentId = parentId
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

	if category.ID == "" {
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
		category.ParentId = parentId
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

	if category.ID == "" {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Not found!",
		})
		return
	}

	ctx.JSON(http.StatusOK, category)
}

func GetCategories(ctx *gin.Context) {
	const PerPage = 100
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)

	if err != nil {
		page = 1
	}

	var categories []models.Category
	database.DB.Limit(PerPage).Offset((page - 1) * PerPage).Order("created_at desc").Find(&categories)

	var category models.Category

	ctx.JSON(http.StatusOK, gin.H{
		"data":        categories,
		"maxPages":    math.Ceil(float64(category.Count()) / PerPage),
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

// plmmbn1380001lr4v80ml81kw, plmmbmz5u0000lr4vh6p8zjh6, plmmbmcyb0000lrzlzm22pvsp
