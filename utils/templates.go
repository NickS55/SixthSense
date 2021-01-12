package utils

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"strings"

	"../models"
)

var templates *template.Template

//GetFiles - gets files from template folder
func GetFiles() *template.Template {
	var templates *template.Template
	var allFiles []string
	var files, err = ioutil.ReadDir("./web/templates")
	if err != nil {
		fmt.Println(err)
	}
	for _, file := range files {
		filename := file.Name()
		if strings.HasSuffix(filename, ".tmpl") {
			allFiles = append(allFiles, "./web/templates/"+filename)
		}
	}
	templates, err = template.ParseFiles(allFiles...)
	return templates
}

func indexGetHandler(w http.ResponseWriter, r *http.Request) {
	updates, err := models.GetAllUpdates()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal server error"))
		return
	}
	templates := GetFiles()

	s2 := templates.Lookup("index.tmpl")
	s2.ExecuteTemplate(w, "index", updates)
}

//LoadTemplates - Loads Template for use
func LoadTemplates(pattern string) {
	templates = template.Must(template.ParseGlob("web/templates/*.html"))
}

//ExecuteTemplate - runs html from tmpl
func ExecuteTemplate(w http.ResponseWriter, tmpl string, data interface{}) {
	templates.ExecuteTemplate(w, tmpl, data)
}

//ExecuteTemplateTmpl - runs html from tmpl
func ExecuteTemplateTmpl(w http.ResponseWriter, tmpl string, name string, data interface{}) {
	templates := GetFiles()

	s1 := templates.Lookup(tmpl)
	s1.ExecuteTemplate(w, name, data)
	s1.Execute(w, nil)
}
