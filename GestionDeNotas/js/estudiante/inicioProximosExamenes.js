// inicio.js - Carga de información para la sección de Bienvenida

document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos de próximos exámenes
    loadProximosExamenes();
});

function loadProximosExamenes() {
    // Elemento donde mostraremos los próximos exámenes
    const proximosExamenesContainer = document.getElementById('proximosExamenesContainer');
    
    // Intentar cargar datos del servidor
    fetchWithAuth('/api/estudiante/examenes/proximos')
        .then(response => response.json())
        .then(data => {
            mostrarProximosExamenes(data, proximosExamenesContainer);
        })
        .catch(error => {
            console.error('Error al cargar próximos exámenes:', error);
            // En caso de error, usar datos de prueba
            mostrarDatosPrueba(proximosExamenesContainer);
        });
}

function mostrarProximosExamenes(examenes, container) {
    // Limpiar el contenedor
    container.innerHTML = '';
    
    if (!examenes || examenes.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No tienes exámenes próximos programados.</div>';
        return;
    }
    
    // Crear tabla de exámenes
    const table = document.createElement('table');
    table.className = 'table table-hover table-sm';
    
    // Crear encabezado
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Materia</th>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Aula</th>
            <th>Tipo</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');
    
    examenes.forEach(examen => {
        const row = document.createElement('tr');
        
        // Determinar si la fecha es próxima (menos de 7 días)
        const fechaExamen = new Date(examen.fecha.split('/').reverse().join('-'));
        const hoy = new Date();
        const diasFaltantes = Math.floor((fechaExamen - hoy) / (1000 * 60 * 60 * 24));
        
        // Agregar clase para destacar exámenes próximos
        if (diasFaltantes <= 7 && diasFaltantes >= 0) {
            row.className = 'table-warning';
        }
        
        row.innerHTML = `
            <td>${examen.materia}</td>
            <td>${examen.fecha}</td>
            <td>${examen.horario}</td>
            <td>${examen.aula}</td>
            <td><span class="badge ${examen.tipo === 'Libre' ? 'bg-secondary' : 'bg-primary'}">${examen.tipo}</span></td>
        `;
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
}

function mostrarDatosPrueba(container) {
    // Datos de prueba para exámenes próximos
    const examenesPrueba = [
        {
            materia: "Matemática II",
            fecha: "15/11/2023",
            horario: "09:00",
            aula: "Aula 10",
            tipo: "Regular"
        },
        {
            materia: "Programación I",
            fecha: "18/11/2023",
            horario: "10:00",
            aula: "Aula 8",
            tipo: "Regular"
        },
        {
            materia: "Programación I",
            fecha: "05/12/2023",
            horario: "16:00",
            aula: "Aula 3",
            tipo: "Libre"
        }
    ];
    
    mostrarProximosExamenes(examenesPrueba, container);
}

// Función para ordenar exámenes por fecha (más cercana primero)
function ordenarExamenesPorFecha(examenes) {
    return examenes.sort((a, b) => {
        const fechaA = new Date(a.fecha.split('/').reverse().join('-'));
        const fechaB = new Date(b.fecha.split('/').reverse().join('-'));
        return fechaA - fechaB;
    });
}

// Exportar funciones para uso en otros módulos
window.inicioFunctions = {
    loadProximosExamenes: loadProximosExamenes
};