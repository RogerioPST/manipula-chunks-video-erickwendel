
	"codec": "video/mp4; codecs=\"avc1.64001F,mp4a.40.2\"",
comandos:
<ul>
<li>

```
#shell
MP4Box -info video.mp4

#manifest.json
#avc eh de video, mp4 eh de audio extraidos pela ferramenta mp4box
#MP4Box -info video.mp4 -> dah p ver qual codec
#separa por virgula e coloca aspas escapadas..
"codec": "video/mp4; codecs=\"avc1.64001F,mp4a.40.2\"",
```
</li>
<li>ve as informações do video

```
ffprobe -i assets/timeline/01.intro-1920x1080.mp4 -show_format
```
</li>
<li>ve apenas a duration ref às informações do video, substituindo duration= por em branco e deixando apenas o valor

```
ffprobe -i assets/timeline/01.intro-1920x1080.mp4 -show_format -v quiet | sed -n 's/duration=//p'
```
</li>
<li>ve apenas a duration ref às informações do video, substituindo 'duration=' por 'teste=' 

```
ffprobe -i assets/timeline/01.intro-1920x1080.mp4 -show_format -v quiet | sed -n 's/duration=/teste=/p'
```
</li>
<li>comando p redenrizar os arquivos, de acordo com a compatibilidade de browser: https://gist.github.com/Vestride/278e13915894821e1d6f

```
#sobreescreve o arquivo c -y usando (-i) $INPUT
ffmpeg -y -i $INPUT \ 
#canal de audio ac, 2 canais estereos 
		-c:a aac -ac 2 \
#codec do video a partir da tabela h264 e do audio aac
		-vcodec h264 -acodec aac \
#average bit 128k
		-ab 128k \
		-movflags frag_keyframe+empty_moov+default_base_moof \
# 1500k de bit rate https://support.google.com/youtube/answer/2853702?hl=en
		-b:v 1500k \
		-maxrate 1500k \
#vf=value filter
		-bufsize 1000k -vf "scale=-1:720" \
		$OUTPUT720.mp4
		#-v quiet \
```
</li>
<li>

```
npm i -D http-server
```
</li>
<li>

```
"intro": {
			"url": "$HOST/timeline/01.intro/01.intro-12.733333-$RESOLUTION.mp4",
			"at": 10, //nesse tempo do video, vai fazer a pergunta e o download do outro video
			"options": ["Guitarra", "Violao"],
			"defaultOption": "Guitarra"
	},
```
</li>
<li>1
Conceitos fundamentais sobre o ciclo de vida do Javascript
Neste módulo, você aprenderá conceitos importantes para entender como a máquina virtual funciona. Vou te mostrar em detalhes sobre Call Stack, Memory Heap, Closures, Immediately Invoked Function Expression (IIFE), Currying e muitos outros temas, além do conceito de Prototype Chain e Javascript Isomórfico.
2
Data Types
Afinal, Javascript é ou não é uma linguagem de programação tipada? Neste módulo, você aprenderá sobre os principais tipos de dados, tais como Map, WeakMap, Symbol, Generators e Proxy. Vamos ver também funções da Standard API como Infinity, NaN, undefined e globalThis.
3
Javascript Fundamental
Vamos fazer uma revisão em funções nativas da linguagem, como os principais métodos de Objects, o objeto Promise, a palavra chave arguments em Functions, a diferença entre as funções .call e .apply ,além de funções globais do Javascript.
4
Javascript Testing
Este módulo vai te ajudar a entender os métodos nativos do Node.js para trabalhar com asserções em seus testes, além de conceitos chave como TDD, BDD e Use Cases.
5
Node Package Manager (NPM)
Você vai criar seu próprio pacote NPM, aprendendo como versionar pacotes usando os principais padrões semânticos, além de trabalhar com os padrões Multi e Mongo Repositories.
6
Logging and Error Handling
Neste módulo você aprenderá como manipular erros a partir de classes de erro, padrões de projeto e pacotes populares de mercado, além de conhecer ferramentas cloud para aumentar a produtividade no mapeamento de exceções.
7
Performance
Neste módulo você aprenderá as funções nativas do Node.js para inspeção e resolução de gargalos de performance, além de analisar um programa existente identificando possíveis problemas.
8
Expressões Regulares - Regex
Neste módulo você aprenderá as expressões populares e principais práticas na hora de criar expressões.
9
Design Patterns
Neste módulo, você aprenderá para que servem os padrões de projeto. Vai entender os padrões mais usados além desenvolver projetos para reutilização de código, manipulação de estado além de interceptação de funções ativas.
10
Node.js Command Line Interface (CLI)
Neste módulo você aprenderá sobre como trabalhar com arquivos, executar comandos shell de forma segura, além de entender os principais problemas em aplicações de linha de comando.
11
Node.js Streams
Neste módulo você aprenderá o que são e para que servem as Node.js Streams, trabalhando com informações sob demanda e alta escala. Vai entender as categorias de Streams além de boas práticas.
12
Node.js long-running processing
Node.js é bloqueante? Neste módulo você aprenderá sobre como processar funções de longa duração usando Worker Threads, Child processes e estratégias para programação não bloqueante.
13
Javascript Web Protocols
Neste módulo, você vai entender porque web protocols existem e como selecioná-los de acordo com sua necessidade, tais como Sockets HTTP e UDP, HTTPS, HTTP 2 e mais.
14
Javascript Security
Neste módulo você aprenderá boas práticas de segurança em aplicações Javascript, além de execução de comandos via usuário.
	
</li>
<ul>
