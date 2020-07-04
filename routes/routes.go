package routes

import (
	"net/http"

	"../middleware"
	"../models"
	"../sessions"
	"../utils"

	"github.com/gorilla/mux"
)

//NewRouter - is a new router
func NewRouter() *mux.Router {
	r := mux.NewRouter()
	//index
	r.HandleFunc("/", middleware.AuthRequired(indexGetHandler)).Methods("GET")
	r.HandleFunc("/", middleware.AuthRequired(indexPostHandler)).Methods("POST")

	//login
	r.HandleFunc("/login", loginGetHandler).Methods("GET")
	r.HandleFunc("/login", loginPostHandler).Methods("POST")

	//register new users
	r.HandleFunc("/register", registerGetHandler).Methods("GET")
	r.HandleFunc("/register", registerPostHandler).Methods("POST")

	fs := http.FileServer(http.Dir("./styles/"))
	r.PathPrefix("/styles/").Handler(http.StripPrefix("/styles/", fs))

	return r

}

func indexGetHandler(w http.ResponseWriter, r *http.Request) {
	comments, err := models.GetComments()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Sever Error"))
		return
	}
	utils.ExecuteTemplate(w, "index.html", comments)
}

func indexPostHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	comment := r.PostForm.Get("comment")
	err := models.PostComments(comment)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Sever Error"))
		return
	}
	http.Redirect(w, r, "/", 302)
}

func loginGetHandler(w http.ResponseWriter, r *http.Request) {
	utils.ExecuteTemplate(w, "login.html", nil)
}

func loginPostHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := r.PostForm.Get("username")
	password := r.PostForm.Get("password")
	err := models.AuthenticateUser(username, password)
	if err != nil {
		switch err {
		case models.ErrUserNotFound:
			utils.ExecuteTemplate(w, "login.html", "User Not Found")
		case models.ErrInvalidLogin:
			utils.ExecuteTemplate(w, "login.html", "Invalid Password")
		default:
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal Sever Error"))
		}
	}
	session, _ := sessions.Store.Get(r, "session")
	session.Values["username"] = username
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
	err := models.RegisterUser(username, password)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("internal server error"))
		return
	}
	http.Redirect(w, r, "/login", 302)

}
