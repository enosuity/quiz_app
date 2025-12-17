class QuizSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :description, :time_limit, :created_at

  has_many :questions
end
