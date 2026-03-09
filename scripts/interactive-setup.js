const readline = require('readline');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

async function main() {
    console.log("\n🚀 Welcome to Synthetix AI Starter Kit Setup Wizard 🚀\n");
    console.log("Press Enter to skip any step and configure manually later.\n");

    const dbUrl = await ask("1. PostgreSQL Database URL (e.g., postgresql://postgres:postgres@localhost:5432/saas): ");
    const stripeSecret = await ask("2. Stripe Secret Key (sk_test_...): ");
    const stripeWebhook = await ask("3. Stripe Webhook Secret (whsec_...): ");
    const openaiKey = await ask("4. OpenAI API Key (sk-...): ");

    const jwtSecret = crypto.randomBytes(32).toString('hex');

    const backendEnvPath = path.join(__dirname, '../backend/.env');
    const backendEnvContent = `DATABASE_URL="${dbUrl || 'postgresql://postgres:postgres@localhost:5432/saas'}"
PORT=4000
JWT_SECRET="${jwtSecret}"
STRIPE_SECRET_KEY="${stripeSecret}"
STRIPE_WEBHOOK_SECRET="${stripeWebhook}"
OPENAI_API_KEY="${openaiKey}"
FRONTEND_URL="http://localhost:3000"
`;
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    console.log("✅ backend/.env generated.");

    const dbEnvPath = path.join(__dirname, '../database/.env');
    const dbEnvContent = `DATABASE_URL="${dbUrl || 'postgresql://postgres:postgres@localhost:5432/saas'}"\n`;
    fs.writeFileSync(dbEnvPath, dbEnvContent);
    console.log("✅ database/.env generated.");

    const frontendEnvPath = path.join(__dirname, '../frontend/.env.local');
    const frontendEnvContent = `NEXT_PUBLIC_API_URL="http://localhost:4000"
`;
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log("✅ frontend/.env.local generated.");

    console.log("\n🎉 Environment setup complete! 🎉");
    console.log("\nNext Steps:");
    console.log("  1. Run: npm run install:all");
    console.log("  2. Run: npm run db:push");
    console.log("  3. Run: npm run dev:all");

    rl.close();
}

main().catch(console.error);
