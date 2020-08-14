import RTCPeer from './webrtc.js'

const firstForm = document.getElementById('create')
const secondForm = document.getElementById('connect')
const content = document.getElementById('content')
const sandbox = document.getElementById('sandbox')

let rtcPeer
disableForm(secondForm)

firstForm.querySelector('button').addEventListener('click', validateFirstForm)
firstForm.addEventListener('submit', validateFirstForm)
function validateFirstForm(e) {
	e.preventDefault()
	const value = firstForm.querySelector('input').value
	if(value) {
		disableForm(firstForm)
		rtcPeer = new RTCPeer(value)
		rtcPeer.connectionPromise.then(useChannel)
		enableForm(secondForm)
		secondForm.querySelector('input').focus()
	}
}

secondForm.addEventListener('submit', e => e.preventDefault())
secondForm.querySelector('button[data-action=host]').addEventListener('click', () => {
	const value = secondForm.querySelector('input').value
	if(value) {
		disableForm(secondForm)
		rtcPeer.startHosting(value)
	}
})
secondForm.querySelector('button[data-action=join]').addEventListener('click', () => {
	const value = secondForm.querySelector('input').value
	if(value) {
		disableForm(secondForm)
		rtcPeer.joinHost(value)
	}
})

function useChannel(channel) {
	sandbox.removeAttribute('disabled')
	sandbox.focus()
	channel.addEventListener('message', ({data}) => content.value = data)
	sandbox.addEventListener('input', () => channel.send(sandbox.value))
}

function disableForm(form) {
	for (let child of form.children) {
		child.setAttribute('disabled', "")
	}
}

function enableForm(form) {
	for (let child of form.children) {
		child.removeAttribute('disabled')
	}
}

window.addEventListener('beforeunload', async () => {
	if(rtcPeer)
		await rtcPeer.purge()
})