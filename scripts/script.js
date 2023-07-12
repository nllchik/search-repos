const input = document.querySelector('.search-repos__input')
const autocompleteList = document.querySelector('.search-repos__autocomplete')
const reposSelectedList = document.querySelector('.search-repos__selected')

async function searchRepos() {
	if(input.value === '') {
		while (autocompleteList.firstChild){
			autocompleteList.firstChild.remove()
		}
		return
	}

	const response = await fetch(`https://api.github.com/search/repositories?q=${input.value}`)
	if(!response.ok){
		throw new Error('Ошибка получения данных')
	}
	const data = await response.json()
	const items = data.items

	createAutocomleteItem(items)
}

function createAutocomleteItem(data) {
	while (autocompleteList.firstChild){
		autocompleteList.firstChild.remove()
	}

	fragmentAutocomplete = document.createDocumentFragment()

	let counter = 0

	data.forEach(item => {
		if(counter === 5) {
			return
		}

		const li = document.createElement('li')
		li.classList.add('autocomplete__item')
		li.textContent = item.name
		fragmentAutocomplete.appendChild(li)

		li.addEventListener('click', () => {
			SelectRepos([item])
			input.value = ''
		})

		counter++
	});
	autocompleteList.appendChild(fragmentAutocomplete)
}

const debounce = (fn, debounceTime) => {
	let timer
	return function(...args){
		clearTimeout(timer)
		timer = setTimeout(() => {
			fn.apply(this, args)
		}, debounceTime)
	}
}

input.addEventListener('keyup', debounce(searchRepos, 500))



function SelectRepos(data) {
	const fragmentSelected = document.createDocumentFragment()
	while (autocompleteList.firstChild) {
		autocompleteList.firstChild.remove();
	}
	
	data.forEach(item => {
		const li = document.createElement('li')
		li.classList.add('selected__item')
	
		const div = document.createElement('div')
		div.classList.add('item__info')

		const selectedName = document.createElement('span')
		selectedName.textContent = `Name: ${item.name}`

		const selectedOwner = document.createElement('span')
		selectedOwner.textContent = `Owner: ${item.owner.login}`

		const selectedStars = document.createElement('span')
		selectedStars.textContent = `Stars: ${item.stargazers_count}`

		const selectedRemove = document.createElement('button')
		selectedRemove.classList.add('selected__remove')

		selectedRemove.addEventListener('click', () => {
			li.remove()
		})

		li.appendChild(div)
		li.appendChild(selectedRemove)

		div.appendChild(selectedName)
		div.appendChild(selectedOwner)
		div.appendChild(selectedStars)

		fragmentSelected.appendChild(li)
	});
	
	reposSelectedList.appendChild(fragmentSelected)
}
		
	 

