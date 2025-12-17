class CreateAttempts < ActiveRecord::Migration[7.2]
  def change
    create_table :attempts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :quiz, null: false, foreign_key: true
      t.integer :score

      t.timestamps
    end
  end
end
