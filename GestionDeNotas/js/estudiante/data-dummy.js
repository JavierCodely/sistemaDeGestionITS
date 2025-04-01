// data-dummy.js - Datos de prueba para desarrollo y testing

// Este archivo contiene datos simulados para probar la aplicación
// sin necesidad de tener una API real funcionando
// Reemplazar con llamadas reales a API cuando esté disponible

// Simular respuesta de la API (para desarrollo)
function mockFetch(url, options = {}) {
    return new Promise((resolve) => {
        console.log('Mock fetch:', url, options);
        
        // Pequeño retraso para simular petición de red
        setTimeout(() => {
            // Determinar qué datos devolver según la URL
            let responseData = {};
            
            if (url.includes('/api/estudiante/proximo-examen')) {
                responseData = {
                    materia: 'Matemática II',
                    fecha: '15/11/2025'
                };
            } 
            else if (url.includes('/api/estudiante/materias/cursando')) {
                responseData = [
                    {id: 1, nombre: 'Programación II', notaActual: 8.5},
                    {id: 2, nombre: 'Base de Datos', notaActual: 6.2},
                    {id: 3, nombre: 'Sistemas Operativos', notaActual: 7.0},
                    {id: 4, nombre: 'Matemática II', notaActual: 3.5},
                    {id: 5, nombre: 'Estadística', notaActual: 5.0}
                ];
            } 
            else if (url.includes('/api/estudiante/materias/aprobadas')) {
                responseData = [
                    {id: 6, nombre: 'Programación I', notaFinal: 9, fecha: '2024-12-15'},
                    {id: 7, nombre: 'Introducción a la Informática', notaFinal: 8, fecha: '2024-07-22'},
                    {id: 8, nombre: 'Matemática I', notaFinal: 7, fecha: '2024-12-10'},
                    {id: 9, nombre: 'Inglés I', notaFinal: 10, fecha: '2024-07-05'},
                    {id: 10, nombre: 'Física I', notaFinal: 6, fecha: '2024-12-20'}
                ];
            } 
            else if (url.includes('/api/estudiante/materias/pendientes')) {
                responseData = [
                    {id: 11, nombre: 'Redes', requisitos: 'Sistemas Operativos'},
                    {id: 12, nombre: 'Programación III', requisitos: 'Programación II'},
                    {id: 13, nombre: 'Base de Datos II', requisitos: 'Base de Datos'},
                    {id: 14, nombre: 'Inglés II', requisitos: 'Inglés I'},
                    {id: 15, nombre: 'Física II', requisitos: 'Física I, Matemática II'}
                ];
            } 
            else if (url.includes('/api/estudiante/examenes/inscriptos')) {
                responseData = [
                    {id: 101, materia: 'Física I', fecha: '2025-05-10', tipo: 'Final'},
                    {id: 102, materia: 'Matemática I', fecha: '2025-05-15', tipo: 'Final'}
                ];
            } 
            else if (url.includes('/api/estudiante/examenes/disponibles')) {
                responseData = [
                    {
                        id: 201, 
                        materia: 'Programación II', 
                        tipo: 'Final',
                        mesa1: {id: 301, fecha: '2025-06-10', horario: '14:00', aula: 'Lab 3'},
                        mesa2: {id: 302, fecha: '2025-06-24', horario: '16:00', aula: 'Lab 2'}
                    },
                    {
                        id: 202, 
                        materia: 'Base de Datos', 
                        tipo: 'Final',
                        mesa1: {id: 303, fecha: '2025-06-12', horario: '10:00', aula: 'Aula 105'},
                        mesa2: {id: 304, fecha: '2025-06-26', horario: '10:00', aula: 'Aula 107'}
                    },
                    {
                        id: 203, 
                        materia: 'Sistemas Operativos', 
                        tipo: 'Final',
                        mesa1: {id: 305, fecha: '2025-06-15', horario: '18:00', aula: 'Lab 5'},
                        mesa2: {id: 306, fecha: '2025-06-29', horario: '16:00', aula: 'Lab 5'}
                    }
                ];
            } 
            else if (url.includes('/api/estudiante/examenes/materia/')) {
                // Extraer el ID de la materia de la URL
                const materiaId = url.split('/').pop();
                
                // Buscar en los datos de exámenes disponibles
                const examenData = {
                    id: materiaId,
                    materia: 'Materia no encontrada',
                    mesa1: null,
                    mesa2: null
                };
                
                // Encontrar el examen correspondiente
                const examenesDisponibles = [
                    {
                        id: 201, 
                        materia: 'Programación II', 
                        mesa1: {id: 301, fecha: '2025-06-10', horario: '14:00', aula: 'Lab 3'},
                        mesa2: {id: 302, fecha: '2025-06-24', horario: '16:00', aula: 'Lab 2'}
                    },
                    {
                        id: 202, 
                        materia: 'Base de Datos', 
                        mesa1: {id: 303, fecha: '2025-06-12', horario: '10:00', aula: 'Aula 105'},
                        mesa2: {id: 304, fecha: '2025-06-26', horario: '10:00', aula: 'Aula 107'}
                    },
                    {
                        id: 203, 
                        materia: 'Sistemas Operativos', 
                        mesa1: {id: 305, fecha: '2025-06-15', horario: '18:00', aula: 'Lab 5'},
                        mesa2: {id: 306, fecha: '2025-06-29', horario: '16:00', aula: 'Lab 5'}
                    }
                ];
                
                const examen = examenesDisponibles.find(e => e.id == materiaId);
                if (examen) {
                    responseData = examen;
                } else {
                    responseData = examenData;
                }
            } 
            else if (url.includes('/api/estudiante/examenes/inscribir') && options.method === 'POST') {
                // Simular inscripción exitosa
                responseData = {
                    success: true,
                    message: 'Inscripción exitosa',
                    inscripcion: {
                        id: Math.floor(Math.random() * 1000),
                        materiaId: JSON.parse(options.body).materiaId,
                        mesaId: JSON.parse(options.body).mesaId,
                        fecha: new Date().toISOString()
                    }
                };
            }
            
            resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(responseData)
            });
        }, 300); // Retraso de 300ms para simular latencia de red
    });
}

// Datos de usuario de prueba
const userData = {
    id: 12345,
    nombre: 'Lisandro',
    nombreCompleto: 'Lisandro Recalde',
    dni: '35123456',
    carrera: 'Tecnicatura en Tecnologia de la Informacion',
    fotoPerfil: 'img/brave_screenshot_web.whatsapp.com.png',
    promedio: 8.5,
    materiasAprobadas: 20,
    materiasCursando: 5
};

// Reemplazar la función fetchWithAuth con nuestra versión simulada
// Solo para desarrollo - quitar en producción
window.fetchWithAuthOriginal = window.fetchWithAuth;

window.fetchWithAuth = function(url, options = {}) {
    // En desarrollo, usar mockFetch
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        return mockFetch(url, options);
    }
    
    // En producción, usar la función original
    return window.fetchWithAuthOriginal(url, options);
};

// Inicializar datos de prueba
document.addEventListener('DOMContentLoaded', function() {
    // Guardar datos de usuario simulado en localStorage (solo para desarrollo)
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        if (!localStorage.getItem('userToken')) {
            localStorage.setItem('userToken', 'fake-jwt-token-for-development-1234567890');
        }
        
        if (!localStorage.getItem('userData')) {
            localStorage.setItem('userData', JSON.stringify(userData));
        }
    }
    
    console.log('Datos de prueba inicializados para desarrollo');
});

// Funciones de utilidad para pruebas
function resetTestData() {
    // Restablecer datos de prueba (útil para debugging)
    localStorage.setItem('userToken', 'fake-jwt-token-for-development-1234567890');
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('Datos de prueba restablecidos');
    
    // Recargar la página para ver los cambios
    location.reload();
}

// Exponer funciones para pruebas desde la consola
window.testUtils = {
    resetTestData: resetTestData,
    clearData: function() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        console.log('Datos eliminados');
        
        // Redirigir al login
        location.href = 'login.html';
    }
};

// Función para simular una actualización de estado después de una inscripción
function updateExamState(materiaId, mesaId) {
    // Esta función simula lo que ocurriría si el backend actualizara el estado
    // después de una inscripción exitosa
    
    // 1. Remover el examen de la lista de disponibles
    const examenesDisponibles = document.getElementById('tablaExamenesDisponibles');
    const filas = examenesDisponibles.querySelectorAll('tr');
    
    filas.forEach(fila => {
        const boton = fila.querySelector('.btn-inscribir');
        if (boton && boton.getAttribute('data-materia-id') === materiaId) {
            fila.remove();
        }
    });
    
    // 2. Agregar a la lista de inscritos (normalmente esto vendría del servidor)
    // Pero simulamos con los datos que tenemos
    const examenesDisponiblesData = [
        {
            id: 201, 
            materia: 'Programación II', 
            tipo: 'Final',
            mesa1: {id: 301, fecha: '2025-06-10', horario: '14:00', aula: 'Lab 3'},
            mesa2: {id: 302, fecha: '2025-06-24', horario: '16:00', aula: 'Lab 2'}
        },
        {
            id: 202, 
            materia: 'Base de Datos', 
            tipo: 'Final',
            mesa1: {id: 303, fecha: '2025-06-12', horario: '10:00', aula: 'Aula 105'},
            mesa2: {id: 304, fecha: '2025-06-26', horario: '10:00', aula: 'Aula 107'}
        },
        {
            id: 203, 
            materia: 'Sistemas Operativos', 
            tipo: 'Final',
            mesa1: {id: 305, fecha: '2025-06-15', horario: '18:00', aula: 'Lab 5'},
            mesa2: {id: 306, fecha: '2025-06-29', horario: '16:00', aula: 'Lab 5'}
        }
    ];
    
    const examen = examenesDisponiblesData.find(e => e.id == materiaId);
    
    if (examen) {
        // Encontrar la mesa seleccionada
        let mesaSeleccionada;
        if (examen.mesa1 && examen.mesa1.id == mesaId) {
            mesaSeleccionada = examen.mesa1;
        } else if (examen.mesa2 && examen.mesa2.id == mesaId) {
            mesaSeleccionada = examen.mesa2;
        }
        
        if (mesaSeleccionada) {
            const tablaInscriptos = document.getElementById('tablaExamenesInscriptos');
            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                <td>${examen.materia}</td>
                <td>${new Date(mesaSeleccionada.fecha).toLocaleDateString()}</td>
                <td>${examen.tipo}</td>
            `;
            tablaInscriptos.appendChild(nuevaFila);
        }
    }
}

// Exponer para uso en cargaExamenes.js
window.testData = {
    updateExamState: updateExamState
};