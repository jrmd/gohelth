package models

import (
	"github.com/thechriswalker/puid"
	"gorm.io/gorm"
)

type UserLevel string
type UserStatus string

const (
	ADMIN UserLevel = "ADMIN"
	USER  UserLevel = "USER"
)

const (
	ACTIVE  UserStatus = "ACTIVE"
	PENDING UserStatus = "PENDING"
)

type User struct {
	gorm.Model
	ID         string `gorm:"primary_key"`
	FirstName  string `form:"first_name" json:"first_name,omitempty"`
	LastName   string `form:"last_name" json:"last_name,omitempty"`
	Password   string `form:"password" json:"password" binding:"required"`
	Email      string `gorm:"type:varchar(110);uniqueIndex" form:"email" json:"email,omitempty" binding:"required,email"`
	UserLevel  UserLevel
	UserStatus UserStatus
	Events     []UserEvent
}

func (user *User) BeforeCreate(scope *gorm.DB) error {
	scope.Statement.SetColumn("ID", puid.WithPrefix("user:").New())
	return nil
}
