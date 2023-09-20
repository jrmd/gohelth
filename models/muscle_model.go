package models

import (
	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
	"helth/infra/database"
)

type Muscle struct {
	gorm.Model
	ID int64 `json:",string" gorm:"primary_key"`

	Name     string
	ParentId int64 `gorm:"index"`
}

func (muscle *Muscle) BeforeCreate(scope *gorm.DB) error {
	if muscle.ID == 0 {
		scope.Statement.SetColumn("ID", snowflake.ID())
	}
	return nil
}

func (muscle *Muscle) Count() int64 {
	var result int64
	database.DB.Table("muscles").Count(&result)

	return result
}
