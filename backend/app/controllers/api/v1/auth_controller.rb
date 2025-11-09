module Api
  module V1
    class AuthController < ApplicationController
      # POST /api/v1/login
      def login
        user = User.find_by(email: params[:email])
        if user && user.valid_password?(params[:password])
          token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)
          render json: { token: token[0], user: user }, status: :ok
        else
          render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
      end

      # DELETE /api/v1/logout
      def logout
        head :no_content
      end
    end
  end
end
