package main

//Thank you to Davy Wybiral on youtube

import (
	"context"
	"html/template"
	"net/http"
	"os"

	"golang.org/x/crypto/bcrypt"

	"github.com/go-redis/redis"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

var templates *template.Template
var store = sessions.NewCookieStore([]byte("hello")) //learn about how to secure cookies
var client *redis.Client

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	client = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	templates = template.Must(template.ParseGlob("templates/*.html"))

	r := mux.NewRouter()
	//index
	r.HandleFunc("/", indexGetHandler).Methods("GET")
	r.HandleFunc("/", indexPostHandler).Methods("POST")

	//login
	r.HandleFunc("/login", loginGetHandler).Methods("GET")
	r.HandleFunc("/login", loginPostHandler).Methods("POST")

	//register new users
	r.HandleFunc("/register", registerGetHandler).Methods("GET")
	r.HandleFunc("/register", registerPostHandler).Methods("POST")

	fs := http.FileServer(http.Dir("./styles/"))
	r.PathPrefix("/styles/").Handler(http.StripPrefix("/styles/", fs))

	http.Handle("/", r)

	//fmt.Println(readCurDir(""))

	http.ListenAndServe(":"+port, nil)
}

func indexGetHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session")
	_, ok := session.Values["username"]
	if !ok {
		http.Redirect(w, r, "/login", 302)
		return
	}
	ctx := context.TODO()
	comments, err := client.LRange(ctx, "comments", 0, 10).Result()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Sever Error"))
		return
	}
	templates.ExecuteTemplate(w, "index.html", comments)
}

func indexPostHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.TODO()
	r.ParseForm()
	comment := r.PostForm.Get("comment")
	err := client.LPush(ctx, "comments", comment).Err()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Sever Error"))
		return
	}
	http.Redirect(w, r, "/", 302)
}

func loginGetHandler(w http.ResponseWriter, r *http.Request) {
	templates.ExecuteTemplate(w, "login.html", nil)
}

func loginPostHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.TODO()
	r.ParseForm()
	username := r.PostForm.Get("username")
	password := r.PostForm.Get("password")
	hash, err := client.Get(ctx, "user:"+username).Bytes()
	if err == redis.Nil {
		templates.ExecuteTemplate(w, "login.html", "User Not Found")
		return
	} else if err != nil {
		w.Write([]byte("Internal Sever Error"))
		return
	}
	err = bcrypt.CompareHashAndPassword(hash, []byte(password))
	if err != nil {
		templates.ExecuteTemplate(w, "login.html", "Invalid Password")
		return
	}
	session, _ := store.Get(r, "session")
	session.Values["username"] = username
	session.Save(r, w)
	http.Redirect(w, r, "/", 302)
}

func registerGetHandler(w http.ResponseWriter, r *http.Request) {
	templates.ExecuteTemplate(w, "register.html", nil)
}

func registerPostHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.TODO()
	r.ParseForm()
	username := r.PostForm.Get("username")
	password := r.PostForm.Get("password")

	cost := bcrypt.DefaultCost
	hash, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Sever Error"))
		return
	}
	client.Set(ctx, "user:"+username, hash, 0) //0 so does not expire
	http.Redirect(w, r, "/login", 302)

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
