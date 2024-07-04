const $startBtn = document.getElementById('start');
const $stopBtn = document.getElementById('stop');
const $recordingStatus = document.getElementById('recording-status');


let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

$startBtn.addEventListener('click', async () => {
    try {
        if (!isRecording) {
            const mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: 30 } }
            });

            mediaRecorder = new MediaRecorder(mediaStream, {
                mimeType: 'video/webm;codecs=vp8,opus'
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'screen-recording.webm';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);

                // Reiniciar el estado después de detener la grabación
                isRecording = false;
                $recordingStatus.style.display = 'none';
                $startBtn.style.display = 'inline';
            };

            mediaRecorder.start();
            console.log('Video recording started');

            // Actualizar estado del popup
            isRecording = true;
            $recordingStatus.style.display = 'inline'; // Mostrar "Grabando..."
            $startBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});

$stopBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        console.log('Video recording stopped');

        // Reiniciar el estado después de detener la grabación
        isRecording = false;
        $recordingStatus.style.display = 'none';
    }
});
