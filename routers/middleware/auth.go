package middleware

import (
	"errors"
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"helth/infra/database"
	"helth/models"
)

func GetUser(ctx *gin.Context) (*models.User, error) {
	var user = new(models.User)
	session := sessions.Default(ctx)

	fmt.Println(session.Get("user"))

	if session.Get("user") == nil {
		return nil, errors.New("not_logged_in")
	}

	database.DB.Where("id = ?", session.Get("user")).First(user)

	return user, nil
}

func RequireAdmin(ctx *gin.Context) {
	user, err := GetUser(ctx)

	if err != nil {
		ctx.Redirect(302, "/auth/sign-in")
		ctx.Abort()
		return
	}

	if user.UserLevel != "ADMIN" {
		ctx.Redirect(302, "/unauthorized")
		ctx.Abort()
		return
	}

	ctx.Next()
}

func RequireLoggedIn(ctx *gin.Context) {
	_, err := GetUser(ctx)

	if err != nil {
		ctx.Redirect(302, "/auth/sign-in")
		return
	}

	ctx.Next()
}
