// estudiante.js - Funcionalidad principal del dashboard de estudiante

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar navegación
    initNavigation();
    
    // Cargar datos de próximo examen
    loadNextExam();
    
    // Event listener para el botón de perfil
    document.getElementById('btnPerfil').addEventListener('click', showProfile);
});

function initNavigation() {
    // Agregar event listeners a los elementos de navegación
    document.getElementById('navInicio').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('seccionInicio');
    });
    
    document.getElementById('navMaterias').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('seccionMaterias');
        
        // Cargar datos de materias si aún no se han cargado
        if (!window.materiasLoaded) {
            loadSubjects();
            window.materiasLoaded = true;
        }
    });
    
    document.getElementById('navExamenes').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('seccionExamenes');
        
        // Cargar datos de exámenes si aún no se han cargado
        if (!window.examenesLoaded) {
            loadExams();
            window.examenesLoaded = true;
        }
    });
}

function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.card').forEach(section => {
        if (section.id.startsWith('seccion')) {
            section.classList.add('d-none');
        }
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionId).classList.remove('d-none');
    
    // Actualizar clases active en la navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Identificar qué elemento de navegación activar
    let navId;
    switch(sectionId) {
        case 'seccionInicio':
            navId = 'navInicio';
            break;
        case 'seccionMaterias':
            navId = 'navMaterias';
            break;
        case 'seccionExamenes':
            navId = 'navExamenes';
            break;
    }
    
    if (navId) {
        document.getElementById(navId).classList.add('active');
    }
}

function loadNextExam() {
    // Cargar información del próximo examen desde la API
    fetchWithAuth('/api/estudiante/proximo-examen')
        .then(response => response.json())
        .then(data => {
            if (data && data.materia && data.fecha) {
                document.getElementById('proximoExamen').textContent = `${data.materia} - ${data.fecha}`;
            } else {
                document.getElementById('proximoExamen').textContent = 'No hay exámenes programados';
            }
        })
        .catch(error => {
            console.error('Error al cargar próximo examen:', error);
            document.getElementById('proximoExamen').textContent = 'No disponible';
        });
}

function showProfile() {
    // Aquí podrías implementar la visualización del perfil completo
    alert('Funcionalidad de perfil no implementada aún');
}

// Exportar funciones para uso en otros módulos
window.dashboard = {
    showSection: showSection
};