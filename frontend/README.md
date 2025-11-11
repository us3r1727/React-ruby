1. 
cd backend

2. Instalar dependências
bash

bundle install

3. Configurar banco de dados

Edite o arquivo config/database.yml com as configurações do seu PostgreSQL:
yaml

default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  host: localhost
  port: 5432
  username: seu_usuario
  password: sua_senha

development:
  <<: *default
  database: nome_do_app_development

test:
  <<: *default
  database: nome_do_app_test

production:
  <<: *default
  database: nome_do_app_production

4. Gerar chave mestra
bash

rails secret

Copie a chave gerada e adicione ao arquivo config/master.key.
5. Criar e migrar banco de dados
bash

rails db:create
rails db:migrate

6. Executar servidor
bash

rails s

A aplicação estará disponível em http://localhost:3000