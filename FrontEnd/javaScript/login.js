//Déclaration des variables globales
const API_LOGIN = 'http://localhost:5678/api/users/login';
// Fonction pour afficher le message d'erreur
const showError = () => {
  const errorMessage = document.getElementById('msg-error');
  if (errorMessage) {
    errorMessage.style.display = 'flex';
    // Masquer le message après 3 secondes
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 3000);
  }
};
// Fonction pour masquer le message d'erreur
const hideError = () => {
  const errorMessage = document.getElementById('msg-error');
  if (errorMessage) {
    errorMessage.style.display = 'none';
  }
};
// Fonction pour gérer la soumission du formulaire de connexion
const handleLogin = async (email, password) => {
  try {
    const response = await fetch(API_LOGIN, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la connexion');
    }
    const data = await response.json();
    console.log(data);
    if (data.token) {
      localStorage.setItem('token', data.token);
      // Redirection vers index.html en cas de succès
      window.location.href = 'index.html';
    } else {
      // Si pas de token, afficher l'erreur
      showError();
    }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    // Afficher le message d'erreur en cas d'échec
    showError();
  }
};
// Attendre que le DOM soit chargé avant d'attacher les événements
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) {
    console.error("Le formulaire de connexion n'a pas été trouvé");
    return;
  }
  // Masquer le message d'erreur au chargement de la page
  hideError();
  // Écouter la soumission du formulaire
  loginForm.addEventListener('submit', (event) => {
    // Empêcher la soumission par défaut du formulaire
    event.preventDefault();
    event.stopPropagation();
    // Récupérer les valeurs du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Validation basique
    if (!email || !password) {
      showError();
      return;
    }
    // Masquer l'erreur avant de tenter la connexion
    hideError();
    // Appeler la fonction de connexion
    handleLogin(email, password);
  });
});
