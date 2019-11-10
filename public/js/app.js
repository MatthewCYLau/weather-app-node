const socket = io()

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

weatherForm.addEventListener("submit", e => {
  e.preventDefault();

  const location = search.value;

  messageOne.textContent = "Loading...";
  messageTwo.textContent = "";

  fetch("/weather?address=" + location).then(response => {
    response.json().then(data => {
      if (data.error) {
        messageOne.textContent = data.error;
      } else {
        messageOne.textContent = data.location;
        messageTwo.textContent = data.forecast;
      }
    });
  });
});

$(document).ready(() => {

  $("#current-location").click(function() {

    navigator.geolocation.getCurrentPosition((position) => {

        console.log(position.coords)

        socket.emit('sendLocation', {

            latitude: position.coords.latitude,
            longitude: position.coords.longitude
            
        }, () => {

            console.log('Location shared!')  
        })
    })
  });
});

socket.on('message', (message) => {
    console.log(message)
})

socket.on('locationMessage', (locationMessage) => {
    messageTwo.textContent = locationMessage;
})

socket.emit('join')