package models

import (
	"github.com/godruoyi/go-snowflake"
	"github.com/jackc/pgtype"
	"gorm.io/gorm"
)

type WorkoutSet struct {
	Weight   float32
	Distance float32
	Time     string
}

type WorkoutExercise struct {
	gorm.Model
	Name       string
	WorkoutID  int64
	Workout    Workout
	ExerciseID int64
	Exercise   Exercise
	Sets       pgtype.JSONB `gorm:"type:jsonb;default:'[]';not null"`
	RestTime   string       `gorm:"default:'01:00';not null"`
}

func (exercise *WorkoutExercise) BeforeCreate(scope *gorm.DB) error {
	if exercise.ID == 0 {
		scope.Statement.SetColumn("ID", snowflake.ID())
	}
	return nil
}
