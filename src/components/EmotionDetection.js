import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import './EmotionDetection.css';  // Estilos para EmotionDetection

const EmotionDetection = ({ onEmotionConfirmed }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [stream, setStream] = useState(null);
  const [detectedEmotion, setDetectedEmotion] = useState('');
  const [confirmedEmotion, setConfirmedEmotion] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log('Modelos carregados com sucesso.');
        startVideo();
      } catch (error) {
        console.error('Erro ao carregar modelos:', error);
      }
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          setStream(stream); // Salva o stream para poder parar depois
        })
        .catch((err) => console.error('Erro ao acessar a webcam:', err));
    };

    const detectEmotions = async () => {
      if (videoRef.current && canvasRef.current) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();

        const canvas = canvasRef.current;
        const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
        faceapi.matchDimensions(canvas, displaySize);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); // Limpar canvas
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        if (detections.length > 0) {
          const emotions = detections[0].expressions;
          const primaryEmotion = Object.keys(emotions).reduce((a, b) => (
            emotions[a] > emotions[b] ? a : b
          ));
          setDetectedEmotion(primaryEmotion);
        }
      }
    };

    loadModels();
    const interval = setInterval(detectEmotions, 1000);
    return () => clearInterval(interval);
  }, []);

  // Função para parar o vídeo
  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Função para confirmar a emoção detectada
  const confirmEmotion = () => {
    setConfirmedEmotion(detectedEmotion);
    onEmotionConfirmed(detectedEmotion);
  };

  return (
    <div className="emotion-detection-container">
      <video ref={videoRef} autoPlay muted width="640" height="480" />
      <canvas ref={canvasRef} width="640" height="480" className="canvas-overlay" />
      
      <p className="emotion-text">Emoção Detectada: {detectedEmotion}</p>
      
      <div className="emotion-buttons">
        <button className="confirm-btn" onClick={confirmEmotion} disabled={!detectedEmotion}>
          Confirmar Emoção
        </button>
        <button className="stop-btn" onClick={stopVideo}>
          Parar Webcam
        </button>
      </div>
    </div>
  );
};

export default EmotionDetection;

