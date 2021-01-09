package main

//Thank you to Davy Wybiral on youtube

import (
	"html/template"
	"net/http"
	"os"

	"./models"
	"./routes"
	"./utils"
)

var templates *template.Template

func main() {
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
