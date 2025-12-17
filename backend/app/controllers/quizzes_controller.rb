class QuizzesController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :require_admin!, only: [:create, :update, :destroy]
  before_action :set_quiz, only: [:show, :update, :destroy]

  # GET /quizzes
  def index
    quizzes = Quiz.all
    render json: QuizSerializer.new(quizzes).serializable_hash
  end

  # GET /quizzes/1
  def show
    options = { include: [:questions] }
    render json: QuizSerializer.new(@quiz, options).serializable_hash
  end

  # POST /quizzes
  def create
    @quiz = Quiz.new(quiz_params)
    @quiz.user = current_user

    if @quiz.save
      render json: QuizSerializer.new(@quiz).serializable_hash, status: :created
    else
      render json: { errors: @quiz.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /quizzes/1
  def update
    if @quiz.user == current_user && @quiz.update(quiz_params)
      render json: QuizSerializer.new(@quiz).serializable_hash
    elsif @quiz.user != current_user
      render json: { error: 'Unauthorized' }, status: :forbidden
    else
      render json: { errors: @quiz.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /quizzes/1
  def destroy
    if @quiz.user == current_user
      @quiz.destroy
      head :no_content
    else
      render json: { error: 'Unauthorized' }, status: :forbidden
    end
  end

  private

  def set_quiz
    @quiz = Quiz.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Quiz not found' }, status: :not_found
  end

  def quiz_params
    params.require(:quiz).permit(:title, :description, :time_limit)
  end
end
