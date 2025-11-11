1. Requirements

Ruby >= 3.4

Rails >= 8.1

PostgreSQL

Bundler (gem install bundler)

Git

2. Clone repository
 
 git clone <your-repo-url>
 
 cd backend

3. Install dependencies

 bundle install

4. Configure environment

 cp .env.example .env

 Edit config/database.yml

5. generate master key 
 rails secret


5. Create and migrate database
 rails db:create
 rails db:migrate

7. Run server

 rails s
