require 'net/http'
require 'json'
require 'uri'

BASE_URL = 'http://localhost:3000'
EMAIL = 'admin_test@example.com'
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
  [res, (JSON.parse(res.body) rescue nil)]
end

# 1. Signup (Regular User)
puts "Registering Regular User..."
res, json = request(:post, '/signup', { user: { email: EMAIL, password: PASSWORD } })
token = res['Authorization']&.split(' ')&.last
user_id = json.dig('data', 'id')

unless token
  # Try login if already exists
  puts "User exists, logging in..."
  res, json = request(:post, '/login', { user: { email: EMAIL, password: PASSWORD } })
  token = res['Authorization']&.split(' ')&.last
  user_id = json.dig('data', 'id')
end

# 2. Try to Create Quiz (Should Fail)
puts "Attempting to Create Quiz as Regular User..."
res, _ = request(:post, '/quizzes', { quiz: { title: "Fail Quiz", description: "Should fail", time_limit: 10 } }, token)

if res.code == '403'
  puts "SUCCESS: Regular user denied."
else
  puts "FAILURE: Regular user allowed (Code: #{res.code})"
  exit 1
end

# 3. Make User Admin (via Rails Console logic simulation)
puts "Promoting user to Admin..."
# We can't run rails console commands from here easily without exec.
# So we will use a system command to update the user in the db directly via rails runner or similar.
`rails runner "User.find(#{user_id}).update(admin: true)"`

# 4. Login again to refresh token/claims (if claims depend on db state at issue time)
# Note: Devise JWT might embed admin status in token if configured, but we are checking db in controller usually.
# Let's try creating quiz again.

puts "Attempting to Create Quiz as Admin..."
res, _ = request(:post, '/quizzes', { quiz: { title: "Success Quiz", description: "Should succeed", time_limit: 10 } }, token)

if res.code == '201'
  puts "SUCCESS: Admin user allowed."
else
  puts "FAILURE: Admin user denied (Code: #{res.code})"
  exit 1
end

puts "ADMIN VERIFICATION SUCCESSFUL!"
