export default class RTCPeer {
	constructor(id) {
		this.id = id
		this.retry = 1000
		this.connected = false
		this._resolve
		this.connectionPromise = new Promise(resolve => this._resolve = resolve)

		const config = {
			iceServers: [{
				urls: [
					// https://gist.github.com/zziuni/3741933
					"stun:stun.l.google.com:19302",
					"stun:stun1.l.google.com:19302",
					"stun:stun2.l.google.com:19302",
					"stun:stun3.l.google.com:19302",
					"stun:stun4.l.google.com:19302",
				]
			}]
		}

		this.peerConnection = new RTCPeerConnection(config)
		this.peerConnection.addEventListener('icecandidate', this.onIceCandidate.bind(this))
	}
	
	useDataChannel(dataChannel) {
		this.dataChannel = dataChannel
		this.dataChannel.binaryType = 'arraybuffer'
		this.dataChannel.addEventListener('message', () => {
			console.log('CONNECTED !')
			this.connected = true
			this.purge()
			this._resolve(this.dataChannel)
		}, {once: true})

		if(this.dataChannel.readyState === 'open') {
			this.dataChannel.send(`hello from ${this.id}`)
		} else {
			this.dataChannel.onopen = () => this.dataChannel.send(`hello from ${this.id}`)
		}
	}

	async joinHost(id) {
		this.loopGetIce(id)
		this.peerConnection.ondatachannel = event => this.useDataChannel(event.channel)
		let foundOffer = await this.receiveId('offer', id)
		while (!foundOffer) {
			await new Promise(resolve => setTimeout(resolve, this.retry))
			foundOffer = await this.receiveId('offer', id)
		}
		await this.sendId('answer', id)
	}

	async startHosting(id) {
		this.loopGetIce(id)
		this.useDataChannel(this.peerConnection.createDataChannel("test"))
		await this.sendId('offer')
		let foundAnswer = await this.receiveId('answer')
		while (!foundAnswer) {
			await new Promise(resolve => setTimeout(resolve, this.retry))
			foundAnswer = await this.receiveId('answer')
		}
	}

	async sendId(type, id = this.id) {
		if(type !== 'answer' && type !== 'offer')
			throw new Error('wrong type', type)
		const description = await this.peerConnection[type === 'answer' ? 'createAnswer' : 'createOffer']()
		this.peerConnection.setLocalDescription(description)
		fetch(`./php/${type}.php`, {
			method: 'POST',
			cache: 'no-store',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id,
				description
			})
		})
	}

	async receiveId(type, id = this.id) {
		if(type !== 'answer' && type !== 'offer')
			throw new Error('wrong type', type)
		
		const data = await fetch(`./php/${type}.php?id=${id}`, {
			cache: 'no-store',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		})
		try {
			const { description } = await data.json()
			if(!description)
				return false
			await this.peerConnection.setRemoteDescription(new RTCSessionDescription(description))
			return true
		} catch (e) {
			console.error(e)
			return false
		}
	}

	async loopGetIce(id) {
		if(!this.connected) {
			await this.getIceCandidates(id)
			setTimeout(() => this.loopGetIce(id), this.retry)
		}
	}

	async getIceCandidates(id) {
		const data = await fetch(`./php/candidate.php?id=${id}`, {
			cache: 'no-store',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		})
		try {
			const { candidates } = await data.json()
			if(candidates) {
				Object.values(candidates).forEach(candidate => {
					this.peerConnection.addIceCandidate(JSON.parse(candidate))
				})
			}
		} catch (e) { 
			console.error(e)
		}
	}

	async onIceCandidate({candidate}) {
		if(!candidate) 
			return
		fetch(`./php/candidate.php`, {
			method: 'POST',
			cache: 'no-store',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: this.id,
				candidate: JSON.stringify(candidate)
			})
		})
	}
	
	async purge() {
		await fetch(`./php/purge.php?id=${this.id}`, {
			cache: 'no-store',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		})
	}
}
