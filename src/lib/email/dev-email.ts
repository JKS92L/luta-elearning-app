export async function sendDevVerificationEmail(
  email: string,
  token: string
) {
  if (process.env.NODE_ENV !== "development") return;

  const verifyUrl = `http://localhost:3000/email-verify?email=${encodeURIComponent(
    email
  )}&token=${token}`;

  console.log("\n================ DEV EMAIL =================");
  console.log("To:", email);
  console.log("Subject: Verify your email");
  console.log("Token:", token);
  console.log("Verify URL:", verifyUrl);
  console.log("===========================================\n");
}
