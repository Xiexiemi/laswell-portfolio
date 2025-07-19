// DOM Elements
const enterButton = document.getElementById("enter-button");
const welcomeScreen = document.getElementById("welcome-screen");
const mainApp = document.getElementById("main-app");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const ownerPanel = document.getElementById("owner-panel");
const lessonsContainer = document.getElementById("lessons");
const alert"reflections");
const uploadFile = document.getElementById("uploadFile");

const OWNER_EMAIL = "manlapz44@gmail.com";

let currentUser = null;

enterButton.onclick = () => {
  welcomeScreen.style.display = "none";
  mainApp.style.display = "block";
};

loginButton.onclick = () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("Fill in email and password.");

  currentUser = email;
  updateUIBasedOnUser();
};

logoutButton.onclick = () => {
  currentUser = null;
  updateUIBasedOnUser();
};

function updateUIBasedOnUser() {
  const isOwner = currentUser === OWNER_EMAIL;

  logoutButton.style.display = currentUser ? "inline-block" : "none";
  loginButton.style.display = currentUser ? "none" : "inline-block";
  emailInput.style.display = passwordInput.style.display = currentUser ? "none" : "inline-block";
  ownerPanel.style.display = isOwner ? "block" : "none";

  displayLessons();
  displayReflections();
}

function showLessonForm() {
  const title = prompt("Enter lesson title:");
  const content = prompt("Enter lesson content:");
  if (title && content) {
    const lessons = JSON.parse(localStorage.getItem("lessons") || "[]");
    lessons.push({ title, content });
    localStorage.setItem("lessons", JSON.stringify(lessons));
    displayLessons();
  }
}

function showReflectionForm() {
  const title = prompt("Enter reflection title:");
  const content = prompt("Enter reflection content:");
  if (title && content) {
    const reflections = JSON.parse(localStorage.getItem("reflections") || "[]");
    reflections.push({ title, content, comments: [] });
    localStorage.setItem("reflections", JSON.stringify(reflections));
    displayReflections();
  }
}

function displayLessons() {
  const lessons = JSON.parse(localStorage.getItem("lessons") || "[]");
  lessonsContainer.innerHTML = lessons.map((l, i) => `
    <div class="card">
      <h3>${l.title}</h3>
      <p>${l.content}</p>
      ${currentUser === OWNER_EMAIL ? `<button onclick="deleteLesson(${i})">Delete</button>` : ""}
    </div>
  `).join("");
}

function deleteLesson(index) {
  const lessons = JSON.parse(localStorage.getItem("lessons") || "[]");
  lessons.splice(index, 1);
  localStorage.setItem("lessons", JSON.stringify(lessons));
  displayLessons();
}

function displayReflections() {
  const reflections = JSON.parse(localStorage.getItem("reflections") || "[]");
  reflectionsContainer.innerHTML = reflections.map((r, i) => `
    <div class="card">
      <h3>${r.title}</h3>
      <p>${r.content}</p>
      ${currentUser && currentUser !== OWNER_EMAIL ? `
        <textarea id="comment-${i}" placeholder="Add a comment..."></textarea>
        <button onclick="addComment(${i})">Comment</button>` : ""}
      <div><strong>Comments:</strong>
        <ul>${(r.comments || []).map(c => `<li>${c}</li>`).join('')}</ul>
      </div>
      ${currentUser === OWNER_EMAIL ? `<button onclick="deleteReflection(${i})">Delete</button>` : ""}
    </div>
  `).join("");
}

function addComment(index) {
  const reflections = JSON.parse(localStorage.getItem("reflections") || "[]");
  const textarea = document.getElementById(`comment-${index}`);
  const comment = textarea.value.trim();
  if (!comment) return;
  reflections[index].comments = reflections[index].comments || [];
  reflections[index].comments.push(comment);
  localStorage.setItem("reflections", JSON.stringify(reflections));
  textarea.value = "";
  displayReflections();
}

function deleteReflection(index) {
  const reflections = JSON.parse(localStorage.getItem("reflections") || "[]");
  reflections.splice(index, 1);
  localStorage.setItem("reflections", JSON.stringify(reflections));
  displayReflections();
}

uploadFile.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const data = JSON.parse(event.target.result);
      if (data.lessons) localStorage.setItem("lessons", JSON.stringify(data.lessons));
      if (data.reflections) localStorage.setItem("reflections", JSON.stringify(data.reflections));
      updateUIBasedOnUser();
    } catch (err) {
      alert("Invalid file format.");
    }
  };
  reader.readAsText(file);
});

// Initialize
updateUIBasedOnUser();
    
