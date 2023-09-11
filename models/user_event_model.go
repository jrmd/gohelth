package models

import (
	"github.com/thechriswalker/puid"
	"gorm.io/gorm"
	"time"
)

type UserEventType string

const (
	PASSWORD_RESET UserEventType = "PASSWORD_RESET"
	ACTIVATION     UserEventType = "ACCOUNT_ACTIVATION"
)

type UserEvent struct {
	gorm.Model
	ID        string `gorm:"primary_key"`
	UserID    string
	User      User
	EventType UserEventType
	Token     string
	ExpiresIn time.Time
}

func (user *UserEvent) BeforeCreate(scope *gorm.DB) error {
	scope.Statement.SetColumn("ID", puid.New())
	scope.Statement.SetColumn("ExpiresIn", time.Now().Add(time.Hour*24))
	return nil
}
