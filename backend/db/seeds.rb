# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
puts "=== Criando usuário admin ==="

admin = User.find_or_create_by!(email: "admin@example.com") do |user|
  user.full_name = "Administrador"
  user.password = "admin123"
  user.password_confirmation = "admin123"
  user.role = :admin  # Isso salvará como 1 no banco
end

puts "   Admin  #{admin.email} (role: #{admin.role})"
puts "   password: admin123"