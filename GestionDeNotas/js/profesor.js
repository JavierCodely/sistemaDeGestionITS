document.addEventListener('DOMContentLoaded', function() {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const dni = urlParams.get('dni');
    
    // Verificar autenticación
    if (!token || !dni) {
        window.location.href = 'login.html';
        return;
    }
    
    // Cargar datos del profesor desde el backend
    loadProfessorData(token, dni);
    
    // Manejar navegación
    setupNavigation();
    
    // Manejar búsqueda de alumno
    document.getElementById('btnBuscarAlumno')?.addEventListener('click', function() {
        const dniAlumno = document.getElementById('inputDNI').value;
        
        if (!dniAlumno) {
            alert('Por favor ingrese un DNI');
            return;
        }
        
        searchStudent(token, dniAlumno);
    });
    
    // Manejar guardado de nota
    document.getElementById('btnGuardarNota')?.addEventListener('click', function() {
        // Aquí iría la lógica para enviar los cambios al backend
        alert('Nota actualizada con éxito');
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarNota'));
        modal.hide();
    });
});

function setupNavigation() {
    document.getElementById('navInicioProf')?.addEventListener('click', function(e) {
        e.preventDefault();
        showSection('inicio');
    });
    
    document.getElementById('navBuscarAlumno')?.addEventListener('click', function(e) {
        e.preventDefault();
        showSection('buscarAlumno');
    });
    
    document.getElementById('navMateriasProf')?.addEventListener('click', function(e) {
        e.preventDefault();
        showSection('materiasProf');
    });
}

function showSection(section) {
    // Ocultar todas las secciones
    document.getElementById('seccionInicioProf')?.classList.add('d-none');
    document.getElementById('seccionBuscarAlumno')?.classList.add('d-none');
    document.getElementById('seccionMateriasProf')?.classList.add('d-none');
    
    // Mostrar la sección solicitada
    if (section === 'inicio') {
        document.getElementById('seccionInicioProf')?.classList.remove('d-none');
    } else if (section === 'buscarAlumno') {
        document.getElementById('seccionBuscarAlumno')?.classList.remove('d-none');
    } else if (section === 'materiasProf') {
        document.getElementById('seccionMateriasProf')?.classList.remove('d-none');
    }
}

function loadProfessorData(token, dni) {
    // Simular llamada al backend para obtener datos del profesor
    fetchProfessorData(token, dni)
        .then(professorData => {
            // Actualizar la interfaz con los datos del profesor
            updateProfessorUI(professorData);
            
            // Cargar materias asignadas al profesor
            loadProfessorSubjects(token, dni);
        })
        .catch(error => {
            console.error('Error al cargar datos del profesor:', error);
            window.location.href = 'login.html';
        });
}

function fetchProfessorData(token, dni) {
    return new Promise((resolve) => {
        // Simular llamada a API
        setTimeout(() => {
            resolve({
                nombre: 'Dr. Carlos Gómez',
                departamento: 'Departamento de Sistemas',
                materiasAsignadas: 3,
                alumnosACargo: 45,
                fotoPerfil: 'https://via.placeholder.com/150'
            });
        }, 500);
    });
}

function updateProfessorUI(professorData) {
    document.getElementById('nombreUsuarioProf')?.textContent = professorData.nombre.split(' ')[0];
    document.getElementById('nombreCompletoProf')?.textContent = professorData.nombre;
    document.getElementById('departamentoProf')?.textContent = professorData.departamento;
    document.getElementById('materiasAsignadas')?.textContent = professorData.materiasAsignadas;
    document.getElementById('alumnosACargo')?.textContent = professorData.alumnosACargo;
    document.getElementById('fotoPerfilProf')?.src = professorData.fotoPerfil;
}

function loadProfessorSubjects(token, dni) {
    // Simular llamada al backend para obtener materias del profesor
    fetchProfessorSubjects(token, dni)
        .then(subjects => {
            fillProfessorSubjects(subjects);
        });
}

function fetchProfessorSubjects(token, dni) {
    return new Promise((resolve) => {
        // Simular llamada a API
        setTimeout(() => {
            resolve([
                { 
                    id: 101, 
                    nombre: 'Programación I', 
                    cuatrimestre: '1er 2023',
                    alumnos: [
                        { id: 1, nombre: 'Juan Pérez', dni: '35678901', nota: 8.0, estado: 'cursando' },
                        { id: 2, nombre: 'María Gómez', dni: '40123456', nota: 7.5, estado: 'cursando' }
                    ]
                },
                { 
                    id: 102, 
                    nombre: 'Base de Datos', 
                    cuatrimestre: '2do 2023',
                    alumnos: [
                        { id: 1, nombre: 'Juan Pérez', dni: '35678901', nota: 6.5, estado: 'cursando' }
                    ]
                }
            ]);
        }, 500);
    });
}

function searchStudent(token, dniAlumno) {
    // Mostrar carga
    const searchBtn = document.getElementById('btnBuscarAlumno');
    const originalBtnText = searchBtn.innerHTML;
    searchBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';
    searchBtn.disabled = true;
    
    // Simular llamada al backend para buscar alumno
    fetchStudentByDNI(token, dniAlumno)
        .then(alumno => {
            // Mostrar datos del alumno
            displayStudentInfo(alumno);
            searchBtn.innerHTML = originalBtnText;
            searchBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error al buscar alumno:', error);
            document.getElementById('alertaAlumnoNoEncontrado')?.classList.remove('d-none');
            document.getElementById('cardInfoAlumno')?.classList.add('d-none');
            searchBtn.innerHTML = originalBtnText;
            searchBtn.disabled = false;
        });
}

function fetchStudentByDNI(token, dni) {
    return new Promise((resolve, reject) => {
        // Simular llamada a API
        setTimeout(() => {
            if (dni === '35678901') {
                resolve({
                    id: 1,
                    nombre: 'Juan Pérez',
                    dni: dni,
                    carrera: 'Ingeniería en Sistemas',
                    promedio: 8.2,
                    materiasAprobadas: 18,
                    materiasCursando: 5,
                    fotoPerfil: 'https://via.placeholder.com/100',
                    materias: [
                        { id: 101, nombre: 'Programación I', cuatrimestre: '1er 2023', nota: 8.0, estado: 'cursando' },
                        { id: 102, nombre: 'Base de Datos', cuatrimestre: '2do 2023', nota: 6.5, estado: 'cursando' }
                    ]
                });
            } else {
                reject(new Error('Alumno no encontrado'));
            }
        }, 800);
    });
}

function displayStudentInfo(alumno) {
    document.getElementById('nombreAlumno')?.textContent = alumno.nombre;
    document.getElementById('carreraAlumno')?.textContent = alumno.carrera;
    document.getElementById('dniAlumno')?.textContent = `DNI: ${alumno.dni}`;
    document.getElementById('fotoAlumno')?.src = alumno.fotoPerfil;
    document.getElementById('promedioAlumno')?.textContent = alumno.promedio;
    document.getElementById('aprobadasAlumno')?.textContent = alumno.materiasAprobadas;
    document.getElementById('cursandoAlumno')?.textContent = alumno.materiasCursando;
    
    // Llenar tabla de materias del alumno
    const tableBody = document.getElementById('tablaMateriasAlumno');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        alumno.materias.forEach(materia => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${materia.nombre}</td>
                <td>${materia.cuatrimestre}</td>
                <td><span class="badge badge-${materia.estado}">${materia.estado.charAt(0).toUpperCase() + materia.estado.slice(1)}</span></td>
                <td>${materia.nota || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary btn-editar-nota" 
                            data-id="${materia.id}" 
                            data-materia="${materia.nombre}" 
                            data-alumno="${alumno.nombre}" 
                            data-nota="${materia.nota || ''}" 
                            data-estado="${materia.estado}">
                        Editar
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // Mostrar card de alumno y ocultar alerta
    document.getElementById('cardInfoAlumno')?.classList.remove('d-none');
    document.getElementById('alertaAlumnoNoEncontrado')?.classList.add('d-none');
    
    // Agregar event listeners a los botones de edición
    document.querySelectorAll('.btn-editar-nota').forEach(button => {
        button.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('modalEditarNota'));
            
            // Llenar modal con datos
            document.getElementById('idRelacionMateria')?.value = this.getAttribute('data-id');
            document.getElementById('nombreMateriaEditar')?.value = this.getAttribute('data-materia');
            document.getElementById('nombreAlumnoEditar')?.value = this.getAttribute('data-alumno');
            document.getElementById('selectEstadoMateria')?.value = this.getAttribute('data-estado');
            document.getElementById('inputNota')?.value = this.getAttribute('data-nota');
            
            modal.show();
        });
    });
}

function fillProfessorSubjects(materias) {
    const tabsContainer = document.getElementById('materiasProfTab');
    const contentContainer = document.getElementById('materiasProfTabContent');
    
    if (!tabsContainer || !contentContainer) return;
    
    tabsContainer.innerHTML = '';
    contentContainer.innerHTML = '';
    
    materias.forEach((materia, index) => {
        // Crear tab
        const tab = document.createElement('li');
        tab.className = 'nav-item';
        tab.innerHTML = `
            <button class="nav-link ${index === 0 ? 'active' : ''}" 
                    id="tab-${materia.id}" 
                    data-bs-toggle="tab" 
                    data-bs-target="#content-${materia.id}" 
                    type="button">
                ${materia.nombre}
            </button>
        `;
        tabsContainer.appendChild(tab);
        
        // Crear contenido del tab
        const content = document.createElement('div');
        content.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
        content.id = `content-${materia.id}`;
        
        // Crear tabla de alumnos para la materia
        let tableHTML = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Alumno</th>
                            <th>DNI</th>
                            <th>Nota</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        materia.alumnos.forEach(alumno => {
            tableHTML += `
                <tr>
                    <td>${alumno.nombre}</td>
                    <td>${alumno.dni}</td>
                    <td>${alumno.nota || '-'}</td>
                    <td><span class="badge badge-${alumno.estado}">${alumno.estado.charAt(0).toUpperCase() + alumno.estado.slice(1)}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-editar-nota" 
                                data-id="${materia.id}" 
                                data-materia="${materia.nombre}" 
                                data-alumno="${alumno.nombre}" 
                                data-nota="${alumno.nota || ''}" 
                                data-estado="${alumno.estado}">
                            Editar
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        content.innerHTML = tableHTML;
        contentContainer.appendChild(content);
    });
    
    // Agregar event listeners a los botones de edición en las materias
    document.querySelectorAll('.btn-editar-nota').forEach(button => {
        button.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('modalEditarNota'));
            
            // Llenar modal con datos
            document.getElementById('idRelacionMateria')?.value = this.getAttribute('data-id');
            document.getElementById('nombreMateriaEditar')?.value = this.getAttribute('data-materia');
            document.getElementById('nombreAlumnoEditar')?.value = this.getAttribute('data-alumno');
            document.getElementById('selectEstadoMateria')?.value = this.getAttribute('data-estado');
            document.getElementById('inputNota')?.value = this.getAttribute('data-nota');
            
            modal.show();
        });
    });
}