import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';

const mockSupabaseInsert = {
    select: jest.fn().mockReturnThis(),
    single: jest.fn(),
};

const mockSupabaseQuery = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn(),
    single: jest.fn(),
    insert: jest.fn().mockReturnValue(mockSupabaseInsert),
};

const mockJwtUtils = {
    generateToken: jest.fn(),
    verifyToken: jest.fn(),
};

const mockBcrypt = {
    hash: jest.fn(),
    compare: jest.fn(),
};

jest.unstable_mockModule("../config/supabaseClient.js", () => ({
    supabase: mockSupabaseQuery,
}));

jest.unstable_mockModule("../utils/jwt.js", () => mockJwtUtils);

jest.unstable_mockModule("bcrypt", () => ({
    default: mockBcrypt,
    ...mockBcrypt
}));

// 3. DYNAMIC IMPORTS
// We must import these using 'await' AFTER registering the mocks.
// Since we are at the top level of an ESM test, we can usually do this, 
// but it is safer to do it inside a beforeAll or just below the mocks if top-level-await is enabled.

const { default: app } = await import("../app.js");
const { default: request } = await import("supertest");
const { supabase } = await import("../config/supabaseClient.js");

// ------------------------------------------------------------------
// TESTS START HERE
// ------------------------------------------------------------------

describe("Auth Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(console, 'error').mockImplementation(() => {});

        // --- Reset & Default Supabase Mocks ---
        mockSupabaseQuery.from.mockReturnThis();
        mockSupabaseQuery.select.mockReturnThis();
        mockSupabaseQuery.eq.mockReturnThis();
        mockSupabaseQuery.insert.mockReturnValue(mockSupabaseInsert);
        mockSupabaseInsert.select.mockReturnThis();

        // Reset terminal methods
        mockSupabaseQuery.maybeSingle.mockReset();
        mockSupabaseQuery.single.mockReset();
        mockSupabaseInsert.single.mockReset();

        // Default: User NOT found (for Signup)
        mockSupabaseQuery.maybeSingle.mockResolvedValue({ data: null, error: null });
        
        // Default: User FOUND (for Signin)
        mockSupabaseQuery.single.mockResolvedValue({
            data: { id: 11, name: "John Doe", username: "johndoe", encryted_password: "hashed_password" },
            error: null
        });

        // --- Reset & Default Utils ---
        mockJwtUtils.generateToken.mockReset();
        mockJwtUtils.generateToken.mockReturnValue("mock-jwt-token");

        mockBcrypt.hash.mockReset();
        mockBcrypt.hash.mockResolvedValue("hashed_password");
        
        mockBcrypt.compare.mockReset();
        mockBcrypt.compare.mockResolvedValue(true);
    });

    // ------------------------ SIGNUP ------------------------
    describe("POST /auth/signup", () => {
        it("should create a new user and return token", async () => {
            const userData = { name: "John Doe", username: "johndoe", password: "password123" };
            
            // Mock the insert result
            mockSupabaseInsert.single.mockResolvedValueOnce({
                data: { id: 123, name: "John Doe", username: "johndoe" },
                error: null
            });

            const response = await request(app)
                .post("/auth/signup")
                .send(userData)
                .expect(201);

            expect(response.body.message).toBe("User created successfully");
            expect(response.body.token).toBe("mock-jwt-token");
            expect(mockSupabaseQuery.insert).toHaveBeenCalled(); // Proof the mock was used
        });

        it("should return 400 when username already exists", async () => {
            const userData = { name: "John Doe", username: "existing", password: "password123" };
            
            // Mock existing user found
            mockSupabaseQuery.maybeSingle.mockResolvedValueOnce({
                data: { id: 999 },
                error: null
            });

            const response = await request(app)
                .post("/auth/signup")
                .send(userData)
                .expect(400);

            expect(response.body.message).toBe("Username already exists");
        });

        it("should return 500 when user check fails (DB Error)", async () => {
            const userData = { name: "John Doe", username: "johndoe", password: "password123" };
            
            // Mock DB error checking for user
            // Note: The controller checks 'message' property of the error object usually,
            // or relies on Supabase returning { message: ... } directly in the object if it's not wrapped in 'error'.
            mockSupabaseQuery.maybeSingle.mockResolvedValueOnce({
                data: null,
                message: "DB Connection Failed"
            });

            const response = await request(app)
                .post("/auth/signup")
                .send(userData)
                .expect(500);

            expect(response.body.message).toBe("Internal Error Occured. Contact Support!");
        });
        
        it("should return 500 when bcrypt fails", async () => {
            const userData = { name: "John Doe", username: "johndoe", password: "password123" };
            
            mockBcrypt.hash.mockRejectedValueOnce(new Error("Bcrypt Error"));

            const response = await request(app)
                .post("/auth/signup")
                .send(userData)
                .expect(500);
                
            expect(response.body.message).toBe("Internal server error");
        });
    });

    // ------------------------ SIGNIN ------------------------
    describe("POST /auth/signin", () => {
        it("should sign in user with valid credentials", async () => {
            const credentials = { username: "johndoe", password: "password123" };
            
            // Uses defaults defined in beforeEach

            const response = await request(app)
                .post("/auth/signin")
                .send(credentials)
                .expect(200);

            expect(response.body.token).toBe("mock-jwt-token");
        });

        it("should return 401 when user does not exist", async () => {
            const credentials = { username: "ghost", password: "password123" };
            
            // Mock user NOT found
            mockSupabaseQuery.single.mockResolvedValueOnce({
                data: null,
                error: null
            });

            const response = await request(app)
                .post("/auth/signin")
                .send(credentials)
                .expect(401);

            expect(response.body.message).toBe("Invalid credentials!");
        });

        it("should return 401 when password is incorrect", async () => {
            const credentials = { username: "johndoe", password: "wrongpassword" };
            
            // User found (default), but bcrypt compares false
            mockBcrypt.compare.mockResolvedValueOnce(false);

            const response = await request(app)
                .post("/auth/signin")
                .send(credentials)
                .expect(401);

            expect(response.body.message).toBe("Invalid credentials!");
        });
        
        it("should return 404 when database query fails", async () => {
            const credentials = { username: "johndoe", password: "password123" };
            
            // Mock DB Error
            mockSupabaseQuery.single.mockResolvedValueOnce({
                data: null,
                error: { message: "Connection lost" }
            });

            const response = await request(app)
                .post("/auth/signin")
                .send(credentials)
                .expect(404);

            expect(response.body.message).toBe("Contact Support!");
        });
    });
});
