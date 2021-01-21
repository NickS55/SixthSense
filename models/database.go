package models

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/go-redis/redis"

	//_ for a driver
	_ "github.com/go-sql-driver/mysql"
)

var client *redis.Client
var db *sql.DB

/* Notes for redis database
if memory use becomes a problem look into using hashes for key:value stores
*/

//Init - initialize redis server
func Init() {
	client = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
	fmt.Println("connection to redis database successful")

	//change to point to the database that you are using

	var err (error)

	db, err = sql.Open("mysql", "littleFish:gorillaoil@/sixthSense")
	if err != nil {
		log.Fatal(err)
	}

	db.SetConnMaxLifetime(time.Minute * 3)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)

	//do not open and close dbs often
	// http://go-database-sql.org/accessing.html

	err = db.Ping()

	if err != nil {
		fmt.Println("connection to mysql database UNsuccessful")
	} else {
		fmt.Println("connection to mysql database successful")
	}
}
