class AddAnswersToAttempts < ActiveRecord::Migration[7.2]
  def change
    add_column :attempts, :answers, :jsonb
  end
end
