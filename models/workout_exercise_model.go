package models

import (
	"helth/infra/database"

	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
)

type WorkoutSet struct {
	Weight   float32
	Distance float32
	Time     string
}

type WorkoutExercise struct {
	database.Model
	WorkoutID  int64    `json:"workoutId"`
	Workout    Workout  `json:"-"`
	ExerciseID int64    `json:"exerciseId"`
	Exercise   Exercise `json:"exercise"`
	Sets       string   `json:"sets" gorm:"type:json;default:'[]';not null"`
	RestTime   string   `json:"restTime" gorm:"default:'01:00';not null"`
	Order      int      `json:"order"`
}

func (exercise *WorkoutExercise) BeforeCreate(scope *gorm.DB) error {
	if exercise.ID == 0 {
		scope.Statement.SetColumn("ID", snowflake.ID())
	}
	return nil
}
