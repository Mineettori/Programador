document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (!backgroundMusic) {
        // Se não há elemento de áudio nesta página, pode ser uma página "não-pergunta"
        // Limpa o tempo da música para garantir o reset ao voltar para as páginas de pergunta
        localStorage.removeItem('musicPlaybackTime');
        return; // Sai da função se não houver áudio para controlar
    }

    const isQuestionPage = window.location.pathname.includes('perguntas1', 'perguntas2', 'perguntas3', 'perguntas4'); // Ajuste conforme seus nomes de arquivo
    const lastPageWasQuestion = localStorage.getItem('lastPageWasQuestion') === 'true';

    // Ao carregar a página
    if (isQuestionPage) {
        // Verifica se viemos de uma página "não-pergunta"
        // Ou se é a primeira vez que a página de pergunta é acessada nesta sessão
        if (!lastPageWasQuestion) {
            // Se viemos de uma página não-pergunta ou é a primeira vez, resetar a música
            backgroundMusic.currentTime = 0;
            backgroundMusic.play().catch(e => console.error("Erro ao tocar música:", e));
        } else {
            // Se viemos de outra página de pergunta, tentar retomar de onde parou
            const savedTime = parseFloat(localStorage.getItem('musicPlaybackTime'));
            if (!isNaN(savedTime) && savedTime > 0) {
                backgroundMusic.currentTime = savedTime;
            }
            backgroundMusic.play().catch(e => console.error("Erro ao tocar música:", e));
        }
        // Marca que a página atual é uma página de pergunta
        localStorage.setItem('lastPageWasQuestion', 'true');
    } else {
        // Se for uma página "não-pergunta", garante que o estado da música seja limpo
        localStorage.removeItem('musicPlaybackTime');
        localStorage.setItem('lastPageWasQuestion', 'false');
        backgroundMusic.pause(); // Opcional: pausar a música se ela estiver em uma página não-pergunta
        backgroundMusic.currentTime = 0; // Opcional: resetar a música imediatamente
    }

    // Salva o tempo atual da música antes de sair da página (para páginas de pergunta)
        window.addEventListener('beforeunload', () => {
        if (isQuestionPage) {
            localStorage.setItem('musicPlaybackTime', backgroundMusic.currentTime.toString());
        }
        // Não é necessário limpar localStorage aqui, pois isso é feito no carregamento da página destino
    });

    // Opcional: Controles para o usuário (pausar/tocar) se desejar
    // backgroundMusic.volume = 0.5; // Ajuste o volume se necessário
});