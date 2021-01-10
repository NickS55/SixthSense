package main

//Thank you to Davy Wybiral on youtube

import (
	"html/template"
	"log"
	"net/http"
	"os"

	"./models"
	"./routes"
	"./sessions"
	"./utils"
)

var templates *template.Template

func main() {

	//check if session key exists, if not create a session cookie
	if os.Getenv("SESSION_KEY") == "" {
		log.Print("Session Key Not Found, creating Key (SESSION_KEY) Value (byte[32]) Pair")
		sessions.GenerateSessionCookie()

	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	models.Init()
	utils.LoadTemplates("templates/*.html")

	templates = template.Must(template.ParseGlob("templates/*.html"))

	r := routes.NewRouter()

	http.Handle("/", r)

	//fmt.Println(readCurDir(""))

	http.ListenAndServe(":"+port, nil)
}

// func sessionGetHandler(w http.ResponseWriter, r *http.Request) {
// 	session, _ := store.Get(r, "session")
// 	untyped, ok := session.Values["username"]
// 	if !ok {
// 		return
// 	}
// 	username, ok := untyped.(string)
// 	if !ok {
// 		return
// 	}
// 	w.Write([]byte(username))
// }
