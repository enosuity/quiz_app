class Question < ApplicationRecord
  belongs_to :quiz
  enum question_type: { multiple_choice: 0, true_false: 1, text: 2 }
end
