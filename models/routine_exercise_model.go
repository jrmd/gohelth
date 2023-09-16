package models

import (
	"github.com/thechriswalker/puid"
	"gorm.io/gorm"
)

type RoutineExercise struct {
	gorm.Model
	ID         string `gorm:"primary_key"`
	Name       string
	RoutineID  string
	Routine    Routine
	ExerciseID string
	Exercise   Exercise
	Sets       int
	Reps       int
	RestTime   string `gorm:"default:'01:00';not null"`
}

func (exercise *RoutineExercise) BeforeCreate(scope *gorm.DB) error {
	if exercise.ID == "" {
		scope.Statement.SetColumn("ID", puid.New())
	}
	return nil
}
