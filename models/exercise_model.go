package models

import (
	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
	"helth/infra/database"
)

type Exercise struct {
	gorm.Model
	ID               int64 `json:",string" gorm:"primary_key"`
	Name             string
	SupportsWeight   bool
	SupportsTime     bool
	SupportsDistance bool
	Instructions     string
	Public           bool
	Force            string
	Level            string
	Equipment        string
	Mechanic         string
	UserID           int64      `gorm:"index"`
	Categories       []Category `gorm:"many2many:exercise_category"`
	PrimaryMuscles   []Muscle   `gorm:"many2many:exercise_primary_muscle"`
	SecondaryMuscles []Muscle   `gorm:"many2many:exercise_secondary_muscle"`
}

func (exercise *Exercise) BeforeCreate(scope *gorm.DB) error {
	if exercise.ID == 0 {
		scope.Statement.SetColumn("ID", snowflake.ID())
	}
	return nil
}

func (exercise *Exercise) Count() int64 {
	var result int64
	database.DB.Table("exercises").Count(&result)

	return result
}
