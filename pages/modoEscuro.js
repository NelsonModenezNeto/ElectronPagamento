// Verifique se o modo escuro está ativado no armazenamento local
const darkModeEnabled = localStorage.getItem('darkMode') === 'true';

// Função para alternar entre os modos claro e escuro
function toggleDarkMode() {
    const body = document.body;
    const elementosComDarkMode = document.querySelectorAll('.dark-mode-element'); // Seleciona os elementos onde o modo escuro será aplicado

    // Adiciona ou remove a classe 'dark-mode' no corpo do documento HTML
    body.classList.toggle('dark-mode');

    // Adiciona ou remove a classe 'dark-mode' nos elementos específicos
    elementosComDarkMode.forEach(elemento => {
        elemento.classList.toggle('dark-mode');
    });

    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
}

window.addEventListener('DOMContentLoaded', () => {
    if (darkModeEnabled) {
    
        document.body.classList.add('dark-mode');

        const elementosComDarkMode = document.querySelectorAll('.dark-mode-element');
        elementosComDarkMode.forEach(elemento => {
            elemento.classList.add('dark-mode');
        });
    }
});
