export function startHover() {
	document.body.classList.add('hover')
}

export function endHover() {
	document.body.classList.remove('hover')
}

export function showPlayButton() {
	const button = document.querySelector('#pause')
	if(button) button.classList.add('pause')
}

export function hidePlayButton() {
	const button = document.querySelector('#pause')
	if(button) button.classList.remove('pause')
}