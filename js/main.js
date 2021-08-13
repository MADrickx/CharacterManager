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

const readURL = file => {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = e => res(e.target.result);
        reader.onerror = e => rej(e);
        reader.readAsDataURL(file);
    });
};

document.getElementById("addChar").addEventListener("click",async() => {
    modalsContainer.classList.remove('hidden');
    let img = document.getElementById('image');
    let preview = document.getElementById('preview');
    console.log(img)
    let inputs = Array.from(document.getElementsByTagName("input"))
    console.log(inputs)
    var url = ""
    const test = await inputs[0].addEventListener("change", async (ev) => {
        const file = ev.target.files[0];
        url = await readURL(file)
        preview.src=url
    })
    document.getElementById("btn-save").addEventListener("click", async() => {
        try {
            let name = inputs[1].value
            let shortDescription = inputs[2].value
            let description = inputs[3].value
            let id = ""
            let image = url.split(",")[1]
            console.log(name, shortDescription, description, id)
            let response = await fetch('https://character-database.becode.xyz/characters', {
            method:"POST", 
            headers:{"Content-Type":"application/json"}, 
            body:JSON.stringify({description, shortDescription, id, name, image})
        });
        } catch(error) {
            console.log(error)
        }
    });

    document.getElementById("btn-delete").addEventListener("click", () => {
            inputs[0].value = ""
            inputs[1].value = ""
            inputs[2].value = ""
            inputs[3].value = ""
            let preview = document.getElementById('preview');
            preview.src="a"
    });

    modalClose.addEventListener('click', ()=>{
        modalsContainer.classList.add('hidden'); // bouton qui ferme, au clique + class hiden
    })
})

