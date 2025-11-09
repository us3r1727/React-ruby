class User < ApplicationRecord
  # Módulos do Devise com JWT
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  enum :role, { user: 0, admin: 1 }

  validates :full_name, presence: true
end
