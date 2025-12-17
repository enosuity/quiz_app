class QuestionsController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin!, only: [:create, :update, :destroy]
  before_action :set_quiz, only: [:create]
  before_action :set_question, only: [:update, :destroy]

  # POST /quizzes/:quiz_id/questions
  def create
    if @quiz.user != current_user
      return render json: { error: 'Unauthorized' }, status: :forbidden
    end

    @question = @quiz.questions.build(question_params)

    if @question.save
      render json: QuestionSerializer.new(@question).serializable_hash, status: :created
    else
      render json: { errors: @question.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /questions/1
  def update
    if @question.quiz.user != current_user
      return render json: { error: 'Unauthorized' }, status: :forbidden
    end

    if @question.update(question_params)
      render json: QuestionSerializer.new(@question).serializable_hash
    else
      render json: { errors: @question.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /questions/1
  def destroy
    if @question.quiz.user != current_user
      return render json: { error: 'Unauthorized' }, status: :forbidden
    end

    @question.destroy
    head :no_content
  end

  private

  def set_quiz
    @quiz = Quiz.find(params[:quiz_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Quiz not found' }, status: :not_found
  end

  def set_question
    @question = Question.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Question not found' }, status: :not_found
  end

  def question_params
    params.require(:question).permit(:text, :question_type, :correct_answer, options: {})
  end
end
