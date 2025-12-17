class AttemptSerializer
  include JSONAPI::Serializer
  attributes :id, :score, :answers, :quiz_id, :user_id, :created_at, :detailed_results
end
