package routes

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"text/template"

	"github.com/gorilla/mux"

	"../middleware"

	"../models"
	"../sessions"
	"../utils"
)

//NewRouter - the router for the website
func NewRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/", middleware.AuthRequired(indexGetHandler)).Methods("GET")
	r.HandleFunc("/", middleware.AuthRequired(indexPostHandler)).Methods("POST")
	r.HandleFunc("/login", loginGetHandler).Methods("GET")
	r.HandleFunc("/login", loginPostHandler).Methods("POST")
	r.HandleFunc("/register", registerGetHandler).Methods("GET")
	r.HandleFunc("/register", registerPostHandler).Methods("POST")
	r.HandleFunc("/application", applicationGetHandler).Methods("GET")
	r.HandleFunc("/profile", applicationGetHandler).Methods("GET")

	fsstyle := http.FileServer(http.Dir("./web/styles/"))
	r.PathPrefix("/web/styles/").Handler(http.StripPrefix("/web/styles/", fsstyle))

	//change with webpack
	fsjs := http.FileServer(http.Dir("./dist/"))
	r.PathPrefix("/dist/").Handler(http.StripPrefix("/dist/", fsjs))

	r.HandleFunc("/{username}",
		middleware.AuthRequired(userGetHandler)).Methods("Get")
	return r
}

func userGetHandler(w http.ResponseWriter, r *http.Request) {
	//vars := mux.Vars(r)
	//username := vars["username"]
	//user, err := models.GetUserByUsername(username)
	// if err != nil {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	w.Write([]byte("Internal server error"))
	// 	return
	// }
	// userID, err := user.GetID()
	// if err != nil {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	w.Write([]byte("Internal server error"))
	// 	return
	// }

	var allFiles []string
	files, err := ioutil.ReadDir("./web/templates")
	if err != nil {
		fmt.Println(err)
	}
	for _, file := range files {
		filename := file.Name()
		if strings.HasSuffix(filename, ".tmpl") {
			allFiles = append(allFiles, "./web/templates/"+filename)
		}
	}

	utils.ExecuteTemplateTmpl(w, "index.tmpl", "index", nil)

}

func indexGetHandler(w http.ResponseWriter, r *http.Request) {

	var allFiles []string
	files, err := ioutil.ReadDir("./web/templates")
	if err != nil {
		fmt.Println(err)
	}
	for _, file := range files {
		filename := file.Name()
		if strings.HasSuffix(filename, ".tmpl") {
			allFiles = append(allFiles, "./web/templates/"+filename)
		}
	}

	var templates *template.Template

	templates, err = template.ParseFiles(allFiles...)

	s2 := templates.Lookup("index.tmpl")
	s2.ExecuteTemplate(w, "index", nil)

}

func indexPostHandler(w http.ResponseWriter, r *http.Request) {
	// session, _ := sessions.Store.Get(r, "session")
	// untypedUserID := session.Values["user_id"]
	// userID, ok := untypedUserID.(int64)
	// if !ok {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	w.Write([]byte("Internal server error"))
	// 	return
	// }
	r.ParseForm()
	http.Redirect(w, r, "/", 302)
}

func loginGetHandler(w http.ResponseWriter, r *http.Request) {
	utils.ExecuteTemplate(w, "login.html", nil)
}

func loginPostHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := r.PostForm.Get("username")
	password := r.PostForm.Get("password")

	user, err := models.AuthenticateUser(username, password)
	if err != nil {
		switch err {
		case models.ErrUserNotFound:
			utils.ExecuteTemplate(w, "login.html", "unknown user")
		case models.ErrInvalidLogin:
			utils.ExecuteTemplate(w, "login.html", "invalid login")
		default:
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
		}
		return
	}
	userID, err := user.GetID()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal server error"))
		return
	}
	session, _ := sessions.Store.Get(r, "session")
	session.Values["user_id"] = userID
	session.Save(r, w)
	http.Redirect(w, r, "/", 302)
}

func registerGetHandler(w http.ResponseWriter, r *http.Request) {
	utils.ExecuteTemplate(w, "register.html", nil)
}

func registerPostHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := r.PostForm.Get("username")
	password := r.PostForm.Get("password")
	email := r.PostForm.Get("email")
	dateOfBirth := r.PostForm.Get("dateOfBirth")
	name := r.PostForm.Get("name")

	err := models.RegisterUser(username, password, email, dateOfBirth, name)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal server error: Unable to register user"))
		panic(err.Error())

	}
	http.Redirect(w, r, "/login", 302)
}

func applicationGetHandler(w http.ResponseWriter, r *http.Request) {
	utils.ExecuteTemplate(w, "application.html", nil)
}
