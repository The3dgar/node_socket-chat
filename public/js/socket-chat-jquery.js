// funciones para renderizar usuarios

let divUsuarios = $('#divUsuarios')
let formEnviar = $('#formEnviar')
let txtMensaje = $('#txtMensaje')
let divChatbox = $('#divChatbox')
var params = new URLSearchParams(window.location.search);
let mensajes = []

var nombre = params.get('nombre')
var sala = params.get('sala')

function renderizarUsuarios(personas) {
  console.log(personas);

  let html = ''

  html += '<li>'
  html += '<a href="javascript:void(0)" class="active"> Chat de <span>' + sala + '</span></a>'
  html += '</li>'

  for (let i = 0; i < personas.length; i++) {
    html += `                      <li>
    <a data-id='${personas[i].id}' href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${personas[i].nombre} <small       class="text-success">online</small></span></a>
  </li>`
  }

  divUsuarios.html(html)

}

// listeners
divUsuarios.on('click', 'a', function () {
  let id = $(this).data('id')
  if (id) {
    console.log(id);

  }
})

formEnviar.on('submit', function (e) {
  e.preventDefault()
  if (txtMensaje.val().trim().length === 0) {
    return
  }

  socket.emit('crearMensaje', {
    nombre,
    mensaje: txtMensaje.val()
  }, function (mensaje) {
    txtMensaje.val('').focus()
    renderizarMensajes(mensaje, true)
    scrollBottom()
  });
})

function renderizarMensajes(mensajes, yo) {

  let html = ''
  let fecha = new Date(mensaje.fecha);
  let hora = fecha.getHours() + ':' + fecha.getMinutes()

  let adminClass = 'info'
  if (mensaje.nombre === 'Administrador') {
    adminClass = 'danger'
  }

  if (yo) {
    html = `
      <li class="reverse animated fadeIn">
        <div class="chat-content">
          <h5>${mensaje.nombre}</h5>
          <div class="box bg-light-inverse">${mensaje.mensaje}</div>
        </div>
        <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />
        </div>
        <div class="chat-time">${hora}</div>
      </li>`
  } else {

    let foto = ``
    if (mensaje.nombre !== 'Administrador') {
      foto = `<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>`
    }
    html = `<li class="animated fadeIn">
        ${foto}
        <div class="chat-content">
          <h5>${mensaje.nombre}</h5>
          <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
        </div>
        <div class="chat-time">${hora}</div>
      </li>`

  }



  divChatbox.append(html)


}

function scrollBottom() {

  // selectors
  var newMessage = divChatbox.children('li:last-child');

  // heights
  var clientHeight = divChatbox.prop('clientHeight');
  var scrollTop = divChatbox.prop('scrollTop');
  var scrollHeight = divChatbox.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    divChatbox.scrollTop(scrollHeight);
  }
}