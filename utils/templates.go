package utils

import (
	"html/template"
	"net/http"
)

var templates *template.Template

//LoadTemplates - Loads Template for use
func LoadTemplates(pattern string) {
	templates = template.Must(template.ParseGlob("templates/*.html"))
}

//ExecuteTemplate - runs html from tmpl
func ExecuteTemplate(w http.ResponseWriter, tmpl string, data interface{}) {
	templates.ExecuteTemplate(w, tmpl, data)
}
