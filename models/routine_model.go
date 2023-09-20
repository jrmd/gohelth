package models

import (
	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
	"helth/infra/database"
)

type Routine struct {
	gorm.Model
	ID        int64 `json:",string" gorm:"primary_key"`
	Name      string
	Public    bool
	UserID    string
	Exercises []RoutineExercise
}

func (routine *Routine) BeforeCreate(scope *gorm.DB) error {
	if routine.ID == 0 {
		scope.Statement.SetColumn("ID", snowflake.ID())
	}
	return nil
}

func (routine *Routine) Count() int64 {
	var result int64
	database.DB.Table("routines").Count(&result)

	return result
}
