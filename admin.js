const SUPABASE_URL = "https://qehvzjgjpwlnwhokbezb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaHZ6amdqcHdsbndob2tiZXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NjMwNTEsImV4cCI6MjA4MzMzOTA1MX0.Jsa4c4_ann-q984D4GlvhNhaC5926npyzUaZ4NGM-z8";
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


document.addEventListener("DOMContentLoaded", async () => {
  const session = supabaseClient.auth.session();

  if (!session) {
    window.location.href = "index.html";
    return;
  }

  const { data, error } = await supabaseClient.rpc("is_admin");
  console.log("Is admin:", data, error);

  if (error || data !== true) {
    alert("Access denied: Admins only");
    window.location.href = "dashboard.html";
    return;
  }

  document.getElementById("adminStatus").textContent = "Welcome Admin 👑";

  await loadTotalUsers();
  await loadAdminEarnings();
  await loadAllTransactions();
});

async function loadTotalUsers() {
  const { count, error } = await supabaseClient
    .from("users")
    .select("*", { count: "exact", head: true });

  if (!error) {
    document.getElementById("totalUsers").textContent = count;
  }
}


async function loadAdminEarnings() {
  console.log("Loading admin earnings...");

  const { data, error } = await supabaseClient
    .from("transactions")
    .select("type, amount");

  if (error) {
    console.error(error);
    return;
  }

  let earnings = 0;

  data.forEach(tx => {
    if (tx.type === "play") {
      earnings += Number(tx.amount);
    }
    if (tx.type === "win") {
      earnings -= Number(tx.amount);
    }
  });

  document.getElementById("adminEarnings").textContent =
    `₦${earnings.toFixed(2)}`;
}


async function loadAllTransactions() {
  const { data, error } = await supabaseClient
    .from("transactions")
    .select("type, amount, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error(error);
    return;
  }

  const list = document.getElementById("transactionList");
  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = "<p>No transactions yet</p>";
    return;
  }

  data.forEach(tx => {
    const div = document.createElement("div");
    div.className = "transaction";

    div.innerHTML = `
      <strong>${tx.type.toUpperCase()}</strong>
      <span>₦${Number(tx.amount).toFixed(2)}</span>
      <small>${new Date(tx.created_at).toLocaleString()}</small>
    `;

    list.appendChild(div);
  });
}

function logout() {
  supabaseClient.auth.signOut();
  window.location.href = "index.html";
}
