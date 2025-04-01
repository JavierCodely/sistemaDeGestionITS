// cargaExamenes.js - Carga y gestión de exámenes

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el módulo de exámenes
    initExams();
});

function initExams() {
    // Event listeners para botones de inscripción
    document.addEventListener('click', function(e) {
        // Delegación de eventos para manejar botones de inscripción
        if (e.target && e.target.classList.contains('btn-inscribir')) {
            const materiaId = e.target.getAttribute('data-materia-id');
            showExamOptions(materiaId);
        }
        
        // Delegación para botones de selección de mesa
        if (e.target && e.target.classList.contains('btn-seleccionar-mesa')) {
            const mesaId = e.target.getAttribute('data-mesa-id');
            const materiaId = e.target.getAttribute('data-materia-id');
            registerForExam(materiaId, mesaId);
        }
    });
}

function loadExams() {
    // Cargar exámenes inscriptos
    loadRegisteredExams();
    
    // Cargar exámenes disponibles
    loadAvailableExams();
}

function loadRegisteredExams() {
    // Cargar exámenes en los que el estudiante está inscripto
    fetchWithAuth('/api/estudiante/examenes/inscriptos')
        .then(response => response.json())
        .then(examenes => {
            const tabla = document.getElementById('tablaExamenesInscriptos');
            tabla.innerHTML = '';
            
            if (examenes.length === 0) {
                const row = createEmptyRow('No hay inscripciones a exámenes');
                tabla.appendChild(row);
                return;
            }
            
            examenes.forEach(examen => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${examen.materia}</td>
                    <td>${new Date(examen.fecha).toLocaleDateString()}</td>
                    <td>${examen.tipo}</td>
                `;
                
                tabla.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar exámenes inscriptos:', error);
            const tabla = document.getElementById('tablaExamenesInscriptos');
            tabla.innerHTML = '';
            
            const row = createEmptyRow('Error al cargar inscripciones');
            tabla.appendChild(row);
        });
}

function loadAvailableExams() {
    // Cargar exámenes disponibles para inscripción
    fetchWithAuth('/api/estudiante/examenes/disponibles')
        .then(response => response.json())
        .then(examenes => {
            const tabla = document.getElementById('tablaExamenesDisponibles');
            tabla.innerHTML = '';
            
            if (examenes.length === 0) {
                const row = createEmptyRow('No hay exámenes disponibles');
                tabla.appendChild(row);
                return;
            }
            
            examenes.forEach(examen => {
                const row = document.createElement('tr');
                
                // Formatear fechas para la vista
                const fechaMesa1 = examen.mesa1 ? new Date(examen.mesa1.fecha).toLocaleDateString() : 'No disponible';
                const fechaMesa2 = examen.mesa2 ? new Date(examen.mesa2.fecha).toLocaleDateString() : 'No disponible';
                
                row.innerHTML = `
                    <td>${examen.materia}</td>
                    <td>${fechaMesa1}</td>
                    <td>${fechaMesa2}</td>
                    <td>${examen.tipo}</td>
                    <td>
                        <button class="btn btn-sm btn-primary btn-inscribir" 
                                data-materia-id="${examen.id}" 
                                data-bs-toggle="modal" 
                                data-bs-target="#modalSeleccionMesa">
                            Inscribirse
                        </button>
                    </td>
                `;
                
                tabla.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar exámenes disponibles:', error);
            const tabla = document.getElementById('tablaExamenesDisponibles');
            tabla.innerHTML = '';
            
            const row = createEmptyRow('Error al cargar exámenes');
            tabla.appendChild(row);
        });
}

function showExamOptions(materiaId) {
    // Buscar información detallada sobre las mesas de examen para la materia
    fetchWithAuth(`/api/estudiante/examenes/materia/${materiaId}`)
        .then(response => response.json())
        .then(data => {
            // Establecer título del modal
            document.getElementById('modalMateriaTitulo').textContent = `Materia: ${data.materia}`;
            
            // Llenar tabla de mesas de examen
            const tablaMesas = document.getElementById('tablaMesasExamen');
            tablaMesas.innerHTML = '';
            
            // Agregar mesa 1
            if (data.mesa1) {
                const rowMesa1 = document.createElement('tr');
                rowMesa1.innerHTML = `
                    <td>Mesa 1</td>
                    <td>${new Date(data.mesa1.fecha).toLocaleDateString()}</td>
                    <td>${data.mesa1.horario}</td>
                    <td>${data.mesa1.aula}</td>
                    <td>
                        <button class="btn btn-sm btn-success btn-seleccionar-mesa" 
                                data-materia-id="${materiaId}" 
                                data-mesa-id="${data.mesa1.id}">
                            Seleccionar
                        </button>
                    </td>
                `;
                tablaMesas.appendChild(rowMesa1);
            }
            
            // Agregar mesa 2
            if (data.mesa2) {
                const rowMesa2 = document.createElement('tr');
                rowMesa2.innerHTML = `
                    <td>Mesa 2</td>
                    <td>${new Date(data.mesa2.fecha).toLocaleDateString()}</td>
                    <td>${data.mesa2.horario}</td>
                    <td>${data.mesa2.aula}</td>
                    <td>
                        <button class="btn btn-sm btn-success btn-seleccionar-mesa" 
                                data-materia-id="${materiaId}" 
                                data-mesa-id="${data.mesa2.id}">
                            Seleccionar
                        </button>
                    </td>
                `;
                tablaMesas.appendChild(rowMesa2);
            }
            
            // Si no hay mesas disponibles
            if (!data.mesa1 && !data.mesa2) {
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.colSpan = 5;
                cell.className = 'text-center text-muted';
                cell.textContent = 'No hay mesas de examen disponibles';
                row.appendChild(cell);
                tablaMesas.appendChild(row);
            }
        })
        .catch(error => {
            console.error('Error al cargar información de mesas:', error);
            const tablaMesas = document.getElementById('tablaMesasExamen');
            tablaMesas.innerHTML = '';
            
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 5;
            cell.className = 'text-center text-danger';
            cell.textContent = 'Error al cargar información de mesas';
            row.appendChild(cell);
            tablaMesas.appendChild(row);
        });
}

function registerForExam(materiaId, mesaId) {
    // Inscribir al estudiante en la mesa de examen seleccionada
    fetchWithAuth('/api/estudiante/examenes/inscribir', {
        method: 'POST',
        body: JSON.stringify({
            materiaId: materiaId,
            mesaId: mesaId
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message || 'Error desconocido') });
        }
        return response.json();
    })
    .then(data => {
        // Cerrar el modal
        const modalElement = document.getElementById('modalSeleccionMesa');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        
        // Mostrar mensaje de éxito
        alert('Inscripción exitosa');
        
        // Recargar listas de exámenes
        loadRegisteredExams();
        loadAvailableExams();
    })
    .catch(error => {
        console.error('Error al inscribirse en el examen:', error);
        alert(`Error al inscribirse: ${error.message}`);
    });
}

function createEmptyRow(message) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.className = 'text-center text-muted';
    cell.textContent = message;
    row.appendChild(cell);
    return row;
}

// Hacer disponible la función loadExams globalmente
window.loadExams = loadExams;