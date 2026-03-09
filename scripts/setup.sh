#!/bin/bash
# AI SaaS Starter Kit - Quick Setup

echo "🚀 Welcome to the AI SaaS Starter Kit Setup!"
echo "---------------------------------------------"

echo "📦 1. Copying environment variables..."
cp .env.example .env
cp .env.example frontend/.env.local
cp .env.example backend/.env
cp .env.example database/.env

echo "🐳 2. Starting PostgreSQL via Docker..."
docker-compose up -d

echo "📦 3. Installing all dependencies..."
cd database && npm install
cd ../backend && npm install
cd ../frontend && npm install
cd ..

echo "🗄️ 4. Pushing Database Schema..."
cd database
npx prisma db push
npx ts-node prisma/seed.ts
cd ..

echo "✅ Setup Complete!"
echo "---------------------------------------------"
echo "To start the development servers:"
echo "- Backend: cd backend && npm run dev"
echo "- Frontend: cd frontend && npm run dev"
echo "Don't forget to update your .env files with real your STRIPE, OPENAI, and JWT secrets!"
