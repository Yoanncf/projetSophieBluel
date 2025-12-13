// création des variables
const gallery = document.querySelector('.gallery');
const categoriesContainer = document.getElementById('categories');
const API = 'http://localhost:5678/api/works';
const API_CATEGORIES = 'http://localhost:5678/api/categories';
let allWorks = [];
let allCategories = [];
const loginLink = document.getElementById('login-link');
const editSection = document.querySelector('.edit-section');
const adminEdit = document.querySelector('.admin-edit');

//Appel à l’API avec fetch afin de récupérer dynamiquement les projets de l’architecte.
const fetchAllWorks = async () => {
  try {
    const result = await fetch(`${API}`);
    if (!result.ok) {
      console.error('Erreur API');
    }
    const data = await result.json();
    allWorks = data;
    displayGallery(allWorks);
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les works');
  }
};

fetchAllWorks();
//Fonction pour remplir la galerie avec les projets récupérés
const displayGallery = (works) => {
  gallery.innerHTML = '';
  works.forEach((work) => {
    const figure = figureWork(work);
    gallery.appendChild(figure);
  });
};

// Fonction pour creer un element figure avec son contenu

const figureWork = (work) => {
  const figure = document.createElement('figure');
  const image = document.createElement('img');
  image.src = work.imageUrl;
  image.alt = work.title;
  figure.appendChild(image);
  const figureCaption = document.createElement('figcaption');
  figureCaption.textContent = work.title;
  figure.appendChild(figureCaption);
  return figure;
};

const fetchAllCategories = async () => {
  try {
    const result = await fetch(`${API_CATEGORIES}`);
    if (!result.ok) {
      console.error('Erreur API');
    }
    const data = await result.json();
    data.unshift({ id: 0, name: 'Tous' });
    allCategories = data;
    console.log(data);
    for (let category of allCategories) {
      const button = document.createElement('button');
      button.textContent = category.name;
      button.setAttribute('data-id', category.id);
      categoriesContainer.appendChild(button);
      // Par défaut le filtre "Tous" est actif
      if (category.id === 0) {
        button.classList.add('active-filter');
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les catégories');
  }
};
fetchAllCategories();

categoriesContainer.addEventListener('click', (e) => {
  const allButtons = document.querySelectorAll('#categories button');
  if (e.target.getAttribute('data-id')) {
    allButtons.forEach((button) => {
      button.classList.remove('active-filter');
    });
    const categoryId = parseInt(e.target.getAttribute('data-id'));
    e.target.classList.add('active-filter');
    filterWorksByCategory(categoryId);
  }
});

const filterWorksByCategory = (categoryId) => {
  gallery.innerHTML = '';
  if (categoryId === 0) {
    for (let work of allWorks) {
      const figure = figureWork(work);
      gallery.appendChild(figure);
    }
  } else {
    const filteredWorks = allWorks.filter(
      (work) => work.categoryId === categoryId
    );
    for (let work of filteredWorks) {
      const figure = figureWork(work);
      gallery.appendChild(figure);
    }
  }
};

//fonction pour vérifier l'état de connexion
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  if (token) {
    loginLink.textContent = 'logout';
    loginLink.href = '#';
    loginLink.classList.add('logout-link');
    loginLink.removeEventListener('click', handleLogout);
    loginLink.addEventListener('click', handleLogout);
    editSection.style.display = 'block';
    categoriesContainer.style.display = 'none';
    adminEdit.innerHTML = '<button class="edit-button"> <i class="fas fa-pen-to-square"></i> Mode édition</button>';
    adminEdit.classList.add('black-edition');
  } else {
    // utilisateur non connecté
    loginLink.textContent = 'login';
    loginLink.href = 'login.html';
    categoriesContainer.style.display = 'flex';
    adminEdit.style.display = 'none';
    loginLink.classList.remove('logout-link');
    }
};

//gestion du logout
const handleLogout = (event) => {
  event.preventDefault();
  localStorage.removeItem('token');
  window.location.reload();
};

document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
});