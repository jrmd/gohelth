package main

import (
	"fresh-perspectives/config"
	"fresh-perspectives/infra/database"
	"fresh-perspectives/infra/logger"
	"fresh-perspectives/models"
	"github.com/godruoyi/go-snowflake"
	"github.com/spf13/viper"
	"gorm.io/gen"
	"time"
)

func main() {

	//set timezone
	viper.SetDefault("SERVER_TIMEZONE", "Europe/London")
	loc, _ := time.LoadLocation(viper.GetString("SERVER_TIMEZONE"))
	time.Local = loc
	snowflake.SetMachineID(snowflake.PrivateIPToMachineID())

	if err := config.SetupConfig(); err != nil {
		logger.Fatalf("config SetupConfig() error: %s", err)
	}
	masterDSN, replicaDSN := config.DbConfiguration()

	if err := database.DbConnection(masterDSN, replicaDSN); err != nil {
		logger.Fatalf("database DbConnection error: %s", err)
	}

	g := gen.NewGenerator(gen.Config{
		OutPath: "../query",
		Mode:    gen.WithoutContext | gen.WithDefaultQuery | gen.WithQueryInterface, // generate mode
	})

	g.UseDB(database.DB) // reuse your gorm db

	g.ApplyBasic(models.User{})
	g.ApplyBasic(models.UserEvent{})
	g.ApplyBasic(models.Exercise{})
	g.ApplyBasic(models.Routine{})
	g.ApplyBasic(models.RoutineExercise{})
	g.ApplyBasic(models.Workout{})
	g.ApplyBasic(models.WorkoutExercise{})
	g.ApplyBasic(models.Muscle{})
	g.ApplyBasic(models.Category{})

	g.Execute()
}
