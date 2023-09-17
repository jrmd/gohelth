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
		&models.Exercise{},
		&models.Muscle{},
		&models.Category{},
		&models.Workout{},
		&models.WorkoutExercise{},
		&models.Routine{},
		&models.RoutineExercise{},
	}

	err := database.DB.AutoMigrate(migrationModels...)
	if err != nil {
		return
	}
}
