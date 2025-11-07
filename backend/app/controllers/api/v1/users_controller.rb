module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!, except: [:create]
      before_action :set_user, only: %i[update destroy]
      before_action :authorize_user!, only: %i[update destroy]

      rescue_from ActiveRecord::RecordNotFound, with: :not_found

      # GET /api/v1/users (somente admin)
      def index
        authorize_admin!
        render json: { data: User.all }, status: :ok
      end

      # GET /api/v1/profile (usuário autenticado)
      def profile
        render json: { data: current_user }, status: :ok
      end

      # POST /api/v1/register (registro público)
      def create
        user = User.new(user_params)
        user.role = 'user' 

        if user.save
          render json: { data: user }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/users/:id
      def update
        #  Admin pode mudar tudo (incluindo role)
        if current_user.admin?
          if @user.update(admin_update_params)
            render json: { data: @user }, status: :ok
          else
            render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
          end

        # 👤 Usuário comum só pode editar seus próprios dados básicos
        else
          if @user.update(user_update_params)
            render json: { data: @user }, status: :ok
          else
            render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
          end
        end
      end

      # DELETE /api/v1/users/:id (somente admin ou o próprio usuário)
      def destroy
        @user.destroy
        head :no_content
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      # usado para criação (sempre role = 'user')
      def user_params
        params.require(:user).permit(:full_name, :email, :password, :avatar_url)
      end

      # usado para updates normais (usuário comum)
      def user_update_params
        params.require(:user).permit(:full_name, :email, :password, :avatar_url)
      end

      # usado apenas por admin (pode alterar role)
      def admin_update_params
        params.require(:user).permit(:full_name, :email, :password, :avatar_url, :role)
      end

      def authorize_user!
        unless current_user.admin? || current_user == @user
          render json: { error: 'Access denied' }, status: :forbidden
        end
      end

      def authorize_admin!
        render json: { error: 'Access denied' }, status: :forbidden unless current_user.admin?
      end

      def not_found
        render json: { error: 'User not found' }, status: :not_found
      end
    end
  end
end
