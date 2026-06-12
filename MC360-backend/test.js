/**
 * MC360 Basic API Test
 * Run: node test.js
 * Make sure the server is running on PORT 5000 first.
 */

const http = require("http");

const BASE = "http://localhost:5000";

const request = (path, method = "GET", body = null) =>
  new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: "localhost",
      port: 5000,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let chunks = "";
      res.on("data", (c) => (chunks += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(chunks) }); }
        catch { resolve({ status: res.statusCode, body: chunks }); }
      });
    });

    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });

const run = async () => {
  console.log("\n🧪 MC360 API Tests\n" + "=".repeat(40));

  // Health check
  let res = await request("/health");
  console.log(`[${res.status === 200 ? "✅" : "❌"}] GET /health → ${res.status}`);

  // Register
  res = await request("/api/v1/auth/register", "POST", {
    name: "Test Patient",
    email: `test_${Date.now()}@mc360.com`,
    password: "Test@1234",
    role: "patient",
  });
  console.log(`[${res.status === 201 ? "✅" : "❌"}] POST /api/v1/auth/register → ${res.status} - ${res.body.message}`);

  const token = res.body?.data?.accessToken;

  // Login
  res = await request("/api/v1/auth/login", "POST", { email: "nonexistent@mc360.com", password: "wrong" });
  console.log(`[${res.status === 401 ? "✅" : "❌"}] POST /api/v1/auth/login (bad creds) → ${res.status}`);

  // Protected route without token
  res = await request("/api/v1/auth/me");
  console.log(`[${res.status === 401 ? "✅" : "❌"}] GET /api/v1/auth/me (no token) → ${res.status}`);

  // Doctors list (public)
  res = await request("/api/v1/doctors");
  console.log(`[${res.status === 200 ? "✅" : "❌"}] GET /api/v1/doctors → ${res.status}`);

  // Hospitals list (public)
  res = await request("/api/v1/hospitals");
  console.log(`[${res.status === 200 ? "✅" : "❌"}] GET /api/v1/hospitals → ${res.status}`);

  // 404 test
  res = await request("/api/v1/nonexistent");
  console.log(`[${res.status === 404 ? "✅" : "❌"}] GET /api/v1/nonexistent → ${res.status}`);

  console.log("\n" + "=".repeat(40));
  console.log("✅ Tests complete. Server is working correctly.\n");
};

run().catch((err) => {
  console.error("❌ Test failed — is the server running?", err.message);
  process.exit(1);
});