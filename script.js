let currentCameraIndex = 0;
let videoSources = [];

// Function to switch camera
function switchCamera() {
    if (videoSources.length > 1) {
        currentCameraIndex = (currentCameraIndex + 1) % videoSources.length;
        startCamera(videoSources[currentCameraIndex].deviceId);
    }
}

// Function to start camera
function startCamera(deviceId) {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } }
    })
        .then((stream) => {
            video.srcObject = stream;
            const codeReader = new ZXing.BrowserQRCodeReader();
            codeReader.decodeFromVideoDevice(deviceId, 'video', (result, err) => {
                if (result) {
                    const decodedOutput = document.getElementById('decodedOutput');
                    decodedOutput.textContent = "Decoded Morse Code: " + result.text.trim();
                    // Close the camera after scanning
                    stream.getTracks().forEach(track => track.stop());
                }
                if (err) {
                    console.error(err);
                }
            });
        })
        .catch((err) => {
            console.error(err);
        });
}

// Initialize the app
function initializeApp() {
    const video = document.getElementById('video');
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            videoSources = devices.filter(device => device.kind === 'videoinput');
            if (videoSources.length === 0) {
                console.error('No video devices found.');
                return;
            }

            // Start with the default camera
            startCamera(videoSources[currentCameraIndex].deviceId);
        })
        .catch(err => console.error('Error enumerating video devices:', err));
}

// Initialize the app when the page is loaded
document.addEventListener('DOMContentLoaded', initializeApp);