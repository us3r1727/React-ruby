
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
  development:
    adapter: postgresql
    encoding: unicode
    database: your_app_development
    pool: 5
    username: your_postgres_username
    password: your_postgres_password
    host: localhost
    port: 5432
```
4. Generate the application master key
```bash
  rails secret
```
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
