const modalsContainer = document.getElementById('modal-container');
const modalClose = document.getElementById('addChar-close');
const modalModClose = document.getElementById("modChar-close");
const template = document.getElementById("tpl-char");
const target = document.getElementById('card__target');


window.onload = async function getChar(){
    let response = await fetch('https://character-database.becode.xyz/characters');
    let chars = await response.json(); //tableau objects

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
    async function getCardsLink(){
        const btnsModChar = await document.getElementsByClassName('btn-modChar');
        const arrBtnsModChar = await Array.from(btnsModChar);
        console.log(arrBtnsModChar)
    
        for(let i=0;i<arrBtnsModChar.length;i++){
            arrBtnsModChar[i].addEventListener('click',async()=>{
                document.getElementById('modal-modChar').classList.remove('hidden');
                modalsContainer.classList.remove('hidden');
                //ici, on va recupèrer les données de la cartes pour les afficher dans notre modale
                let response = await fetch('https://character-database.becode.xyz/characters');
                let chars = await response.json(); //tableau objects
                document.getElementById('mod-image').src =  `data:image/png;base64, ${chars[i].image}`;
                document.getElementById('mod-name').innerText = chars[i].name;
                document.getElementById('mod-shortDescription').innerText = chars[i].shortDescription;
                document.getElementById('mod-description').innerText = chars[i].description;
    
                document.getElementById('btn-mod').addEventListener('click',()=>{
                    let inputs = Array.from(document.getElementsByTagName("input"))
                    document.getElementById('modal-modChar').classList.add('hidden');
                    inputs[0].value = "";
                    preview.src = `data:image/png;base64, ${chars[i].image}`
                    inputs[1].value = chars[i].name;
                    inputs[2].value = chars[i].shortDescription;
                    inputs[3].value = chars[i].description;
                    document.getElementById('modal-addChar').classList.remove('hidden');
                    document.getElementById("btn-save").addEventListener("click", async() => {
                        try {
                            alert('pas coucou');
                            let name = inputs[1].value;
                            let shortDescription = inputs[2].value;
                            let description = inputs[3].value;
                            let id='';
                            let image = chars[i].image
                            console.log(name, shortDescription, description, id);
                            let response = await fetch(`https://character-database.becode.xyz/characters/${chars[i].id}`, {
                            method:"PUT",
                            headers:{"Content-Type":"application/json"},
                            body:JSON.stringify({description, shortDescription, id, name, image})
                        });
                        } catch(error) {
                            console.log(error)
                        }
                    });
                    modalClose.addEventListener('click', ()=>{
                        modalsContainer.classList.add('hidden'); // bouton qui ferme, au clique + class hidden
                        document.getElementById("modal-addChar").classList.add('hidden');
                    })
                })
    
    
                modalModClose.addEventListener('click', ()=>{
                    modalsContainer.classList.add('hidden'); // bouton qui ferme, au clique + class hiden
                    document.getElementById('modal-modChar').classList.add('hidden');
                })
            })
        }
    }
    
    setTimeout(()=>{
        getCardsLink()
    },500);
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
    document.getElementById("modal-addChar").classList.remove('hidden');
    let img = document.getElementById('image');
    let preview = document.getElementById('preview');
    let inputs = Array.from(document.getElementsByTagName("input"));
    var url = "";
    const test = await inputs[0].addEventListener("change", async (ev) => {
        const file = ev.target.files[0];
        url = await readURL(file);
        preview.src=url;
    })
    document.getElementById("btn-save").addEventListener("click", async() => {
        try {
            alert('coucou');
            let name = inputs[1].value;
            let shortDescription = inputs[2].value;
            let description = inputs[3].value;
            let id = "";
            let image = url.split(",")[1];
            console.log(name, shortDescription, description, id);
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
        modalsContainer.classList.add('hidden'); // bouton qui ferme, au clique + class hidden
        document.getElementById("modal-addChar").classList.add('hidden');
    })
})



