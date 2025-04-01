// integration.js - Integración de todos los módulos

document.addEventListener('DOMContentLoaded', function() {
    // Integrar todos los módulos
    initializeAllModules();
    
    // Configurar interacción entre módulos
    setupModuleCommunication();
});

function initializeAllModules() {
    console.log('Inicializando módulos...');
    
    // Inicializar en orden adecuado
    
    // 1. Primero autenticación y configuración
    if (typeof checkAuthentication === 'function') {
        checkAuthentication();
    } else {
        console.warn('Módulo de autenticación no cargado');
    }
    
    // 2. Inicializar navegación y UI base
    if (typeof initNavigation === 'function') {
        initNavigation();
    } else {
        console.warn('Módulo de navegación no cargado');
    }
    
    // 3. Inicializar funcionalidad de materias
    if (typeof initSubjectTabs === 'function') {
        initSubjectTabs();
    } else {
        console.warn('Módulo de materias no cargado');
    }
    
    // 4. Inicializar funcionalidad de exámenes
    if (typeof initExams === 'function') {
        initExams();
    } else {
        console.warn('Módulo de exámenes no cargado');
    }
    
    // 5. Cargar datos iniciales
    loadInitialData();
}

function setupModuleCommunication() {
    // Configurar comunicación entre módulos
    
    // Ejemplo: Al inscribirse a un examen, actualizar la lista de próximos exámenes
    document.addEventListener('examRegistered', function(event) {
        if (typeof loadNextExam === 'function') {
            loadNextExam();
        }
    });
    
    // Ejemplo: Al cambiar de sección, actualizar datos si es necesario
    if (window.dashboard && window.dashboard.showSection) {
        const originalShowSection = window.dashboard.showSection;
        
        window.dashboard.showSection = function(sectionId) {
            // Llamar a la función original
            originalShowSection(sectionId);
            
            // Acciones adicionales según la sección
            if (sectionId === 'seccionExamenes' && typeof loadExams === 'function') {
                loadExams();
            } else if (sectionId === 'seccionMaterias' && typeof loadSubjects === 'function') {
                loadSubjects();
            }
        };
    }
    
    // Comportamiento personalizado para botones de inscripción
    customizeExamRegistrationBehavior();
}

function loadInitialData() {
    // Cargar datos iniciales para la pantalla principal
    if (typeof loadNextExam === 'function') {
        loadNextExam();
    }
}

function customizeExamRegistrationBehavior() {
    // Personalizar el comportamiento de los botones de inscripción
    
    // Sobrescribir la función registerForExam para incluir actualización de UI
    if (typeof registerForExam === 'function') {
        const originalRegisterForExam = registerForExam;
        
        window.registerForExam = function(materiaId, mesaId) {
            // Llamar a la función original
            const promise = originalRegisterForExam(materiaId, mesaId);
            
            // Añadir comportamiento adicional
            promise.then(function(data) {
                // Disparar evento personalizado
                const event = new CustomEvent('examRegistered', { 
                    detail: { 
                        materiaId: materiaId, 
                        mesaId: mesaId,
                        data: data
                    } 
                });
                document.dispatchEvent(event);
                
                // Si estamos usando datos simulados, actualizar UI manualmente
                if (window.CONFIG && window.CONFIG.APP.USE_MOCK_DATA && window.testData) {
                    window.testData.updateExamState(materiaId, mesaId);
                }
            });
            
            return promise;
        };
    }
    
    // Añadir confirmación antes de inscribirse
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('btn-seleccionar-mesa')) {
            // Prevenir comportamiento por defecto
            e.preventDefault();
            
            // Confirmar antes de continuar
            if (confirm('¿Está seguro que desea inscribirse en esta mesa de examen?')) {
                const materiaId = e.target.getAttribute('data-materia-id');
                const mesaId = e.target.getAttribute('data-mesa-id');
                
                if (typeof registerForExam === 'function') {
                    registerForExam(materiaId, mesaId);
                }
            }
        }
    }, true);
}