// server/__tests__/setup.js
import dotenv from "dotenv";

// Load environment variables for testing
dotenv.config();

// Set default test environment variables if not present
process.env.JWT_SECRET_KEY =  "test-secret-key";
process.env.JWT_EXPIRES_IN =  "1h";
process.env.SUPABASE_URL =  "https://test.supabase.co";
process.env.SUPABASE_KEY =  "test-key";
