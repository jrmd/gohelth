package models

import (
	"helth/infra/database"
	"time"

	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
)

type Workout struct {
	database.Model
	Name      string            `json:"name"`
	StartTime time.Time         `json:"startTime"`
	EndTime   time.Time         `json:"endTime"`
	Public    bool              `json:"public"`
	UserID    string            `json:"userId"`
	User      User              `json:"user"`
	Exercises []WorkoutExercise `json:"exercises"`
}

func (workout *Workout) BeforeCreate(scope *gorm.DB) error {
	if workout.ID == 0 {
		scope.Statement.SetColumn("ID", snowflake.ID())
	}
	return nil
}

func (workout *Workout) Count() int64 {
	var result int64
	database.DB.Table("workouts").Count(&result)

	return result
}
