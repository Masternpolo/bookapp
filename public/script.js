const socket = io();
let message = document.getElementById("message");
let user = document.getElementById("hide").innerText;



socket.on('chat', (data) => {
  displayMessage(data);
});

const send = document.getElementById('send-btn');
send.addEventListener('click', (e) => {
  e.preventDefault();
  let messageV = message.value;
  if (!messageV) {
    return
  }
  socket.emit('chat', messageV);
  message.value = "";
});


function displayMessage(value) {
  const chat = document.getElementById("chatbox");
  let li = document.createElement('li');
  if (value === "") return;
  li.classList.add('message');
  if(value.user===user) li.classList.add('sender');
  else li.classList.add('receiver');
  li.innerHTML += `<h4 class="green"><strong>${value.user}</strong></h4> <p>${value.message} </p>`;
  chat.appendChild(li)
  clearMessage();
}
function clearMessage() {
  let clear = document.getElementById("message");
  clear.value = "";

}



