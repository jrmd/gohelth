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
	ID          string     `gorm:"primary_key"`
	DisplayName string     `json:"displayName,omitempty"`
	Password    string     `json:"-" binding:"required"`
	Email       string     `gorm:"type:varchar(255);uniqueIndex" form:"email" json:"email,omitempty" binding:"required,email"`
	UserLevel   UserLevel  `json:"-"`
	UserStatus  UserStatus `json:"-"`
}

func (user *User) BeforeCreate(scope *gorm.DB) error {
	scope.Statement.SetColumn("ID", puid.New())
	return nil
}
