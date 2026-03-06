#!/bin/bash
# BLDRKit Database Setup Script
# Usage: ./scripts/setup-db.sh <DATABASE_URL>
# This script:
# 1. Sets DATABASE_URL locally
# 2. Pushes the Prisma schema to the database
# 3. Runs the seed script
# 4. Sets DATABASE_URL on Vercel
# 5. Redeploys to Vercel

set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/setup-db.sh <DATABASE_URL>"
  echo "Example: ./scripts/setup-db.sh 'postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require'"
  exit 1
fi

DATABASE_URL="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 BLDRKit Database Setup"
echo "========================="
echo ""

# Step 1: Set DATABASE_URL in .env
echo "📝 Step 1: Setting DATABASE_URL in .env..."
cd "$PROJECT_DIR"
if grep -q "DATABASE_URL" .env 2>/dev/null; then
  sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" .env
else
  echo "DATABASE_URL=$DATABASE_URL" >> .env
fi
echo "   ✅ .env updated"

# Step 2: Push Prisma schema
echo ""
echo "📊 Step 2: Pushing Prisma schema to database..."
npx prisma db push --accept-data-loss
echo "   ✅ Schema pushed"

# Step 3: Generate Prisma client
echo ""
echo "🔧 Step 3: Generating Prisma client..."
npx prisma generate
echo "   ✅ Client generated"

# Step 4: Seed database
echo ""
echo "🌱 Step 4: Seeding database..."
npx tsx prisma/seed.ts
echo "   ✅ Database seeded"

# Step 5: Set on Vercel
echo ""
echo "☁️  Step 5: Setting DATABASE_URL on Vercel..."
source ~/.openclaw/.env
vercel env add DATABASE_URL production --token "$VERCEL_TOKEN" <<< "$DATABASE_URL" 2>/dev/null || \
vercel env rm DATABASE_URL production --token "$VERCEL_TOKEN" --yes 2>/dev/null && \
vercel env add DATABASE_URL production --token "$VERCEL_TOKEN" <<< "$DATABASE_URL"
echo "   ✅ Vercel env set"

# Step 6: Also set NEXTAUTH_SECRET and NEXTAUTH_URL if not set
echo ""
echo "🔐 Step 6: Setting auth env vars on Vercel..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "$NEXTAUTH_SECRET" | vercel env add NEXTAUTH_SECRET production --token "$VERCEL_TOKEN" 2>/dev/null || true
echo "https://bldrkit.com" | vercel env add NEXTAUTH_URL production --token "$VERCEL_TOKEN" 2>/dev/null || true
echo "   ✅ Auth vars set"

# Step 7: Deploy
echo ""
echo "🚀 Step 7: Deploying to Vercel..."
vercel --token "$VERCEL_TOKEN" --yes --prod
echo ""
echo "✅ DONE! BLDRKit is fully set up."
echo ""
echo "Login credentials (from seed):"
echo "  Email: admin@summitroofing.com"
echo "  Password: password123"
echo ""
echo "Or create a new account at https://bldrkit.com/register"
