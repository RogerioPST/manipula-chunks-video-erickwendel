  
class Network {
	constructor({ host }) {
			this.host = host
	}


	parseManifestURL({ url, fileResolution, fileResolutionTag, hostTag}) {
		console.log('url', url)
//aqui eu vou substituir as variaveis q coloquei no arquivo manifest.json - fileResolutionTag e  hostTag
			return url.replace(fileResolutionTag, fileResolution).replace(hostTag, this.host)
	}

	async fetchFile(url) {
			const response = await fetch(url)
//importante retornar como buffer pois vai retornar sobre demanda no html	
			return response.arrayBuffer()
	}

	async getProperResolution(url){
//se fossemos fazer igual a netflix aqui, pegariamos o length do arrayBuffer 
//e fariamosvezes o arrayBuffer		
		const startMs = Date.now()
		const response = await fetch(url)
//o await vai garantir q eu baixe o arquivo inteiro		
		await response.arrayBuffer()
		const endMs = Date.now()
//calcula o tempo q demora p baixar o arquivo todo			
		const durationInMs = (endMs - startMs)
//ao inves de calcular pelo throughPut, vamos calcular pelo tempo
//se fossemos fazer igual a netflix aqui, pegariamos o length do arrayBuffer 
//e fariamosvezes o arrayBuffer		
		const resolutions =[
			//pior cenario possivel de demora (ate 20 segundos)
			{ start: 3001, end: 20000, resolution: 144},
			//ate 3 segundos
			{ start: 901, end: 3000, resolution: 360},
			//menos de 1 seg
			{ start: 0, end: 900, resolution: 720},
		]
		
		const item = resolutions.find(item =>{
			return item.start <= durationInMs && item.end >= durationInMs
		})

		const LOWEST_RESOLUTION = 144
		//se for mais q 20 seg, retorna 144
		if (!item) return LOWEST_RESOLUTION

		return item.resolution


	}
}