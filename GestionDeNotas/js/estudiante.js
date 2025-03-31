document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM completamente cargado");
    
    // Obtener elementos de navegación
    const navInicio = document.getElementById('navInicio');
    const navMaterias = document.getElementById('navMaterias');
    const navExamenes = document.getElementById('navExamenes');
    
    // Verificar si los elementos existen
    if (!navMaterias || !navExamenes) {
        console.error("No se encontraron los elementos de navegación");
        return;
    }

    // Configurar eventos de clic
    navMaterias.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Clic en Mis Materias");
        mostrarSeccion('materias');
        cargarMaterias(); // Función que carga los datos de materias
    });
    
    //Inicio configuracion de evento
    navInicio.addEventListener("click",function (e) {
        e.preventDefault();
        mostrarSeccion('inicio');
    })

    navExamenes.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Clic en Exámenes");
        mostrarSeccion('examenes');
        cargarExamenes(); // Función que carga los datos de exámenes
    });
    
    // Mostrar sección de inicio por defecto
    mostrarSeccion('inicio');
});

function mostrarSeccion(seccion) {
    console.log("Mostrando sección:", seccion);
    
    // Ocultar todas las secciones
    const secciones = ['inicio', 'materias', 'examenes'];
    secciones.forEach(sec => {
        const elemento = document.getElementById(`seccion${capitalizeFirstLetter(sec)}`);
        if (elemento) {
            elemento.classList.add('d-none');
        }
    });
    
    // Mostrar la sección solicitada
    const seccionAMostrar = document.getElementById(`seccion${capitalizeFirstLetter(seccion)}`);
    if (seccionAMostrar) {
        seccionAMostrar.classList.remove('d-none');
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para cargar datos de materias
function cargarMaterias() {
    console.log("Cargando materias...");
    
    // Datos de prueba
    const materiasCursando = [
        { nombre: "Matemática II", cuatrimestre: "1er 2023", nota: 7.5, estado: "Cursando" },
        { nombre: "Programación I", cuatrimestre: "1er 2023", nota: 8.0, estado: "Cursando" }
    ];
    
    // Llenar la tabla
    const tabla = document.getElementById('tablaMateriasCursando');
    if (tabla) {
        tabla.innerHTML = materiasCursando.map(materia => `
            <tr>
                <td>${materia.nombre}</td>
                <td>${materia.cuatrimestre}</td>
                <td>${materia.nota}</td>
                <td><span class="badge bg-warning">${materia.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary">Detalles</button>
                </td>
            </tr>
        `).join('');
    }
}



// Función para cargar datos de exámenes
function cargarExamenes() {
    console.log("Cargando exámenes...");
    
    // Datos de prueba
    const examenesDisponibles = [
        { materia: "Matemática II", Primerafecha: "15/11/2025",Segundafecha: "20/11/2025", tipo: "Regular" },
        { materia: "Matemática 1", Primerafecha: "12/11/2025",Segundafecha: "16/11/2025", tipo: "Regular" },
        
    ];
    
    // Llenar la tabla
    const tabla = document.getElementById('tablaExamenesDisponibles');
    if (tabla) {
        tabla.innerHTML = examenesDisponibles.map(examen => `
            <tr>
                <td>${examen.materia}</td>
                <td>${examen.Primerafecha}</td>
                <td>${examen.Segundafecha}</td>
                <td>${examen.tipo}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-elegir-mesa">
                        Elegir Mesa
                    </button>
                </td>
            </tr>
        `).join('');
    }
}