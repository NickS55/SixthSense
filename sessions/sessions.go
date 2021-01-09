package sessions

import (
	"os"

	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
)

// Note: Don't store your key in your source code. Pass it via an
// environmental variable, or flag (or both), and don't accidentally commit it
// alongside your code. Ensure your key is sufficiently random - i.e. use Go's
// crypto/rand or securecookie.GenerateRandomKey(32) and persist the result.

//Store - stores cookies
var Store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY"))) //learn about how to secure cookies

// https://github.com/gorilla/securecookie

//GenerateSessionCookie creaets the key value pair for the session key
//note: session cookies last a month by default
func GenerateSessionCookie() {
	var randKey = string(securecookie.GenerateRandomKey(32))
	os.Setenv("SESSION_KEY", randKey)
}
