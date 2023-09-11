package helpers

import "github.com/gin-gonic/gin"

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func Page(ctx *gin.Context, code int, data *gin.H) {
	ctx.HTML(code, "index.html", data)
}
