
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
<ul>