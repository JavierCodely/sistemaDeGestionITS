// examenes.js - Manejo de la sección de exámenes

document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos
    setupExamenesEvents();
    
    // Cargar datos de prueba al mostrar la sección
    document.getElementById('navExamenes')?.addEventListener('click', function(e) {
        e.preventDefault();
        showSection('examenes');
        cargarDatosExamenes();
    });
});

function setupExamenesEvents() {
    // Evento delegado para los botones "Elegir Mesa"
    document.getElementById('tablaMateriasExamen')?.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-elegir-mesa')) {
            const materiaId = e.target.getAttribute('data-materia-id');
            const materiaNombre = e.target.getAttribute('data-materia-nombre');
            mostrarModalMesas(materiaId, materiaNombre);
        }
    });
    
    // Evento delegado para los botones "Seleccionar" en el modal
    document.getElementById('tablaMesasExamen')?.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-seleccionar-mesa')) {
            const mesaId = e.target.getAttribute('data-mesa-id');
            seleccionarMesa(mesaId);
        }
    });
}

function cargarDatosExamenes() {
    // Datos de prueba - Materias disponibles para inscripción
    const materiasDisponibles = [
        {
            id: 101,
            nombre: "Matemática II",
            estado: "Cursando",
            mesas: [
                { id: 1, tipo: "Regular", fecha: "15/11/2023", horario: "09:00", aula: "Aula 10" },
                { id: 2, tipo: "Regular", fecha: "20/12/2023", horario: "14:00", aula: "Aula 5" }
            ]
        },
        {
            id: 102,
            nombre: "Programación I",
            estado: "Cursando",
            mesas: [
                { id: 3, tipo: "Regular", fecha: "18/11/2023", horario: "10:00", aula: "Aula 8" },
                { id: 4, tipo: "Libre", fecha: "05/12/2023", horario: "16:00", aula: "Aula 3" }
            ]
        }
    ];
    
    // Llenar la tabla de materias
    const tabla = document.getElementById('tablaMateriasExamen');
    if (!tabla) return;
    
    tabla.innerHTML = materiasDisponibles.map(materia => `
        <tr>
            <td>${materia.nombre}</td>
            <td><span class="badge bg-warning">${materia.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-primary btn-elegir-mesa" 
                        data-materia-id="${materia.id}"
                        data-materia-nombre="${materia.nombre}">
                    Elegir Mesa
                </button>
            </td>
        </tr>
    `).join('');
}

function mostrarModalMesas(materiaId, materiaNombre) {
    // Obtener las mesas para esta materia (en un caso real, harías una petición al backend)
    const mesas = obtenerMesasPorMateria(materiaId);
    
    // Actualizar el título del modal
    document.getElementById('modalMateriaTitulo').textContent = `Materia: ${materiaNombre}`;
    
    // Llenar la tabla de mesas
    const tablaMesas = document.getElementById('tablaMesasExamen');
    if (tablaMesas) {
        tablaMesas.innerHTML = mesas.map(mesa => `
            <tr>
                <td>${mesa.tipo}</td>
                <td>${mesa.fecha}</td>
                <td>${mesa.horario}</td>
                <td>${mesa.aula}</td>
                <td>
                    <button class="btn btn-sm btn-success btn-seleccionar-mesa" 
                            data-mesa-id="${mesa.id}">
                        Seleccionar
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modalSeleccionMesa'));
    modal.show();
}

function obtenerMesasPorMateria(materiaId) {
    // Datos de prueba - En una aplicación real, esto vendría del backend
    const mesasPorMateria = {
        101: [
            { id: 1, tipo: "Regular", fecha: "15/11/2023", horario: "09:00"},
            { id: 2, tipo: "Regular", fecha: "20/12/2023", horario: "14:00"}
        ],
        102: [

























            
            { id: 3, tipo: "Regular", fecha: "18/11/2023", horario: "10:00"},
            { id: 4, tipo: "Libre", fecha: "05/12/2023", horario: "16:00"}
        ]
    };
    
    return mesasPorMateria[materiaId] || [];
}

function seleccionarMesa(mesaId) {
    // Aquí iría la lógica para registrar la selección en el backend
    console.log(`Mesa seleccionada: ${mesaId}`);
    alert(`Has seleccionado la mesa ${mesaId}. En una aplicación real, esto se enviaría al servidor.`);
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalSeleccionMesa'));
    modal.hide();
    
    // Actualizar la interfaz (opcional)
    // podrías marcar la materia como "Inscripto" o similar
}