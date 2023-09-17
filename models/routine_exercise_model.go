package models

import (
	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
)

type RoutineExercise struct {
	gorm.Model
	ID         int64 `json:",string" gorm:"primary_key"`
	Name       string
	RoutineID  int64
	Routine    Routine
	ExerciseID int64
	Exercise   Exercise
	Sets       int
	Reps       int
	RestTime   string `gorm:"default:'01:00';not null"`
}

func (exercise *RoutineExercise) BeforeCreate(scope *gorm.DB) error {
	if exercise.ID == 0 {
		scope.Statement.SetColumn("ID", snowflake.ID())
	}
	return nil
}
