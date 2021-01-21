package models

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/go-redis/redis"
	"golang.org/x/crypto/bcrypt"
)

var (
	//ErrUserNotFound - user DNE
	ErrUserNotFound = errors.New("user not found")
	//ErrInvalidLogin - Password incorrect
	ErrInvalidLogin = errors.New("incorrect password")
)

//User - a user
type User struct {
	key string //key for redis db
}

//NewUser - creates a new User
func NewUser(username string, hash []byte, email string, dateOfBirth string, name string) (*User, error) {
	ctx := context.TODO()

	//id, err := client.Incr(ctx, "user:next-id").Result()
	id, err := generateRandom64BitID(8)
	if err != nil {
		return nil, err
	}

	key := fmt.Sprintf("user:%s", id)
	pipe := client.Pipeline() //Pipeline allows sending multiple commands to Redis at a time without each command blocking
	pipe.HSet(ctx, key, "id", id)
	pipe.HSet(ctx, key, "username", username)
	pipe.HSet(ctx, key, "hash", hash)
	pipe.HSet(ctx, "user:by-username", username, id)
	_, err = pipe.Exec(ctx)
	if err != nil {
		return nil, err
	}
	log.Println(id)

	t := time.Now()
	tSQL := t.Format("2006-01-02 15:04:05")

	dbUser, err := db.Exec("INSERT INTO user (user_id, name, birthday, password_hash, last_login, username, date_created, team_account, active ) VALUES(?,?,?,?,?,?,?,?,?) ", id, name, dateOfBirth, string(hash), tSQL, username, tSQL, 0, 1)
	//rows, err := db.Query("select user_id from user")
	if err != nil {
		return nil, err
	}

	affectedRows, err := dbUser.RowsAffected()
	if err != nil {
		return nil, err
	}
	log.Println(affectedRows)

	return &User{key}, nil
}

//GetID - get user id
func (user *User) GetID() (int64, error) {
	ctx := context.TODO()
	return client.HGet(ctx, user.key, "id").Int64()
}

//GetUsername - gets username
func (user *User) GetUsername() (string, error) {
	ctx := context.TODO()
	return client.HGet(ctx, user.key, "username").Result()
}

//GetHash - gets hash for password
func (user *User) GetHash() ([]byte, error) {
	ctx := context.TODO()
	return client.HGet(ctx, user.key, "hash").Bytes()
}

//Authenticate - compare's users password to hash
func (user *User) Authenticate(password string) error {
	hash, err := user.GetHash()
	if err != nil {
		return err
	}
	err = bcrypt.CompareHashAndPassword(hash, []byte(password))
	if err == bcrypt.ErrMismatchedHashAndPassword {
		return ErrInvalidLogin
	}
	return err
}

// GetUserByID - returs user from id
func GetUserByID(id int64) (*User, error) {
	key := fmt.Sprintf("user:%d", id)
	return &User{key}, nil
}

//GetUserByUsername - uses username as key
func GetUserByUsername(username string) (*User, error) {
	ctx := context.TODO()
	id, err := client.HGet(ctx, "user:by-username", username).Int64()
	if err == redis.Nil {
		return nil, ErrUserNotFound
	} else if err != nil {
		return nil, err
	}
	return GetUserByID(id)
}

func uniqueID(encodedID string) bool {
	// Store query result in this variable
	var idTaken bool
	// Call a stored procedure that checks if the ID already exists
	// in the database and store the result in idTaken
	err := db.QueryRow("SELECT user_id FROM user WHERE user_id = ?",
		encodedID,
	).Scan(&idTaken)
	// Check for errors
	if err != nil {
		log.Println(err)
		return false
	}
	return idTaken

}

//https://medium.com/@jcox250/generating-prefixed-base64-ids-in-golang-e7731bd89c1b
//generateRandom64BitID - generates 64bit id of size size to use as user id
func generateRandom64BitID(size int) (string, error) {

	b := make([]byte, size)
	// Read size number of bytes into b
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	// Encode our bytes as a base64 encoded string using URLEncoding
	encoded := base64.URLEncoding.EncodeToString(b)

	//Check if id is already taken
	uniqueID(encoded)

	//optional addition - addinng a prefix to tell what base64 id is for
	return encoded, nil

}

// RegisterUser - page to register a user
func RegisterUser(username string, password string, email string, dateOfBirth string, name string) error {
	cost := bcrypt.DefaultCost
	hash, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	if err != nil {
		return err
	}

	_, err = NewUser(username, hash, email, dateOfBirth, name)
	return err
}

//AuthenticateUser - make sure authentication works
func AuthenticateUser(username, password string) (*User, error) {
	user, err := GetUserByUsername(username)
	if err != nil {
		return nil, err
	}
	return user, user.Authenticate(password)
}
