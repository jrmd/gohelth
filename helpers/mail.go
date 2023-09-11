package helpers

import (
	"github.com/spf13/viper"
	"net/smtp"
)

/*

EMAIL_SERVER_USER
EMAIL_SERVER_PASSWORD
EMAIL_SERVER_HOST
EMAIL_SERVER_PORT
EMAIL_FROM
*/

func SendMail(to string, subject string, body string) error {
	user := viper.GetString("EMAIL_SERVER_USER")
	password := viper.GetString("EMAIL_SERVER_PASSWORD")
	host := viper.GetString("EMAIL_SERVER_HOST")
	port := viper.GetString("EMAIL_SERVER_PORT")
	//from := viper.GetString("EMAIL_FROM")

	auth := smtp.PlainAuth("", user, password, host)

	msg := []byte("To: " + to + "\r\n" +
		"From: " + user + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" + body + ".\r\n")

	return smtp.SendMail(host+":"+port, auth, user, []string{to}, msg)
}
