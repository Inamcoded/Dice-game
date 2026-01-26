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

const eyes = document.querySelectorAll(".eye");

document.addEventListener("mousemove", (e) => {
  eyes.forEach((eye) => {
    const pupil = eye.querySelector(".pupil");

    const eyeRect = eye.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    const deltaX = e.clientX - eyeCenterX;
    const deltaY = e.clientY - eyeCenterY;

    const angle = Math.atan2(deltaY, deltaX);

    const maxMove = 6; 
    const moveX = Math.cos(angle) * maxMove;
    const moveY = Math.sin(angle) * maxMove;

    pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
});

const mouths = document.querySelectorAll(".mouth");

document.addEventListener("mousemove", (e) => {
  mouths.forEach((mouth) => {
    const doll = mouth.closest(".doll");
    const rect = doll.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

   
    const maxOpen = 16;
    const openness = Math.max(4, maxOpen - distance / 20);

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    mouth.style.height = `${openness}px`;
    mouth.style.transform = `rotate(${angle * 0.05}deg)`;
  });
});
