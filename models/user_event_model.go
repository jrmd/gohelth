package models

import (
	"helth/infra/database"
	"time"

	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
)

type UserEventType string

const (
	PASSWORD_RESET UserEventType = "PASSWORD_RESET"
	ACTIVATION     UserEventType = "ACCOUNT_ACTIVATION"
)

type UserEvent struct {
	database.Model
	UserID    int64
	User      User
	EventType UserEventType
	Token     string
	ExpiresIn time.Time
}

func (user *UserEvent) BeforeCreate(scope *gorm.DB) error {
	if user.ID == 0 {
		scope.Statement.SetColumn("ID", snowflake.ID())
	}
	scope.Statement.SetColumn("ExpiresIn", time.Now().Add(time.Hour*24))
	return nil
}
