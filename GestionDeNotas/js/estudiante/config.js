// config.js - Configuración de la aplicación

// Configuración de la API
const API_CONFIG = {
    // URL base de la API
    BASE_URL: 'http://api.example.com', // Cambiar en producción
    
    // Endpoints para estudiantes
    ENDPOINTS: {
        MATERIAS_CURSANDO: '/api/estudiante/materias/cursando',
        MATERIAS_APROBADAS: '/api/estudiante/materias/aprobadas',
        MATERIAS_PENDIENTES: '/api/estudiante/materias/pendientes',
        EXAMENES_INSCRIPTOS: '/api/estudiante/examenes/inscriptos',
        EXAMENES_DISPONIBLES: '/api/estudiante/examenes/disponibles',
        EXAMENES_MATERIA: '/api/estudiante/examenes/materia/', // Agregar ID al final
        INSCRIBIR_EXAMEN: '/api/estudiante/examenes/inscribir',
        PROXIMO_EXAMEN: '/api/estudiante/proximo-examen'
    },
    
    // Opciones por defecto para las peticiones fetch
    DEFAULT_OPTIONS: {
        headers: {
            'Content-Type': 'application/json'
        }
    },
    
    // Tiempo de espera para las peticiones (en milisegundos)
    TIMEOUT: 30000
};

// Configuración de la aplicación
const APP_CONFIG = {
    // Modo de desarrollo
    DEBUG: true,
    
    // Usar datos simulados en desarrollo
    USE_MOCK_DATA: true,
    
    // Recargar datos automáticamente (en milisegundos, 0 para desactivar)
    AUTO_REFRESH: 0
};

// Función para determinar si estamos en un entorno de desarrollo
function isDevelopment() {
    return location.hostname === 'localhost' || location.hostname === '127.0.0.1' || APP_CONFIG.DEBUG;
}

// Exportar configuración
window.CONFIG = {
    API: API_CONFIG,
    APP: APP_CONFIG,
    isDevelopment: isDevelopment
};

// Configuración de mensajes
window.MESSAGES = {
    ERROR: {
        API_ERROR: 'Error al comunicarse con el servidor. Por favor, intente nuevamente más tarde.',
        SESSION_EXPIRED: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
        NOT_FOUND: 'Recurso no encontrado. Por favor, verifique la URL e intente nuevamente.',
        UNAUTHORIZED: 'No tiene permisos para acceder a este recurso.',
        VALIDATION: 'Por favor, verifique los datos ingresados e intente nuevamente.'
    },
    SUCCESS: {
        EXAM_REGISTRATION: 'Inscripción a examen exitosa.',
        UPDATE_PROFILE: 'Perfil actualizado correctamente.'
    },
    INFO: {
        LOADING: 'Cargando datos...',
        NO_DATA: 'No hay datos disponibles.'
    }
};

// Integración con la funcionalidad de autenticación
document.addEventListener('DOMContentLoaded', function() {
    // Sobrescribir fetchWithAuth para usar la configuración
    const originalFetchWithAuth = window.fetchWithAuth;
    
    window.fetchWithAuth = function(endpoint, options = {}) {
        // Construir URL completa
        const url = endpoint.startsWith('http') ? endpoint : CONFIG.API.BASE_URL + endpoint;
        
        // Combinar opciones por defecto con las proporcionadas
        const mergedOptions = {
            ...CONFIG.API.DEFAULT_OPTIONS,
            ...options,
            headers: {
                ...CONFIG.API.DEFAULT_OPTIONS.headers,
                ...(options.headers || {})
            }
        };
        
        // Si estamos en desarrollo y usamos datos simulados, usar mockFetch
        if (isDevelopment() && APP_CONFIG.USE_MOCK_DATA) {
            console.log(`[DEV] Usando datos simulados para: ${endpoint}`);
            return window.mockFetch ? window.mockFetch(endpoint, mergedOptions) : originalFetchWithAuth(url, mergedOptions);
        }
        
        // En producción o si no se usan datos simulados, usar la función original
        return originalFetchWithAuth(url, mergedOptions);
    };
});