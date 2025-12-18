#!/bin/bash
set -e

echo "Running database migrations..."
rails db:migrate RAILS_ENV=production

echo "Seeding database..."
rails db:seed RAILS_ENV=production

echo "Starting Rails server..."
exec rails server -b 0.0.0.0
