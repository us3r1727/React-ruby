class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :full_name
      t.string :email
      t.string :avatar_url
      t.integer :role

      t.timestamps
    end
  end
end
