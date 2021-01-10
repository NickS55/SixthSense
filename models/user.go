package models

import (
	"context"
	"errors"
	"fmt"

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
	key string //key into redis db
}

//NewUser - creates a new User
func NewUser(username string, hash []byte) (*User, error) {
	ctx := context.TODO()
	id, err := client.Incr(ctx, "user:next-id").Result()
	if err != nil {
		return nil, err
	}
	key := fmt.Sprintf("user:%d", id)
	pipe := client.Pipeline() //allows sending a multiple commands to redis wihtout a response for everyone
	pipe.HSet(ctx, key, "id", id)
	pipe.HSet(ctx, key, "username", username)
	pipe.HSet(ctx, key, "hash", hash)
	pipe.HSet(ctx, "user:by-username", username, id)
	_, err = pipe.Exec(ctx)
	if err != nil {
		return nil, err
	}
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

// RegisterUser - page to register a user
func RegisterUser(username, password string) error {
	cost := bcrypt.DefaultCost
	hash, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	if err != nil {
		return err
	}

	_, err = NewUser(username, hash)
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
