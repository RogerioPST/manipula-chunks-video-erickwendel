class VideoMediaPlayer {
	constructor({ manifestJSON, network, videoComponent }) {
			this.manifestJSON = manifestJSON
			this.network = network
			this.videoComponent = videoComponent

			this.videoElement = null
			this.sourceBuffer = null 
			this.activeItem ={}
			this.selected = {}
			this.videoDuration = 0
			this.selections =[]

	}

	initializeCodec() {
			this.videoElement = document.getElementById("vid")
		//verifica se o browser suporta mediaSource	
			const mediaSourceSupported = !!window.MediaSource
			if(!mediaSourceSupported) {
					alert('Seu browser ou sistema nao tem suporte a MSE!')
					return;
			}

			const codecSupported = MediaSource.isTypeSupported(this.manifestJSON.codec)
			if(!codecSupported) {
					alert(`Seu browser nao suporta o codec: ${this.manifestJSON.codec}`)
					return;
			}

			const mediaSource = new MediaSource()
			this.videoElement.src = URL.createObjectURL(mediaSource)
			console.log('this.videoElement.src', this.videoElement.src)
//qdo o obj estiver pronto p manipular video, vai disparar..
			mediaSource.addEventListener("sourceopen", this.sourceOpenWrapper(mediaSource))
	}

	sourceOpenWrapper(mediaSource) {
			return async(_) => {
					this.sourceBuffer = mediaSource.addSourceBuffer(this.manifestJSON.codec)
					const selected = this.selected = this.manifestJSON.intro
					// evita rodar como "LIVE", p permitir avançar o video, ao contrario da netflix
					mediaSource.duration = this.videoDuration
					await this.fileDownload(selected.url)
//chama o bind p poder usar o this na funcao waitForQuestions					
					setInterval(this.waitForQuestions.bind(this), 200)
			}
	}

//espera p exibir as questoes
//de acordo com o configurado no manifest.json, no tempo definido no
//atributo "at", vai pausar o video, fazer download em segundo 
//plano e mostrar a pergunta p o user
	waitForQuestions(){
	const currentTime = parseInt(this.videoElement.currentTime)
	const option = this.selected.at === currentTime
//se n for no tempo 'at', n mostra o modal
	if (!option) return;
//evita q o modal seja aberto mais de uma vez	no msm segundo
	if (this.activeItem.url === this.selected.url) return;
//busca as 'options'' la do arquivo manifest.json	
	this.videoComponent.configureModal(this.selected.options)
	this.activeItem = this.selected
	}
//no nosso caso, uma vez q temos a duracao, baixamos o video c a resolucao esperada
async currentFileResolution(){
	const LOWEST_RESOLUTION = 144
	const prepareUrl = {
	//menor arquivo q temos	
		url: this.manifestJSON.finalizar.url,
		fileResolution: LOWEST_RESOLUTION,
		fileResolutionTag: this.manifestJSON.fileResolutionTag,
		hostTag: this.manifestJSON.hostTag,
	}
	const url = this.network.parseManifestURL(prepareUrl)

	return this.network.getProperResolution(url)
}	
//funcao p escolher o prox pedaço de video..	
	async nextChunk(data){
		const key = data.toLowerCase()
//se o prox q for selecionado for guitarra, vou pegar o obj inteiro dela no manifest.json
		const selected = this.manifestJSON[key]
		this.selected = {
			...selected,
//p garantir q se ele for selecionar duas vezes, ajusta o tempo q
//o modal vai aparecer, baseado no tempo corrente
			at: parseInt(this.videoElement.currentTime + selected.at)
		}
		this.manageLag(this.selected)
//usa o tempo restante ao se dar o play p fazer o download do
//novo do servidor p ficar transparente p o user, sem q ele perceba		
		this.videoElement.play()
		await this.fileDownload(selected.url)
	}
//geralmente o lag aparece qdo vc seleciona duas vezes o mesmo video
//e daih tem q sincronizar e aparecer na hora certa..
//n estavamos levando em consideração o tempo entre um e outro..
	manageLag(selected){
//se for selecionado mais de uma vez, incremento o at c um tempo
//o ideal eh calcular esse tempo..
		if(!!~this.selections.indexOf(selected.url)){
			selected.at += 5
			return
		}
		this.selections.push(selected.url)
	}
	async fileDownload(url) {
		console.log('url de filedownload', url)
		const fileResolution = await this.currentFileResolution(url)
		console.log('currentFileResolution', fileResolution)
			const prepareUrl = {
					url,
					fileResolution: fileResolution,
					fileResolutionTag: this.manifestJSON.fileResolutionTag,
					hostTag: this.manifestJSON.hostTag
			}
			//aqui eu vou substituir as variaveis q coloquei no arquivo manifest.json
			const finalUrl = this.network.parseManifestURL(prepareUrl)
			console.log('finalUrl', finalUrl)
			this.setVideoPlayerDuration(finalUrl)
			const data = await this.network.fetchFile(finalUrl)
			return this.processBufferSegments(data)
	}

	setVideoPlayerDuration(finalURL) {
			const bars = finalURL.split('/')
			const [ name, videoDuration] = bars[bars.length - 1].split('-')
//parseFloat p converter no tempo certo, se n, converterah p string e vai dar problema			
			this.videoDuration += parseFloat(videoDuration)
	}


//recebe todos os binarios daquele arquivo e respeita o ciclo de vida do js p ir adicionando sobre demanda..	
//n eh simplesmente esses bytes e ele vai entender.  a gente vai esperar todos os segmentos
//terminarem de atualizar, dar uma pausa e depois add eles logo na frente, pois se atualizar todos juntos, n da certo!
	async processBufferSegments(allSegments) {
			const sourceBuffer = this.sourceBuffer
			sourceBuffer.appendBuffer(allSegments)

			return new Promise((resolve, reject) => {
//funcao q manipula todo o ciclo de vida da aplicação.				
					const updateEnd = (_) => {
//p n entrar em loop infinito..
							sourceBuffer.removeEventListener("updateend", updateEnd)
							sourceBuffer.timestampOffset = this.videoDuration

							return resolve()
					}

					sourceBuffer.addEventListener("updateend", updateEnd)
					sourceBuffer.addEventListener("error", reject)
			})
	}
}