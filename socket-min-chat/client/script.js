const socket = io("http://localhost:3001");

const username = prompt("Enter your name");
socket.emit("join", username);

const chat = document.getElementById("chat");
const usersDiv = document.getElementById("users");

socket.on("users", (users) => {
  usersDiv.innerHTML = "Online: " + users.join(", ");
});

socket.on("message", (data) => {
  const div = document.createElement("div");
  div.classList.add("message");

  if (data.user === username) {
    div.classList.add("me");
  } else {
    div.classList.add("other");
    div.innerText = data.user + ": ";
  }

  div.innerText += data.text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

function sendMessage() {
  const msg = document.getElementById("msg");
  if (msg.value.trim() !== "") {
    socket.emit("message", msg.value);
    msg.value = "";
  }
}
