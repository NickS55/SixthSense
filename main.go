package main

//Thank you to Davy Wybiral on youtube

import (
	"html/template"
	"log"
	"net/http"
	"os"

	"./models"
	"./routes"
	"./utils"
)

var templates *template.Template

func main() {

	//check if session key exists, if not create a session cookie
	if os.Getenv("SESSION_KEY") == "" {
		log.Print("Session Key Not Found, creating Key (SESSION_KEY) Value (byte[64]) Pair")
		log.Fatal("Run script 'cookieKeyGenerator' to create SESSION_KEY in enviromental variable ")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	models.Init()
	utils.LoadTemplates("web/Templates/*.html")

	templates = template.Must(template.ParseGlob("web/Templates/*.html"))

	r := routes.NewRouter()

	http.Handle("/", r)

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

// func readCurDir(path string) [50]string {
// 	file, err := os.Open("./" + path)
// 	if err != nil {
// 		log.Fatalf("failed opening directory: %s", err)
// 	}
// 	defer file.Close()

// 	list, _ := file.Readdirnames(0) // 0 to read all files and folders

// 	fileNum := 0
// 	files := [50]string{}
// 	for _, name := range list {
// 		files[fileNum] = name
// 		fileNum++
// 	}
// 	return files
// }
