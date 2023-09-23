package models

import (
	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
)

type WorkoutSet struct {
	Weight   float32
	Distance float32
	Time     string
}

type WorkoutExercise struct {
	gorm.Model
	ID         int64 `json:",string" gorm:"primary_key"`
	Name       string
	WorkoutID  int64
	Workout    Workout
	ExerciseID int64
	Exercise   Exercise
	Sets       string `gorm:"type:json;default:'[]';not null"`
	RestTime   string `gorm:"default:'01:00';not null"`
	Order      int
}

func (exercise *WorkoutExercise) BeforeCreate(scope *gorm.DB) error {
	if exercise.ID == 0 {
		scope.Statement.SetColumn("ID", snowflake.ID())
	}
	return nil
}
