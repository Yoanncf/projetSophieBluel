// création des variables
const gallery = document.querySelector('.gallery');
const API = 'http://localhost:5678/api/works';

//Appel à l’API avec fetch afin de récupérer dynamiquement les projets de l’architecte. 
const fetchAllWorks = async () => {
   try {
    const result = await fetch(`${API}`);
    if(!result.ok){
        console.error('Erreur API');
    }
    const data = await result.json();
    console.log(data);
   } catch(error) {
    console.error("Erreur lors de la récupération de tous les works")
   }
   
}

fetchAllWorks();