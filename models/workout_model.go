package models

import (
	"fresh-perspectives/infra/database"
	"github.com/thechriswalker/puid"
	"gorm.io/gorm"
	"time"
)

type Workout struct {
	gorm.Model
	ID        string `gorm:"primary_key"`
	Name      string
	StartTime time.Time
	EndTime   time.Time
	Public    bool
	UserID    string
	User      User
	Exercises []WorkoutExercise
}

func (workout *Workout) BeforeCreate(scope *gorm.DB) error {
	if workout.ID == "" {
		scope.Statement.SetColumn("ID", puid.New())
	}
	return nil
}

func (workout *Workout) Count() int64 {
	var result int64
	database.DB.Table("workouts").Count(&result)

	return result
}
