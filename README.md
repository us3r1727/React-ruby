
## Rails + REACT Project

Prerequisites
    
    Docker: version 20.10+
    Docker Compose: version 1.29+

## Installation and Configuration

1. Clone and enter the folder
```bash
  git clone https://github.com/us3r1727/React-ruby.git

  cd React-ruby

```
2. ENV

go to /backend

```bash
  cp .env.example .env
```
edit .env

```bash
  DEVISE_JWT_SECRET_KEY=key
```

after editing go back
```bash
 cd ..
```

3. Run the application
```bash
  sudo docker-compose build --no-cache
```
The project will be available at: http://localhost:5173

4. Admin User (Created Automatically)

Email: 
```bash
    admin@example.com
```
Password: 
```bash
    admin123
```


5. Run in background
```bash
  sudo docker-compose up -d
```
The project will be available at: http://localhost:5173



6. Troubleshooting

Docker version error
```bash
  # Ubuntu/Debian
  sudo apt update
  sudo apt install docker.io docker-compose

  # Or use Docker Compose V2
  docker compose up  # without hyphen
```

7. Manual Run


  You need to have a Postgres database running.
  
  intructions here

    Backend : https://github.com/us3r1727/React-ruby/tree/main/backend


    Frontend : https://github.com/us3r1727/React-ruby/tree/main/frontend

8. Included Technologies

Containers

    Backend: Ruby 3.2.2 + Rails 8.1.1

    Frontend: Node.js 22 + React + Vite

    Database: PostgreSQL 13
