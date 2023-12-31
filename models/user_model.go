package models

import (
	"helth/infra/database"

	"github.com/godruoyi/go-snowflake"
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
	database.Model
	DisplayName string     `json:"displayName,omitempty"`
	Password    string     `json:"-"`
	Email       string     `gorm:"type:varchar(255);uniqueIndex" form:"email" json:"email,omitempty"`
	UserLevel   UserLevel  `json:"userLevel"`
	UserStatus  UserStatus `json:"userStatus"`
	Workouts    []Workout
	Routines    []Routine
}

func (user *User) BeforeCreate(scope *gorm.DB) error {
	if user.ID == 0 {
		scope.Statement.SetColumn("ID", snowflake.ID())
	}
	return nil
}

func (user *User) Count() int64 {
	var result int64
	database.DB.Table("users").Count(&result)

	return result
}
