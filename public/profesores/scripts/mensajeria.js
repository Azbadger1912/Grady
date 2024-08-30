const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.toggle-btn');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

function cerrarSesion() {
    // Redirigir al endpoint de logout
    window.location.href = '/logout';
}

document.addEventListener("DOMContentLoaded", function() {
    fetch('/user_data')
        .then(response => response.json())
        .then(data => {
            const userName = data.userNickName;

            // Aquí puedes usar las variables como desees
            const name = document.getElementById('nombre_usuario');
            name.textContent = userName;
        })
        .catch(error => console.error('Error al obtener los datos del usuario:', error));
});

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.toggle-link');
    const divs = document.querySelectorAll('div[id^="div"]');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            divs.forEach(div => {
                div.classList.add('hidden');
            });

            links.forEach(link => {
                link.classList.remove('active');
                link.style.color = 'black';
                link.style.textDecoration = 'none';
            });

            const targetDiv = document.getElementById(this.dataset.target);
            if (targetDiv) {
                targetDiv.classList.remove('hidden');
            }

            this.classList.add('active');
            this.style.color = '#16c4c4';
            this.style.textDecoration = 'underline';
        });
    });
});

// redactar funciones
function formatDoc(cmd, value=null) {
	if (value) {
		document.execCommand(cmd, false, value);
	} else {
		document.execCommand(cmd);
	}
}
function createLink() {
    const url = prompt("Enter the link URL:", "http://");
    if (url) {
        formatDoc('createLink', url);
    }
}

const content = document.getElementById('content');
content.addEventListener('mouseenter', function () {
	const a = content.querySelectorAll('a');
	a.forEach(item=> {
		item.addEventListener('mouseenter', function () {
			content.setAttribute('contenteditable', false);
			item.target = '_blank';
		})
		item.addEventListener('mouseleave', function () {
			content.setAttribute('contenteditable', true);
		})
	})
})

// funcion mensajes

function formatearFecha(fecha) {    // establecer fecha corta y larga
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const [dia, mes, anio] = fecha.split('-').map(Number);

    const anioCompleto = anio < 100 ? 2000 + anio : anio;

    const fechaCompleta = `Panamá, ${dia} de ${meses[mes - 1]} de ${anioCompleto}`;
    const fechaCorta = `${dia}-${mes}-${anioCompleto.toString().slice(-2)}`;

    return { fechaCompleta, fechaCorta };
}
function mensaje(remitente, fecha, asunto, persona, contenido) {    // crear mensajes
    const { fechaCompleta, fechaCorta } = formatearFecha(fecha);
    const uniqueId = 'dialog-' + new Date().getTime();

    const palabras = contenido.split(' ');
    let vist_prev;
    if (palabras.length > 10) {
        vist_prev = palabras.slice(0, 10).join(' ') + '...';
    } else {
        vist_prev = palabras.join(' ');
    }

    const wrapper = document.getElementById('bandeja_recibidos');

    const container = document.createElement('button');
    container.classList.add('mens');
    wrapper.appendChild(container);

    const logo = document.createElement('i');
    logo.classList.add('bx', 'bx-user-circle');
    container.appendChild(logo);

    const rem_mes_cont = document.createElement('div');
    rem_mes_cont.classList.add('rem-mes');
    container.appendChild(rem_mes_cont);

    const remit_asunto = document.createElement('p');
    remit_asunto.textContent = `${remitente} - ${asunto}`;
    rem_mes_cont.appendChild(remit_asunto);

    const vista_previa = document.createElement('p');
    vista_previa.textContent = vist_prev;
    rem_mes_cont.appendChild(vista_previa);

    const date_new_cont = document.createElement('div');
    date_new_cont.classList.add('date-new');
    container.appendChild(date_new_cont);

    const date_preview = document.createElement('p');
    date_preview.textContent = fechaCorta;
    date_new_cont.appendChild(date_preview);

    const modal = document.createElement('dialog');
    modal.classList.add('mensaje');
    modal.id = uniqueId;

    const close = document.createElement('button');
    close.classList.add('cerrar');
    modal.appendChild(close);

    const x = document.createElement('i');
    x.classList.add('bx', 'bx-x');
    close.appendChild(x);

    const message_container = document.createElement('div');
    message_container.classList.add('mens_content');
    modal.appendChild(message_container);

    const date_modal = document.createElement('p');
    date_modal.textContent = fechaCompleta;
    message_container.appendChild(date_modal);

    const asunto_text = document.createElement('span');
    asunto_text.classList.add('asunto');
    asunto_text.textContent = asunto;
    message_container.appendChild(asunto_text);

    const top_container = document.createElement('div');
    top_container.classList.add('mens_top');
    message_container.appendChild(top_container);

    const de_label = document.createElement('span');
    de_label.style.gridArea = 'de';
    de_label.textContent = "De:";
    top_container.appendChild(de_label);

    const de_text = document.createElement('p');
    de_text.style.gridArea = 'remit';
    de_text.textContent = remitente;
    top_container.appendChild(de_text);

    const para_label = document.createElement('span');
    para_label.style.gridArea = 'para';
    para_label.textContent = "Para:";
    top_container.appendChild(para_label);

    const para_text = document.createElement('p');
    para_text.style.gridArea = 'persona';
    para_text.textContent = persona;
    top_container.appendChild(para_text);

    const arch_adj = document.createElement('button');
    arch_adj.classList.add('file');
    arch_adj.textContent = "Archivo adjunto";
    message_container.appendChild(arch_adj);

    const dwn_icon = document.createElement('i');
    dwn_icon.classList.add('bx', 'bx-download');
    arch_adj.appendChild(dwn_icon);

    const mensaje = document.createElement('p');
    mensaje.style.lineHeight = '23px';
    mensaje.textContent = contenido;
    message_container.appendChild(mensaje);

    document.body.appendChild(modal);

    container.addEventListener('click', function() {
        document.getElementById(uniqueId).showModal();
    });

    close.addEventListener('click', function() {
        document.getElementById(uniqueId).close();
    });
}

mensaje('Comunciación Social', '21-8-24', 'Suspención de clases', 'Todos', `Buenas tardes,

Por motivos de daños en la planta potabilizadora que afectaron el día de hoy el suministro de agua, hemos tenido que reprogramar las actividades de Expotecnia 2024 que estaban previstas para el día de hoy.  Les pedimos disculpas y agradecemos su comprensión ante esta situación imprevista.

Las actividades para hoy jueves 22 de agosto serán reprogramadas para el lunes 26 de agosto. Las actividades planificadas para el viernes 23 y sábado 24 de agosto continuarán según lo agendado.

El día compensatorio  por el sábado 24 de agosto,   se trasladará al martes 27 de agosto. Retomaremos nuestras labores habituales el miércoles 28 de agosto.

Agradecemos su colaboración y compromiso. Les pedimos que se mantengan atentos a cualquier actualización adicional.

#SomosITDB`);
