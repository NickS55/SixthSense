package models

import (
	"github.com/go-redis/redis"
	//"github.com/go-sql-driver/mysql"
)

var client *redis.Client

/* Notes for redis database
if memory use becomes a problme look into using hashes for key:value stores
*/

//Init - initialize redis server
func Init() {
	client = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
}
