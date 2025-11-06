module Api
  module V1
    class UsersController < ApplicationController
      before_action :set_user, only: %i[show update destroy]

      rescue_from ActiveRecord::RecordNotFound, with: :not_found

      def index
        users = User.all
        render json: { data: users }, status: :ok
      end

      def show
        render json: { data: @user }, status: :ok
      end

      def create
        @user = User.new(user_params)
        if @user.save
          render json: { data: @user }, status: :created
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @user.update(user_params)
          render json: { data: @user }, status: :ok
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @user.destroy
        head :no_content
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      def user_params
        params.require(:user).permit(:full_name, :email, :avatar_url, :role)
      end

      def not_found
        render json: { error: "User not found" }, status: :not_found
      end
    end
  end
end
