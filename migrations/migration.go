package migrations

import (
	"fresh-perspectives/infra/database"
	"fresh-perspectives/models"
)

// Migrate Add list of model add for migrations
// TODO later separate migration each models
func Migrate() {
	var migrationModels = []interface{}{
		&models.User{},
		&models.UserEvent{},
	}

	err := database.DB.AutoMigrate(migrationModels...)
	if err != nil {
		return
	}
}
