const SUPABASE_URL = "https://qehvzjgjpwlnwhokbezb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaHZ6amdqcHdsbndob2tiZXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NjMwNTEsImV4cCI6MjA4MzMzOTA1MX0.Jsa4c4_ann-q984D4GlvhNhaC5926npyzUaZ4NGM-z8";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log("Supabase ready", supabaseClient);

async function signup(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const other = document.getElementById("other").value.trim();
  const dob = document.getElementById("dob").value;
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !other || !dob || !email || !username || !password) {
    alert("Fill all fields");
    return;
  }

  const age = calculateAge(dob);
  if (age < 18) {
    alert("Must be 18+");
    return;
  }

  const { data: exists, error: checkError } = await supabaseClient
    .from("users")
    .select("id")
    .or(`email.eq.${email},username.eq.${username}`);

  if (checkError) {
    console.error(checkError);
    alert("Database error");
    return;
  }

  if (exists.length > 0) {
    alert("Email or username already exists");
    return;
  }

  const { user, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    alert(error.message);
    return;
  }
  
  if (!user) {
    alert("Signup failed");
    return;
  }
  
  const { error: insertError } = await supabaseClient
    .from("users")
    .insert({
      user_id: user.id,
      name,
      other,
      dob,
      email,
      username,
    });
  
  if (insertError) {
    console.error(insertError);
    alert(insertError.message);
    return;
  }
  
  alert("Signup successful");
  
  e.target.reset();
}


function calculateAge(dob) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

document.getElementById("eyeIcon").onclick = function () {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
};
