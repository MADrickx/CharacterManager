const modalsContainer = document.getElementById('modal-container');
const modalClose = document.getElementById('addChar-close');
const modalModClose = document.getElementById("modChar-close");
const template = document.getElementById("tpl-char");
const target = document.getElementById('card__target');
let searchWord = document.getElementById('search');
var url = "";

const readURL = file => {
	return new Promise((res, rej) => {
		const reader = new FileReader();
		reader.onload = e => res(e.target.result);
		reader.onerror = e => rej(e);
		reader.readAsDataURL(file);
	});
};

document.getElementById('search-form').addEventListener('submit',(ev)=>{
	ev.preventDefault()
})

window.onload = async function getChar() {
	let chars ='';
	try {
		let response = await fetch('https://character-database.becode.xyz/characters');
		chars = await response.json(); //tableau objects
		if (searchWord.value == ""){
			chars.forEach(({
				description,
				shortDescription,
				id,
				name,
				image
			}) => {
				let templateClone = template.content.cloneNode(true);
				templateClone.querySelector(".card__name").innerHTML = name;
				templateClone.querySelector(".card__img").src = `data:image/png;base64, ${image}`;
				templateClone.querySelector(".card__desc").innerHTML = description;
				templateClone.querySelector(".card__shortDesc").innerHTML = shortDescription;
	
				target.append(templateClone);
			})
		} 
	} catch(error) {
		console.log(error)
	}
	searchWord.addEventListener('input', async ()=>{
		let filteredChar = chars.filter(element => {
			console.log(element.name.toLowerCase().includes(searchWord.value.toLowerCase()))
			return element.name.toLowerCase().includes(searchWord.value.toLowerCase())
		});
		console.log(filteredChar)
		getNumberOfElementAndCenter(filteredChar);
		target.innerHTML = "";
		filteredChar.forEach(({
			description,
			shortDescription,
			id,
			name,
			image
		}) => {
			let templateClone = template.content.cloneNode(true);
			templateClone.querySelector(".card__name").innerHTML = name;
			templateClone.querySelector(".card__img").src = `data:image/png;base64, ${image}`;
			templateClone.querySelector(".card__desc").innerHTML = description;
			templateClone.querySelector(".card__shortDesc").innerHTML = shortDescription;
			
			target.append(templateClone);
		})
	})
	async function getCardsLink() {
		const btnsModChar = await document.getElementsByClassName('btn-modChar');
		const arrBtnsModChar = await Array.from(btnsModChar);
		for (let i = 0; i < arrBtnsModChar.length; i++) {
			arrBtnsModChar[i].addEventListener('click', async () => {
				document.getElementById('modal-modChar').classList.remove('hidden');
				modalsContainer.classList.remove('hidden');
				//ici, on va recupèrer les données de la cartes pour les afficher dans notre modale
				let response = await fetch('https://character-database.becode.xyz/characters');
				let chars = await response.json(); //tableau objects
				document.getElementById('mod-image').src = `data:image/png;base64, ${chars[i].image}`;
				document.getElementById('mod-name').innerHTML = chars[i].name;
				document.getElementById('mod-shortDescription').innerHTML = chars[i].shortDescription;
				document.getElementById('mod-description').innerHTML = chars[i].description;
				document.getElementById('btn-mod').addEventListener('click', async () => {
					typeManagement();
					let inputs = Array.from(document.getElementsByTagName("input"))
					document.getElementById('modal-modChar').classList.add('hidden');
					inputs[0].value = "";
					preview.src = `data:image/png;base64, ${chars[i].image}`
					inputs[1].value = chars[i].name;
					inputs[2].value = chars[i].shortDescription;
					inputs[3].value = chars[i].description;

					const newImage = await inputs[0].addEventListener("change", async (ev) => {
						const file = ev.target.files[0];
						url = await readURL(file);
						preview.src = url;
					});

					document.getElementById('modal-addChar').classList.remove('hidden');
					countChar('name',20,0);
					countChar('origin',70,1)
					countChar('description',350,2)
					document.getElementById("btn-save").addEventListener("click", async () => {
						try {
							let name = inputs[1].value;
							let shortDescription = inputs[2].value;
							let description = inputs[3].value;
							let id = '';
							let image = chars[i].image;
							let preview = document.getElementById('preview').src;
							if (image =! preview) {
								console.log(image, preview.split(",")[1])
								let modCharWithImage = await fetch(`https://character-database.becode.xyz/characters/${chars[i].id}`, {
									method: "PUT",
									headers: {
										"Content-Type": "application/json"
									},
									body: JSON.stringify({
										description,
										shortDescription,
										id,
										name,
										image
									})
								});
							} else {
								image = preview.split(",")[1];
								let modCharWithImage = await fetch(`https://character-database.becode.xyz/characters/${chars[i].id}`, {
									method: "PUT",
									headers: {
										"Content-Type": "application/json"
									},
									body: JSON.stringify({
										description,
										shortDescription,
										id,
										name,
										image
									})
								})
							}
						} catch (error) {
							console.log(error)
						}
					});
					modalClose.addEventListener('click', () => {
						modalsContainer.classList.add('hidden'); // bouton qui ferme, au clique + class hidden
						document.getElementById("modal-addChar").classList.add('hidden');
					})
				})
                document.getElementById('btn-mod-delete').addEventListener('click',async () => {
                    let deletedChar = await fetch(`https://character-database.becode.xyz/characters/${chars[i].id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                    });
                })
				modalModClose.addEventListener('click', () => {
					modalsContainer.classList.add('hidden'); // bouton qui ferme, au clique + class hiden
					document.getElementById('modal-modChar').classList.add('hidden');
				})
			})
		}
	}

	setTimeout(() => {
		getCardsLink()
	}, 500);
}

document.getElementById("addChar").addEventListener("click", async () => {
	modalsContainer.classList.remove('hidden');
	document.getElementById("modal-addChar").classList.remove('hidden');
	typeManagement();
	let img = document.getElementById('image');
	let preview = document.getElementById('preview');
	let inputs = Array.from(document.getElementsByTagName("input"));
	const test = await inputs[0].addEventListener("change", async (ev) => {
		const file = ev.target.files[0];
		url = await readURL(file);
		preview.src = url;
	})
	document.getElementById("btn-save").addEventListener("click", async () => {
		try {
			let name = inputs[1].value;
			let shortDescription = inputs[2].value;
			let description = inputs[3].value;
			let id = "";
			let image = url.split(",")[1];
			let response = await fetch('https://character-database.becode.xyz/characters', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					description,
					shortDescription,
					id,
					name,
					image
				})
			});
		} catch (error) {
			console.log(error)
		}
	});

	document.getElementById("btn-delete").addEventListener("click", () => {
		inputs[0].value = ""
		inputs[1].value = ""
		inputs[2].value = ""
		inputs[3].value = ""
		let preview = document.getElementById('preview');
		preview.src = "a"
	});

	modalClose.addEventListener('click', () => {
		modalsContainer.classList.add('hidden'); // bouton qui ferme, au clique + class hidden
		document.getElementById("modal-addChar").classList.add('hidden');
	})
})

const typeManagement = () =>{
	const arrayOfbuttons = document.querySelectorAll('.description-btn');
	for (let i=0;i<arrayOfbuttons.length;i++){
		arrayOfbuttons[i].addEventListener('click',()=>{
		if (arrayOfbuttons[i].id == 'btn-bold'){
			arrayOfbuttons[i].classList.toggle('active');
			if(arrayOfbuttons[i].matches('.active')){
				document.getElementById('description').value = document.getElementById('description').value + '<strong>';
			} else {
				document.getElementById('description').value = document.getElementById('description').value + '</strong>';
			}
		} else if (arrayOfbuttons[i].id == 'btn-italic'){
			arrayOfbuttons[i].classList.toggle('active');
			if(arrayOfbuttons[i].matches('.active')){
				document.getElementById('description').value = document.getElementById('description').value + '<em>';
			} else {
				document.getElementById('description').value = document.getElementById('description').value + '</em>';
			}
		} else if (arrayOfbuttons[i].id == 'btn-strike'){
			arrayOfbuttons[i].classList.toggle('active');
			if(arrayOfbuttons[i].matches('.active')){
				document.getElementById('description').value = document.getElementById('description').value + '<strike>';
			} else {
				document.getElementById('description').value = document.getElementById('description').value + '</strike>';
			}
		} else if (arrayOfbuttons[i].id == 'btn-ul'){
			arrayOfbuttons[i].classList.toggle('active');
			if(arrayOfbuttons[i].matches('.active')){
				document.getElementById('description').value = document.getElementById('description').value + '<ul><li>';
			} else {
				document.getElementById('description').value = document.getElementById('description').value + '</li></ul>';
			}
		} else if (arrayOfbuttons[i].id == 'btn-ol'){
			arrayOfbuttons[i].classList.toggle('active');
			if(arrayOfbuttons[i].matches('.active')){
				document.getElementById('description').value = document.getElementById('description').value + '<ol><li>';
			} else {
				document.getElementById('description').value = document.getElementById('description').value + '</li></ol>';
			}
		} else if (arrayOfbuttons[i].id == 'btn-quote'){
			arrayOfbuttons[i].classList.toggle('active');
			if(arrayOfbuttons[i].matches('.active')){
				document.getElementById('description').value = document.getElementById('description').value + '<q>';
			} else {
				document.getElementById('description').value = document.getElementById('description').value + '</q>';
			}
		}
		})
	}
}

const countChar = (id,maxChar,pos) =>{
	this.id = id;
	this.maxChar = maxChar;
	this.pos = pos;
	let inputCount = document.getElementById(`${id}`);
	let inputLength = inputCount.value.length;
	console.log(inputLength,inputCount)
	let targetS = document.querySelectorAll('.input-char-count');
	targetS[pos].innerHTML = `${inputLength} on max ${maxChar} char.`
	inputCount.addEventListener('input', () => {
		let inputCount = document.getElementById(`${id}`);
		let inputLength = inputCount.value.length;
		inputCount.maxLength = maxChar;
		console.log(inputLength,inputCount)
		let targetS = document.querySelectorAll('.input-char-count');
		targetS[pos].innerHTML = `${inputLength} on max ${maxChar} char.`
	})
}

const getNumberOfElementAndCenter = (arr) => {
	this.arr = arr;
	length = arr.length
	if(length<4){
		target.style.justifyContent = 'center';
	} else {
		target.style.justifyContent = 'space-between';
	}
}