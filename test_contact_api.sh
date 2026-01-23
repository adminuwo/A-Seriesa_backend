#!/bin/bash

# Test Contact Form Submission
echo "Testing Contact Form API..."
echo ""

curl -X POST http://localhost:8080/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+91 9876543210",
    "subject": "Test Contact",
    "category": "general",
    "message": "This is a test message from curl command"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "Test completed!"
