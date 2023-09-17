package controllers

import (
	"errors"
	"fmt"
	"fresh-perspectives/helpers"
	"fresh-perspectives/infra/database"
	"fresh-perspectives/models"
	"fresh-perspectives/repository"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"strconv"
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

	if maybeUser.ID != 0 {
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

	token, err := helpers.GenerateRandomString(64)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error":  "something went wrong",
		})
	}

	userEvent := new(models.UserEvent)
	userEvent.UserID = int64(user.ID)
	userEvent.EventType = models.ACTIVATION
	userEvent.Token = token

	repository.Save(userEvent)

	err = helpers.SendMail(email, "Activate your account!", "Activate it here: http://localhost:8000/auth/activate/"+strconv.Itoa(int(user.ID))+"/"+userEvent.Token)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Something went wrong!",
		})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func ActivateUser(id string, token string) (*models.User, error) {
	if id == "" || token == "" {
		return nil, errors.New("invalid_params")
	}

	userId, err := strconv.ParseInt(id, 10, 64)

	if err != nil {
		return nil, errors.New("invalid_userid")
	}

	user := new(models.User)
	database.DB.Where("id = ?", userId).First(user)

	userEvent := new(models.UserEvent)
	database.
		DB.
		Where("user_id = ?", userId).
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

	if user.ID == 0 {
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

	if user.ID == 0 {
		ctx.JSON(http.StatusForbidden, gin.H{
			"status": "error",
			"error":  "not_allowed",
		})
		return
	}

	ctx.JSON(http.StatusOK, user)
}
