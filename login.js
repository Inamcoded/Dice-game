
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
