import React, { useRef, useState } from 'react';
import './CameraComponent.css';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [fotoBase64, setFotoBase64] = useState(null);
  const [streamActivo, setStreamActivo] = useState(false);
  const [error, setError] = useState(null);

  // Iniciar la cámara
  const iniciarCamara = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActivo(true);
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      setError('No se pudo acceder a la cámara. Asegúrate de tener permisos.');
    }
  };

  // Tomar foto y convertir a base64
  const tomarFoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Configurar canvas con las dimensiones del video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Dibujar el frame actual del video en el canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convertir canvas a base64
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      setFotoBase64(base64);
    }
  };

  // Detener la cámara
  const detenerCamara = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreamActivo(false);
      setFotoBase64(null); // Limpiar la foto al detener la cámara
    }
  };

  // Tomar otra foto (reiniciar)
  const tomarOtraFoto = () => {
    setFotoBase64(null);
    // La cámara sigue activa
  };

  return (
    <div className="camera-container">
      <h2>Capturar Foto con Cámara</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="controls">
        {/* Caso 1: Cámara no activa - mostrar solo "Iniciar Cámara" */}
        {!streamActivo && !fotoBase64 && (
          <button onClick={iniciarCamara} className="btn btn-primary">
            Iniciar Cámara
          </button>
        )}

        {/* Caso 2: Cámara activa y sin foto - mostrar "Tomar Foto" y "Detener Cámara" */}
        {streamActivo && !fotoBase64 && (
          <>
            <button onClick={tomarFoto} className="btn btn-success">
              Tomar Foto
            </button>

          </>
        )}

        {/* Caso 3: Foto tomada - mostrar solo "Tomar otra foto" y "Detener Cámara" */}
        {streamActivo && fotoBase64 && (
          <>
            <button onClick={tomarOtraFoto} className="btn btn-secondary">
              Tomar otra foto
            </button>
          </>
        )}
      </div>

      {/* Vista previa de la cámara */}
      <div className="video-container">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline
          className={streamActivo && !fotoBase64 ? 'video-active' : 'video-hidden'}
        />
      </div>

      {/* Canvas oculto para procesar la imagen */}
      <canvas ref={canvasRef} className="hidden-canvas" />

      {/* Mostrar la foto capturada */}
      {fotoBase64 && (
        <div className="photo-preview">
          <h3>Foto Capturada:</h3>
          <img 
            src={fotoBase64} 
            alt="Foto capturada" 
            className="captured-image"
          />
          <div className="base64-info">
            <p><strong>Base64 (primeros 50 caracteres):</strong></p>
            <code>{fotoBase64.substring(0, 50)}...</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;