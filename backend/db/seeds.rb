# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "Cleaning up database..."
Attempt.destroy_all
Question.destroy_all
Quiz.destroy_all
User.destroy_all

puts "Creating Admin User..."
admin = User.create!(
  email: 'anuj@gmail.com',
  password: 'Goldy@270!',
  password_confirmation: 'Goldy@270!',
  admin: true
)

puts "Creating Regular User..."
User.create!(
  email: 'simon@gmail.com',
  password: 'Goldy@270!',
  password_confirmation: 'Goldy@270!',
  admin: false
)

puts "Creating Quizzes..."
quiz1 = Quiz.create!(
  title: 'General Knowledge',
  description: 'A basic quiz to test your general knowledge.',
  time_limit: 10,
  user: admin
)

puts "Creating Questions..."
Question.create!(
  quiz: quiz1,
  text: 'What is the capital of France?',
  question_type: 'multiple_choice',
  options: { "a" => "Berlin", "b" => "Madrid", "c" => "Paris", "d" => "Rome" },
  correct_answer: 'c'
)

Question.create!(
  quiz: quiz1,
  text: 'The earth is flat.',
  question_type: 'true_false',
  options: { "true" => "True", "false" => "False" },
  correct_answer: 'false'
)

Question.create!(
  quiz: quiz1,
  text: 'What is 2 + 2?',
  question_type: 'text',
  options: {},
  correct_answer: '4'
)

puts "Seeding completed successfully!"
