# message_broadcaster
> web app for sending message birthday of users with timezone

## Setup

```shell
// build image first
$ docker-compose build

// create database broadcast_db and migrate migration
$ docker-compose run web npm run db-default db:create broadcast_db
$ docker-compose run web npm run db-migrate up
```

## Run App

```shell
$ docker-compose up
// make sure see this when running
//  App listening on port 3000 Worker (PID) xx.
```

## Example Rest Usage

```json
structure:
firstname: <String>
lastname: <String>
birthday_date: <yyyy-M-d> in string
location: <longitude,latitude> in string
```

> POST

```
curl --request POST \
  --url http://localhost:3000/user \
  --header 'Content-Type: application/json' \
  --data '{
	"firstname": "aZz",
	"lastname": "b",
	"birthday_date": "1991-12-11",
	"location": "66.15409293748142, -169.8283553110331"
}'
```

> GET single user

```
curl --request GET \
  --url http://localhost:3000/user/1
```

> PUT  
> must send last_updated_lock back after get single user
```
curl --request PUT \
  --url http://localhost:3000/user/1 \
  --header 'Content-Type: application/json' \
  --data '{
      "id": 5,
      "firstname": "aa",
      "lastname": "bbb",
      "birthday_date": "1991-12-11T00:00:00.000Z",
      "location": "66.15409293748142, -169.8283553110331",
      "zone": "Asia/Jakarta",
      "scheduled": "2021-12-11T02:00:00.000Z",
      "status": "UNCELEBRATED",
      "last_updated_lock": "2021-12-10T15:48:58.000Z"
    }'
```

> DELETE

```
curl --request DELETE \
  --url http://localhost:3000/user/1    
```

## Known Issues

- error install /app/node_modules/cpu-features
> one of library db-migrate use ssh2 as dependencies and cause script error
> when install that library, but we can ignore it because we don't need ssh2 tunnel
