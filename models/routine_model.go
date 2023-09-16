package models

import (
	"fresh-perspectives/infra/database"
	"github.com/thechriswalker/puid"
	"gorm.io/gorm"
)

type Routine struct {
	gorm.Model
	ID        string `gorm:"primary_key"`
	Name      string
	Public    bool
	UserID    string
	Exercises []RoutineExercise
}

func (routine *Routine) BeforeCreate(scope *gorm.DB) error {
	if routine.ID == "" {
		scope.Statement.SetColumn("ID", puid.New())
	}
	return nil
}

func (routine *Routine) Count() int64 {
	var result int64
	database.DB.Table("routines").Count(&result)

	return result
}
