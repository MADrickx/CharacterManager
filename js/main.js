const modalsContainer = document.getElementById('modal-container');
const modalClose = document.getElementById('addChar-close');
const template = document.getElementById("tpl-char");
const target = document.getElementById('card__target');

window.onload = async function getChar(){
    let response = await fetch('https://character-database.becode.xyz/characters');
    let chars = await response.json(); //tableau d'objets

    try{
        chars.forEach(({ description, shortDescription, id, name, image }) => {
            let templateClone = template.content.cloneNode(true);
            templateClone.querySelector(".card__name").innerText = name;
            templateClone.querySelector(".card__img").src = `data:image/png;base64, ${image}`;
            templateClone.querySelector(".card__longDesc").innerText = description;
    
            target.append(templateClone);
        })
    } catch(error){
        console.log(error)
    }
    
}


document.getElementById("addChar").addEventListener("click",async() => {
    modalsContainer.classList.remove('hidden');
    let img = document.getElementById('image');
    let preview = document.getElementById('preview');
    modalClose.addEventListener('click', ()=>{
        modalsContainer.classList.add('hidden');
    })
})