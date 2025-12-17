class AttemptsController < ApplicationController
  before_action :authenticate_user!, only: [:create]
  before_action :set_quiz, only: [:create]

  # POST /quizzes/:quiz_id/attempts
  def create
    # Calculate score
    score = calculate_score(@quiz, params[:answers])
    
    @attempt = @quiz.attempts.build(
      user: current_user,
      score: score,
      answers: params[:answers]
    )

    if @attempt.save
      render json: AttemptSerializer.new(@attempt).serializable_hash, status: :created
    else
      render json: { errors: @attempt.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /attempts/1
  def show
    @attempt = Attempt.find(params[:id])
    render json: AttemptSerializer.new(@attempt).serializable_hash
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Attempt not found' }, status: :not_found
  end

  private

  def set_quiz
    @quiz = Quiz.find(params[:quiz_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Quiz not found' }, status: :not_found
  end

  def calculate_score(quiz, answers)
    score = 0
    return 0 unless answers
    
    answers_hash = answers.try(:to_unsafe_h) || answers
    puts "DEBUG: Answers Hash: #{answers_hash.inspect}"

    quiz.questions.each do |question|
      user_answer = answers_hash[question.id.to_s]
      puts "DEBUG: QID: #{question.id}, User Answer: #{user_answer.inspect}, Correct Answer: #{question.correct_answer.inspect}"
      
      if user_answer == question.correct_answer
        score += 1
      end
    end
    puts "DEBUG: Final Score: #{score}"
    score
  end
end
