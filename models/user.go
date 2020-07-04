package models

import (
	"context"
	"errors"

	"github.com/go-redis/redis"
	"golang.org/x/crypto/bcrypt"
)

var (
	//ErrUserNotFound - user DNE
	ErrUserNotFound = errors.New("user not found")
	//ErrInvalidLogin - Password incorrect
	ErrInvalidLogin = errors.New("incorrect password")
)

// RegisterUser - page to register a user
func RegisterUser(username, password string) error {
	ctx := context.TODO()
	cost := bcrypt.DefaultCost
	hash, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	if err != nil {
		return err
	}
	return client.Set(ctx, "user:"+username, hash, 0).Err()
}

//AuthenticateUser - make sure authentication works
func AuthenticateUser(username, password string) error {
	ctx := context.TODO()
	hash, err := client.Get(ctx, "user:"+username).Bytes()
	if err == redis.Nil {
		return ErrUserNotFound
	} else if err != nil {
		return err
	}
	err = bcrypt.CompareHashAndPassword(hash, []byte(password))
	if err != nil {
		return ErrInvalidLogin
	}
	return nil
}
