require 'net/http'
require 'json'
require 'uri'

BASE_URL = 'http://localhost:3000'
EMAIL = 'test9@example.com'
PASSWORD = 'password'

def request(method, path, body = nil, token = nil)
  uri = URI("#{BASE_URL}#{path}")
  http = Net::HTTP.new(uri.host, uri.port)
  req = case method
        when :post then Net::HTTP::Post.new(uri)
        when :get then Net::HTTP::Get.new(uri)
        end
  req['Content-Type'] = 'application/json'
  req['Authorization'] = "Bearer #{token}" if token
  req.body = body.to_json if body
  res = http.request(req)
  puts "#{method.upcase} #{path} -> #{res.code}"
  # puts res.body
  [res, (JSON.parse(res.body) rescue nil)]
end

# 1. Login
puts "Logging in..."
res, json = request(:post, '/login', { user: { email: EMAIL, password: PASSWORD } })
token = res['Authorization']&.split(' ')&.last
if token
  puts "Token received."
else
  puts "Failed to get token."
  exit 1
end

# 2. Create Quiz
puts "Creating Quiz..."
res, json = request(:post, '/quizzes', { quiz: { title: "API Test Quiz", description: "Created via script", time_limit: 10 } }, token)
quiz_id = json.dig('data', 'id')
puts "Quiz ID: #{quiz_id}"

# 3. Create Question
puts "Creating Question..."
res, json = request(:post, "/quizzes/#{quiz_id}/questions", {
  question: {
    text: "What is 2+2?",
    question_type: "mcq",
    correct_answer: "4",
    options: { a: "3", b: "4", c: "5" }
  }
}, token)
question_id = json.dig('data', 'id')
puts "Question ID: #{question_id}"

# 4. Create Attempt
puts "Creating Attempt..."
res, json = request(:post, "/quizzes/#{quiz_id}/attempts", {
  answers: { question_id => "4" }
}, token)
score = json.dig('data', 'attributes', 'score')
puts "Score: #{score}"

if score == 1
  puts "VERIFICATION SUCCESSFUL!"
else
  puts "Verification Failed: Score mismatch."
end
