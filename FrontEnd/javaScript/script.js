// création des variables
const gallery = document.querySelector(".gallery");
const categoriesContainer = document.getElementById("categories");
const API = "http://localhost:5678/api/works";
const API_CATEGORIES = "http://localhost:5678/api/categories";
let allWorks = [];
let allCategories = [];
const loginLink = document.getElementById("login-link");
const editSection = document.querySelector(".edit-section");
const adminEdit = document.querySelector(".admin-edit");
const projectsContainer = document.getElementById("projects-container");
const modalGalleryPhoto = document.getElementById("modal-gallery-photo");
const closeModalButtons = document.querySelectorAll(".close");
const modalAddPhoto = document.getElementById("modal-add-photo");
const addPhotoButton = document.getElementById("add-photo-button");
const validateButton = document.getElementById("validate-photo");
const backArrowButton = document.getElementById("back-arrow");
const imageInput = document.getElementById("photo-file");
const imagePreview = document.getElementById("imagePreview");
const iconPreview = document.querySelector(".photo-icon");
const addFile = document.querySelector(".add-photo-button-in-card");
const formP = document.querySelector("form p");
const selectCategory = document.getElementById("category-select");
const photoTitleInput = document.getElementById("photo-title");

//Appel à l’API avec fetch afin de récupérer dynamiquement les projets de l’architecte.
const fetchAllWorks = async () => {
  try {
    const result = await fetch(`${API}`);
    if (!result.ok) {
      console.error("Erreur API");
    }
    const data = await result.json();
    allWorks = data;
    displayGallery(allWorks);
  } catch (error) {
    console.error("Erreur lors de la récupération de tous les works");
  }
};

fetchAllWorks();
//Fonction pour remplir la galerie avec les projets récupérés
const displayGallery = (works) => {
  gallery.innerHTML = "";
  works.forEach((work) => {
    const figure = figureWork(work);
    gallery.appendChild(figure);
  });
};

// Fonction pour creer un element figure avec son contenu

const figureWork = (work) => {
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  image.src = work.imageUrl;
  image.alt = work.title;
  figure.appendChild(image);
  const figureCaption = document.createElement("figcaption");
  figureCaption.textContent = work.title;
  figure.appendChild(figureCaption);
  return figure;
};

const fetchAllCategories = async () => {
  try {
    const result = await fetch(`${API_CATEGORIES}`);
    if (!result.ok) {
      console.error("Erreur API");
    }
    const data = await result.json();
    data.unshift({ id: 0, name: "Tous" });
    allCategories = data;
    console.log(data);
    for (let category of allCategories) {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.setAttribute("data-id", category.id);
      categoriesContainer.appendChild(button);
      // Par défaut le filtre "Tous" est actif
      if (category.id === 0) {
        button.classList.add("active-filter");
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de tous les catégories");
  }
};
fetchAllCategories();

categoriesContainer.addEventListener("click", (e) => {
  const allButtons = document.querySelectorAll("#categories button");
  if (e.target.getAttribute("data-id")) {
    allButtons.forEach((button) => {
      button.classList.remove("active-filter");
    });
    const categoryId = parseInt(e.target.getAttribute("data-id"));
    e.target.classList.add("active-filter");
    filterWorksByCategory(categoryId);
  }
});

const filterWorksByCategory = (categoryId) => {
  gallery.innerHTML = "";
  if (categoryId === 0) {
    for (let work of allWorks) {
      const figure = figureWork(work);
      gallery.appendChild(figure);
    }
  } else {
    const filteredWorks = allWorks.filter(
      (work) => work.categoryId === categoryId,
    );
    for (let work of filteredWorks) {
      const figure = figureWork(work);
      gallery.appendChild(figure);
    }
  }
};

//fonction pour vérifier l'état de connexion
const checkLoginStatus = () => {
  const token = localStorage.getItem("token");
  if (token) {
    loginLink.textContent = "logout";
    loginLink.href = "#";
    loginLink.classList.add("logout-link");
    loginLink.removeEventListener("click", handleLogout);
    loginLink.addEventListener("click", handleLogout);
    editSection.style.display = "block";
    categoriesContainer.style.display = "none";
    adminEdit.innerHTML =
      '<button class="edit-button"> <i class="fas fa-pen-to-square"></i> Mode édition</button>';
    adminEdit.classList.add("black-edition");
  } else {
    // utilisateur non connecté
    loginLink.textContent = "login";
    loginLink.href = "login.html";
    categoriesContainer.style.display = "flex";
    adminEdit.style.display = "none";
    loginLink.classList.remove("logout-link");
  }
};

//gestion du logout
const handleLogout = (event) => {
  event.preventDefault();
  localStorage.removeItem("token");
  window.location.reload();
};

const displayProjectsInModal = () => {
  projectsContainer.innerHTML = "";
  allWorks.forEach((work) => {
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project-item");

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");
    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
    imageWrapper.appendChild(image);
    imageWrapper.appendChild(deleteIcon);
    projectDiv.appendChild(imageWrapper);
    projectsContainer.appendChild(projectDiv);
    deleteIcon.addEventListener("click", () => {
      console.log("Suppression du projet avec l'ID :", work.id);
      deleteProject(work.id);
    });
  });
};

// Fonction pour ouvrir le modal de la galerie photo en cliquant sur le bouton 'modifier'
const openModalGalleryPhoto = () => {
  if (modalGalleryPhoto) {
    modalGalleryPhoto.style.display = "flex";
    displayProjectsInModal();
  }
};

editSection.addEventListener("click", (e) => {
  e.preventDefault();
  openModalGalleryPhoto();
});

// Suppression à l'aide d'un boutton
const deleteProject = async (projectId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté pour supprimer un projet.");
    return;
  }
  const confirmDelete = confirm(
    "Êtes-vous sûr de vouloir supprimer ce projet ?",
  );
  if (!confirmDelete) return;
  console.log("le token est :", token);
  try {
    const response = await fetch(`${API}/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du projet");
    }
    console.log("Projet supprimé avec succès");
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error);
  }
  // Mettre à jour l'affichage après la suppression
  gallery.innerHTML = "";
  fetchAllWorks();
  displayProjectsInModal();
  // Fermeture du modal après suppression
  modalGalleryPhoto.style.display = "none";
};

// Fermeture des modal
closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (modalGalleryPhoto) {
      modalGalleryPhoto.style.display = "none";
    }
    if (modalAddPhoto) {
      modalAddPhoto.style.display = "none";
    }
  });
});

// Fermeture du modal en cliquant en dehors du contenu
window.addEventListener("click", (event) => {
  if (event.target === modalGalleryPhoto) {
    modalGalleryPhoto.style.display = "none";
  }
});

// Ajout d'une photo
addPhotoButton.addEventListener("click", () => {
  if (modalAddPhoto) {
    // Ouvrir le second modal
    modalAddPhoto.style.display = "flex";
    // Fermer le premier modal
    modalGalleryPhoto.style.display = "none";
    categoriesSelect();
    checkFormValidity();
    resetInput();
  }
});

// Retour au modal de la galerie en cliquant sur la flèche
backArrowButton.addEventListener("click", () => {
  if (modalAddPhoto) {
    // Retour au modal de la galerie
    modalAddPhoto.style.display = "none";
    // Ouvrir le modal de la galerie
    modalGalleryPhoto.style.display = "flex";
  }
});

// Methode pour l'ajout de prévisualisation de l'image
imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const ACCEPTED_EXTENSIONS = ["jpg", "png"];
  const fileName = file.name;
  // Récupération de l'extension du fichier en minuscules
  const fileExtension = fileName.split(".").pop().toLowerCase();
  if (
    file &&
    file.size <= 4 * 1024 * 1024 &&
    ACCEPTED_EXTENSIONS.includes(fileExtension)
  ) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block"; // Afficher la prévisualisation de l'image
      iconPreview.style.display = "none"; // Masquer l'icône
      addFile.style.display = "none";
      formP.style.display = "none";
    };
    reader.readAsDataURL(file);
  } else {
    alert(
      "Fichier invalide. Veuillez sélectionner une image JPG ou PNG de moins de 4 Mo.",
    );
  }
});

//methode pour ajouter les options dynamiquement dans le select
const categoriesSelect = () => {
  const option = document.createElement("option");
  selectCategory.innerHTML = "";
  selectCategory.appendChild(option);
  allCategories.forEach((category) => {
    if (category.id !== 0) {
      let option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      option.id = category.id;
      selectCategory.appendChild(option);
    }
  });
};

// Gestion de l'ajout de projet
const submitPhoto = async (event) => {
  event.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté pour ajouter un projet.");
    return;
  }
  //vérification si les éléments existent
  if (!imageInput || !selectCategory || !imagePreview || !photoTitleInput) {
    console.error("Un ou plusieurs éléments du formulaire sont manquants.");
    return;
  }
  const title = photoTitleInput.value;
  const optionIndex = selectCategory.selectedIndex;
  const categoryId = parseInt(selectCategory.options[optionIndex]?.id);
  const imageFile = imageInput.files[0];
  //vérification des valeurs
  if (!title || !categoryId || !imageFile) {
    alert("Veuillez remplir tous les champs du formulaire.");
    return;
  }
  const confirmation = confirm(
    `Voulez-vous vraiment ajouter ce projet ${title}?`,
  );
  if (!confirmation) return;
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", categoryId);
  formData.append("image", imageFile);

  try {
    const response = await fetch(`${API}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'ajout du projet ${response.status}`);
    }
    gallery.innerHTML = "";
    fetchAllWorks();
    displayProjectsInModal();
    // Fermeture du modal après ajout
    modalAddPhoto.style.display = "none";
  } catch (error) {
    console.error("Erreur lors de l'ajout du projet :", error);
    alert(
      "Une erreur est survenue lors de l'ajout du projet. Veuillez réessayer.",
    );
  }
};

// Gestion du clic sur le bouton de validation
const checkFormValidity = () => {
  const title = photoTitleInput.value.trim();
  const category = selectCategory.value;
  const imageFile = imageInput.files[0];
  if (title && category && imageFile) {
    validateButton.disabled = false;
  } else {
    validateButton.disabled = true;
  }
};

// Écouter les changements dans les champs du formulaire
photoTitleInput.addEventListener("input", checkFormValidity);
selectCategory.addEventListener("change", checkFormValidity);
imageInput.addEventListener("change", checkFormValidity);

//méthode pour reinitialiser la prévisualisation et les champs du formulaire
const resetInput = () => {
  imagePreview.src = "";
  imagePreview.style.display = "none";
  iconPreview.style.display = "block";
  addFile.style.display = "flex";
  formP.style.display = "block";
  photoTitleInput.value = "";
  validateButton.disabled = true;
};

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  displayProjectsInModal();
  if (validateButton) {
    validateButton.addEventListener("click", submitPhoto);
  } else {
    console.error("Le bouton de validation est introuvable.");
  }
});
