package sessions

import (
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
)

//Hash Key in production make 64 bytes long
var hashKey = []byte("s3<ret")

//Block keys 32 bytes long
var blockKey = []byte("secret")

var s = securecookie.New(hashKey, blockKey)

//Store - stores cookies
var Store = sessions.NewCookieStore([]byte("hello")) //learn about how to secure cookies
