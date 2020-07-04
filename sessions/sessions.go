package sessions

import (
	"github.com/gorilla/sessions"
)

//Store - stores cookies
var Store = sessions.NewCookieStore([]byte("hello")) //learn about how to secure cookies
