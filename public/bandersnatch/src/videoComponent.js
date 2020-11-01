class VideoComponent {
	constructor() {
		this.modal = {}

	}

	initializePlayer() {
			const player = videojs('vid');
			const ModalDialog = videojs.getComponent('ModalDialog');
			const modal = new ModalDialog(player, {
					temporary: false,
					closeable: true
			});

			player.addChild(modal);
			player.on('play', () => modal.close())
			this.modal = modal
			
	}
//configura o template e agenda o evento	
	configureModal(selected) {
		const modal = this.modal
//atualiza na tela c a opção selecionada		
		modal.on('modalopen', this.getModalTemplate(selected, modal))
		modal.open()
	}

	getModalTemplate(options, modal) {
//Currying é o processo de transformar uma função que espera vários argumentos em uma função que espera um único argumento e retorna outra função curried. Por exemplo, uma função que recebe três argumentos, ao sofrer currying, resulta em uma função que recebe um argumento e retorna uma função que recebe um argumento, que por sua vez retorna uma função que recebe um argumento e retorna o resultado da função original
		return (_) => {
				const [ option1, option2] = options
				const htmlTemplate = `
				<div class='overlay'>
						<div class='videoButtonWrapper'>
								<button class="btn btn-dark" onclick="window.nextChunk('${option1}')">
										${option1}
								</button>
								<button class="btn btn-dark" onclick="window.nextChunk('${option2}')">
										${option2}
								</button>
						</div>
				</div>
				`

				modal.contentEl().innerHTML = htmlTemplate
		}
}
}