const input = document.querySelector('.search-repos__input')
const autocompleteList = document.querySelector('.search-repos__autocomplete')
const reposSelectedList = document.querySelector('.search-repos__selected')

async function searchRepos(event) {
	if(event.target.value === '') {
		removeList(autocompleteList)
		return
	}

	const response = await fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=5`)
	if(!response.ok){
		throw new Error('Ошибка получения данных')
	}
	const data = await response.json()
	const items = data.items

	createAutocomleteItem(items)
}

function createAutocomleteItem(data) {
	removeList(autocompleteList)

	const fragmentAutocomplete = document.createDocumentFragment()


	data.forEach(item => {
		const li = document.createElement('li')
		li.classList.add('autocomplete__item')
		li.textContent = item.name

		li.addEventListener('click', () => {
			SelectRepos([item])
			input.value = ''
		})
		fragmentAutocomplete.appendChild(li)
	});
	autocompleteList.appendChild(fragmentAutocomplete)
}

function removeList(list) {
	while (list.firstChild){
		list.firstChild.remove()
	}
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

input.addEventListener('input', debounce(searchRepos, 500))


function SelectRepos(data) {
	const fragmentSelected = document.createDocumentFragment()
	removeList(autocompleteList)
	
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
		
	 

