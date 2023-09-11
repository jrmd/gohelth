package controllers

import (
	"crypto/rand"
	"errors"
	"fmt"
	"fresh-perspectives/helpers"
	"fresh-perspectives/infra/database"
	"fresh-perspectives/models"
	"fresh-perspectives/repository"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"github.com/thechriswalker/puid"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"strings"
)

func SignUp(ctx *gin.Context) {
	user := new(models.User)
	email := ctx.DefaultPostForm("email", "")
	password := ctx.DefaultPostForm("password", "")

	if email == "" || password == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error":  "Email and password is required",
		})
		return
	}

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(password), viper.GetInt("HASH_COST"))

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error":  "something went wrong",
		})
	}

	maybeUser := new(models.User)
	database.DB.Where("email = ?", email).First(maybeUser)

	fmt.Println(maybeUser)

	if maybeUser.ID != "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error":  "User already exists",
		})
		return
	}

	user.Email = email
	user.Password = string(hashedPass)
	user.UserLevel = models.USER
	user.UserStatus = models.PENDING

	userErr := repository.Save(user)

	if userErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error":  "something went wrong",
		})
	}

	token := make([]byte, 64)
	_, err = rand.Read(token)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error":  "something went wrong",
		})
	}

	userEvent := new(models.UserEvent)
	userEvent.UserID = user.ID
	userEvent.EventType = models.ACTIVATION
	userEvent.Token = puid.Cuid().New()

	repository.Save(userEvent)

	idWithOutPrefix, _ := strings.CutPrefix(user.ID, "user:")

	err = helpers.SendMail(email, "Activate your account!", "Activate it here: http://localhost:8000/auth/activate/"+idWithOutPrefix+"/"+userEvent.Token)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Something went wrong!",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"id":        user.ID,
		"email":     user.Email,
		"level":     user.UserLevel,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
	})
}

func ActivateUser(id string, token string) (*models.User, error) {
	if id == "" || token == "" {
		return nil, errors.New("invalid_params")
	}

	user := new(models.User)
	database.DB.Where("id = ?", id).First(user)

	userEvent := new(models.UserEvent)
	database.
		DB.
		Where("user_id = ?", id).
		Where("event_type = ?", models.ACTIVATION).
		First(userEvent)

	if userEvent.Token != token {
		return nil, errors.New("invalid_token")
	}

	database.DB.Delete(userEvent)
	user.UserStatus = models.ACTIVE

	database.DB.Save(&user)

	return user, nil
}

func ActivateUserPage(ctx *gin.Context) {
	user := ctx.Param("user")
	token := ctx.Param("token")
	_, err := ActivateUser(user, token)

	if err != nil {
		ctx.Redirect(302, "/auth/activate/error?error="+err.Error())
		return
	}

	ctx.Redirect(302, "/auth/activate/success")
}

func SignIn(ctx *gin.Context) {
	user := new(models.User)
	email := ctx.DefaultPostForm("email", "")
	password := ctx.DefaultPostForm("password", "")

	if email == "" || password == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error":  "Email and password is required",
		})
		return
	}

	database.DB.Where("email = ?", email).First(user)

	if user.ID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error":  "Invalid username or password",
		})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error":  "Invalid username or password",
		})
		return
	}
	session := sessions.Default(ctx)

	session.Set("user", user.ID)
	err = session.Save()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error":  "something went wrong",
		})
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Success! You have successfully logged in",
	})
}

func SignOut(ctx *gin.Context) {
	session := sessions.Default(ctx)
	session.Delete("user")
	err := session.Save()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error":  "something went wrong",
		})
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Success! You have successfully logged out",
	})
}

func GetCurrentUser(ctx *gin.Context) {
	var user = new(models.User)
	session := sessions.Default(ctx)

	fmt.Println(session.Get("user"))

	if session.Get("user") == nil {
		ctx.JSON(http.StatusForbidden, gin.H{
			"status": "error",
			"error":  "not_allowed",
		})
		return
	}

	database.DB.Where("id = ?", session.Get("user")).First(user)

	ctx.JSON(http.StatusOK, gin.H{
		"id":        user.ID,
		"email":     user.Email,
		"level":     user.UserLevel,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
	})
}
