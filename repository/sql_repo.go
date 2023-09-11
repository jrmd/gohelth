package repository

import (
	"fresh-perspectives/infra/database"
	"fresh-perspectives/infra/logger"
)

func Save(model interface{}) error {
	err := database.DB.Create(model).Error

	if err != nil {
		logger.Errorf("error, not save data %v", err)
	}
	return err
}

func Get(model interface{}) interface{} {
	err := database.DB.Find(model).Error
	return err
}

func GetOne(model interface{}) interface{} {
	err := database.DB.Last(model).Error
	return err
}

func Update(model interface{}) interface{} {
	err := database.DB.Find(model).Error
	return err
}
