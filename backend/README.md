
## Rails Backend API

Prerequisites
    Ruby >= 3.4

    Rails >= 8.1

    PostgreSQL

    Bundler (gem install bundler)

    Git

## Installation and Configuration

1. Access the project directory
```bash
  cd backend
```
2. Install Ruby dependencies
```bash
  bundle install
```
3. Configure the database
Edit the config/database.yml file with your PostgreSQL credentials:

```bash
    default: &default
      adapter: postgresql
      encoding: unicode
      host: localhost
      username: us3r1723
      password: senha123
      pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
```
4. Generate the application master key
```bash
  rails secret
```
put it on you .env
5. Create the database

```bash
  rails db:create
```
6. Run migration

```bash
  rails db:migrate
```
7. Start the server
```bash
  rails s
```
