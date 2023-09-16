package models

import (
	"fresh-perspectives/infra/database"
	"github.com/thechriswalker/puid"
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	ID        string `gorm:"primary_key"`
	Name      string
	ParentId  string     `gorm:"index"`
	Exercises []Exercise `gorm:"many2many:exercise_category"`
}

func (category *Category) BeforeCreate(scope *gorm.DB) error {
	if category.ID == "" {
		scope.Statement.SetColumn("ID", puid.New())
	}
	return nil
}

func (category *Category) Count() int64 {
	var result int64
	database.DB.Table("categories").Count(&result)

	return result
}

//plmma8lhe000288xnm6ue7sok,plmma8lhe000188xnshi9j1he
