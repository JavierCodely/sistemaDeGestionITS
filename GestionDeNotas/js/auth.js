document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const dni = document.getElementById('dni').value;
            const password = document.getElementById('password').value;
            
            // Validación básica del DNI
            if (!/^[0-9]{7,8}$/.test(dni)) {
                showError('El DNI debe contener 7 u 8 dígitos');
                return;
            }
            
            // Validación básica de la contraseña
            if (password.length < 6) {
                showError('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            // Mostrar carga
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verificando...';
            submitBtn.disabled = true;
            
            // Simular autenticación con el backend
            authenticateUser(dni, password)
                .then(response => {
                    // Redirigir según el tipo de usuario
                    if (response.userType === 'estudiante') {
                        window.location.href = `dashboard-estudiante.html?token=${response.token}&dni=${dni}`;
                    } else if (response.userType === 'profesor') {
                        window.location.href = `dashboard-profesor.html?token=${response.token}&dni=${dni}`;
                    }
                })
                .catch(error => {
                    showError(error.message);
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});

function showError(message) {
    const errorElement = document.getElementById('loginError');
    errorElement.textContent = message;
    errorElement.classList.remove('d-none');
    setTimeout(() => {
        errorElement.classList.add('d-none');
    }, 5000);
}

// Función para simular autenticación con el backend
function authenticateUser(dni, password) {
    return new Promise((resolve, reject) => {
        // Simular llamada a API con timeout
        setTimeout(() => {
            // Simular lógica de autenticación
            if (dni === '12345678' && password === '123456') {
                // Simular estudiante
                resolve({
                    token: 'simulated-jwt-token-student',
                    userType: 'estudiante'
                });
            } else if (dni === '87654321' && password === '123456') {
                // Simular profesor
                resolve({
                    token: 'simulated-jwt-token-teacher',
                    userType: 'profesor'
                });
            } else {
                reject(new Error('DNI o contraseña incorrectos'));
            }
        }, 1500);
    });
}