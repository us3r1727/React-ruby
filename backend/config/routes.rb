Rails.application.routes.draw do
  devise_for :users,
             defaults: { format: :json },
             controllers: {
               sessions: 'api/v1/auth'
             }

  namespace :api do
    namespace :v1 do
      # Rotas públicas
      post 'login', to: 'auth#login'
      delete 'logout', to: 'auth#logout'
      post 'register', to: 'users#create' # Registro público

      # Rota protegida (somente usuário autenticado)
      get 'profile', to: 'users#profile'

      # CRUD administrativo de usuários
      resources :users, except: [:create]
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
