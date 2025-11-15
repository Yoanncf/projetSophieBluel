// création des variables
const gallery = document.querySelector('.gallery');
const API = 'http://localhost:5678/api/works';
let allWorks = [];

//Appel à l’API avec fetch afin de récupérer dynamiquement les projets de l’architecte. 
const fetchAllWorks = async () => {
   try {
    const result = await fetch(`${API}`);
    if(!result.ok){
        console.error('Erreur API');
    }
    const data = await result.json();
    allWorks = data;
    console.log(data);
    displayGallery(allWorks);
   } catch(error) {
    console.error("Erreur lors de la récupération de tous les works")
   }
   
}

fetchAllWorks();
//Fonction pour remplir la galerie avec les projets récupérés
const displayGallery = (works) => {
    gallery.innerHTML = '';
    works.forEach((work) => {
        const figure = figureWork(work);
        gallery.appendChild(figure);
    });
}

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
}

