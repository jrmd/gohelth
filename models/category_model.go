package models

import (
	"fmt"
	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
	"helth/infra/database"
)

type Category struct {
	gorm.Model
	ID        int64 `json:",string" gorm:"primary_key"`
	Name      string
	ParentId  int64      `gorm:"index"`
	Exercises []Exercise `gorm:"many2many:exercise_category"`
}

func (category *Category) BeforeCreate(scope *gorm.DB) error {
	fmt.Println(category)
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
