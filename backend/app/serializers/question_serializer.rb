class QuestionSerializer
  include JSONAPI::Serializer
  attributes :id, :text, :question_type, :options, :quiz_id

  # Hide correct_answer from public API unless specifically requested (e.g. by owner)
  # For now, we won't include it in default serialization
end
