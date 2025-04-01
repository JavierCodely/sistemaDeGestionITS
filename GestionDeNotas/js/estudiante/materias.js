// materias.js - Gestión de materias

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tabs de materias
    initSubjectTabs();
});

function initSubjectTabs() {
    // Agregar event listeners a los tabs si no se están usando los Bootstrap tabs
    document.getElementById('cursando-tab').addEventListener('click', function() {
        showSubjectTab('cursando');
    });
    
    document.getElementById('aprobadas-tab').addEventListener('click', function() {
        showSubjectTab('aprobadas');
    });
    
    document.getElementById('pendientes-tab').addEventListener('click', function() {
        showSubjectTab('pendientes');
    });
}

function showSubjectTab(tabId) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-pane').forEach(tab => {
        tab.classList.remove('show', 'active');
    });
    
    // Mostrar el tab seleccionado
    document.getElementById(tabId).classList.add('show', 'active');
    
    // Actualizar clases active en los botones de tab
    document.querySelectorAll('[role="presentation"] .nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`${tabId}-tab`).classList.add('active');
}

function loadSubjects() {
    // Cargar materias cursando
    loadCurrentSubjects();
    
    // Cargar materias aprobadas
    loadApprovedSubjects();
    
    // Cargar materias pendientes
    loadPendingSubjects();
}

function loadCurrentSubjects() {
    // Cargar materias que está cursando actualmente
    fetchWithAuth('/api/estudiante/materias/cursando')
        .then(response => response.json())
        .then(materias => {
            const tabla = document.getElementById('tablaMateriasCursando');
            tabla.innerHTML = '';
            
            if (materias.length === 0) {
                const row = createEmptyRow('No hay materias en curso');
                tabla.appendChild(row);
                return;
            }
            
            materias.forEach(materia => {
                const row = document.createElement('tr');
                
                // Determinar clase según la nota
                let claseEstado = '';
                let textoEstado = '';
                
                if (materia.notaActual >= 7) {
                    claseEstado = 'text-success';
                    textoEstado = 'Promoción';
                } else if (materia.notaActual >= 4) {
                    claseEstado = 'text-warning';
                    textoEstado = 'Regular';
                } else {
                    claseEstado = 'text-danger';
                    textoEstado = 'Insuficiente';
                }
                
                row.innerHTML = `
                    <td>${materia.nombre}</td>
                    <td>${materia.notaActual || 'Sin calificar'}</td>
                    <td class="${claseEstado}">${textoEstado}</td>
                `;
                
                tabla.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar materias en curso:', error);
            const tabla = document.getElementById('tablaMateriasCursando');
            tabla.innerHTML = '';
            
            const row = createEmptyRow('Error al cargar materias');
            tabla.appendChild(row);
        });
}

function loadApprovedSubjects() {
    // Cargar materias aprobadas
    fetchWithAuth('/api/estudiante/materias/aprobadas')
        .then(response => response.json())
        .then(materias => {
            const tabla = document.getElementById('tablaMateriasAprobadas');
            tabla.innerHTML = '';
            
            if (materias.length === 0) {
                const row = createEmptyRow('No hay materias aprobadas');
                tabla.appendChild(row);
                return;
            }
            
            materias.forEach(materia => {
                const row = document.createElement('tr');
                
                // Determinar clase según la nota
                let claseNota = '';
                
                if (materia.notaFinal >= 8) {
                    claseNota = 'text-success';
                } else if (materia.notaFinal >= 6) {
                    claseNota = 'text-primary';
                } else {
                    claseNota = 'text-warning';
                }
                
                row.innerHTML = `
                    <td>${materia.nombre}</td>
                    <td class="${claseNota}">${materia.notaFinal}</td>
                    <td>${new Date(materia.fecha).toLocaleDateString()}</td>
                `;
                
                tabla.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar materias aprobadas:', error);
            const tabla = document.getElementById('tablaMateriasAprobadas');
            tabla.innerHTML = '';
            
            const row = createEmptyRow('Error al cargar materias');
            tabla.appendChild(row);
        });
}

function loadPendingSubjects() {
    // Cargar materias pendientes
    fetchWithAuth('/api/estudiante/materias/pendientes')
        .then(response => response.json())
        .then(materias => {
            const tabla = document.getElementById('tablaMateriasPendientes');
            tabla.innerHTML = '';
            
            if (materias.length === 0) {
                const row = createEmptyRow('No hay materias pendientes');
                tabla.appendChild(row);
                return;
            }
            
            materias.forEach(materia => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${materia.nombre}</td>
                    <td>${materia.requisitos || 'Sin requisitos'}</td>
                `;
                
                tabla.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar materias pendientes:', error);
            const tabla = document.getElementById('tablaMateriasPendientes');
            tabla.innerHTML = '';
            
            const row = createEmptyRow('Error al cargar materias');
            tabla.appendChild(row);
        });
}

function createEmptyRow(message) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 3;
    cell.className = 'text-center text-muted';
    cell.textContent = message;
    row.appendChild(cell);
    return row;
}

// Hacer disponible la función loadSubjects globalmente
window.loadSubjects = loadSubjects;