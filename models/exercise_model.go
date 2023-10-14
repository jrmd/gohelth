package models

import (
	"helth/infra/database"

	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
)

type Exercise struct {
	gorm.Model
	ID               int64      `json:"id,string" gorm:"primary_key"`
	Name             string     `json:"name"`
	SupportsWeight   bool       `json:"supportsWeight"`
	SupportsTime     bool       `json:"supportsTime"`
	SupportsDistance bool       `json:"supportsDistance"`
	Instructions     string     `json:"instructions"`
	Public           bool       `json:"public"`
	Force            string     `json:"force"`
	Level            string     `json:"level"`
	Equipment        string     `json:"equipment"`
	Mechanic         string     `json:"mechanic"`
	UserID           int64      `json:"userId,string" gorm:"index"`
	Categories       []Category `json:"categories" gorm:"many2many:exercise_category"`
	PrimaryMuscles   []Muscle   `json:"primaryMuscles" gorm:"many2many:exercise_primary_muscle"`
	SecondaryMuscles []Muscle   `json:"secondaryMuscles" gorm:"many2many:exercise_secondary_muscle"`
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
