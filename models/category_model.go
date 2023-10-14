package models

import (
	"fmt"
	"helth/infra/database"

	"github.com/godruoyi/go-snowflake"
	"gorm.io/gorm"
)

type Category struct {
	database.Model
	Name      string     `json:"name"`
	ParentId  int64      `json:"parentId" gorm:"index"`
	Exercises []Exercise `json:"exercises" gorm:"many2many:exercise_category"`
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
