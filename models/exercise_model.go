package models

import (
	"fresh-perspectives/infra/database"
	"github.com/thechriswalker/puid"
	"gorm.io/gorm"
)

type Exercise struct {
	gorm.Model
	ID               string `gorm:"primary_key"`
	Name             string
	SupportsWeight   bool
	SupportsTime     bool
	SupportsDistance bool
	Instructions     string
	Public           bool
	Categories       []Category `gorm:"many2many:exercise_category"`
}

func (exercise *Exercise) BeforeCreate(scope *gorm.DB) error {
	if exercise.ID == "" {
		scope.Statement.SetColumn("ID", puid.New())
	}
	return nil
}

func (exercise *Exercise) Count() int64 {
	var result int64
	database.DB.Table("exercises").Count(&result)

	return result
}
