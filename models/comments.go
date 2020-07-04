package models

import (
	"context"
)

//GetComments - gets comments from database
func GetComments() ([]string, error) {
	ctx := context.TODO()
	return client.LRange(ctx, "comments", 0, 10).Result()
}

//PostComments - user submits comments
func PostComments(comment string) error {
	ctx := context.TODO()
	return client.LPush(ctx, "comments", comment).Err()
}
