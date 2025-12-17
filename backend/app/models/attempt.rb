class Attempt < ApplicationRecord
  belongs_to :quiz
  belongs_to :user

  def detailed_results
    quiz.questions.map do |question|
      user_answer = answers[question.id.to_s]
      is_correct = user_answer == question.correct_answer
      {
        question_id: question.id,
        text: question.text,
        user_answer: user_answer,
        correct_answer: question.correct_answer,
        is_correct: is_correct,
        options: question.options,
        question_type: question.question_type
      }
    end
  end
end
