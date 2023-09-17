package models

import (
	"fresh-perspectives/infra/database"
	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Name      string
	ParentId  int64      `gorm:"index"`
	Exercises []Exercise `gorm:"many2many:exercise_category"`
}

func (category *Category) BeforeCreate(scope *gorm.DB) error {
	if category.ID == 0 {
		scope.Statement.SetColumn("ID", snowflake.ID())
	}
	return nil
}

func (category *Category) Count() int64 {
	var result int64
	database.DB.Table("categories").Count(&result)

	return result
}
