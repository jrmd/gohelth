package models

import (
	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
	"helth/infra/database"
	"time"
)

type Workout struct {
	gorm.Model
	ID        int64 `json:",string" gorm:"primary_key"`
	Name      string
	StartTime time.Time
	EndTime   time.Time
	Public    bool
	UserID    string
	User      User
	Exercises []WorkoutExercise
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
