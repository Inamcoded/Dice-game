const SUPABASE_URL = "https://qehvzjgjpwlnwhokbezb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaHZ6amdqcHdsbndob2tiZXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NjMwNTEsImV4cCI6MjA4MzMzOTA1MX0.Jsa4c4_ann-q984D4GlvhNhaC5926npyzUaZ4NGM-z8";
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function login(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  const { error } = await supabaseClient.auth.signIn({
    email,
    password,
  });

  if (error) {
    alert("Invalid email or password");
    return;
  }

  window.location.href = "dashboard.html";
}


document.getElementById("icon").onclick = function () {
  const passwordInput = document.getElementById("password");
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
};
