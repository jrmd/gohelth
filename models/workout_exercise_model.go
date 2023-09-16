package models

import (
	"github.com/jackc/pgtype"
	"github.com/thechriswalker/puid"
	"gorm.io/gorm"
)

type WorkoutSet struct {
	Weight   float32
	Distance float32
	Time     string
}

type WorkoutExercise struct {
	gorm.Model
	ID         string `gorm:"primary_key"`
	Name       string
	WorkoutID  string
	Workout    Workout
	ExerciseID string
	Exercise   Exercise
	Sets       pgtype.JSONB `gorm:"type:jsonb;default:'[]';not null"`
	RestTime   string       `gorm:"default:'01:00';not null"`
}

func (exercise *WorkoutExercise) BeforeCreate(scope *gorm.DB) error {
	if exercise.ID == "" {
		scope.Statement.SetColumn("ID", puid.New())
	}
	return nil
}
