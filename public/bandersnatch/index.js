const MANIFEST_URL = 'manifest.json'
const localHost = ['127.0.0.1', 'localhost']

async function main() {    
	//verifica se eh localhost
	const isLocal = !!~localHost.indexOf(window.location.hostname)
	console.log('Islocal', isLocal)
	const manifestJSON = await (await fetch(MANIFEST_URL)).json()
	console.log('manifestJson, ', manifestJSON)
	const host = isLocal ? manifestJSON.localHost : manifestJSON.productionHost

	const videoComponent = new VideoComponent()
	const network = new Network({ host} )

	const videoPlayer = new VideoMediaPlayer({
		manifestJSON,
		network,
		videoComponent
	})
	videoPlayer.initializeCodec()
	videoComponent.initializePlayer()
//a hr q clicar no modal, chama a funcao da forma certa, 
//n vai ser observado de fora. sempre usa a main p isso.
	window.nextChunk = (data) => videoPlayer.nextChunk(data)

	
}

window.onload = main