'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Mic, MicOff } from 'lucide-react';
import Groq from 'groq-sdk';
import ResponseBox from './ResponseBox';
import BubbleEffect from './BubbleEffect';

function FinancialAdvisor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRef = useRef(null);
  const springRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');

  const getCompletion = async (prompt) => {
    try {
      const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });
      const systemPrompt = `You are a financial advisor AI that provides personalized guidance on investments, savings, and expenses. Always offer practical and clear advice while ensuring responsible recommendations. If uncertain, suggest consulting a professional.`;
      
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.5,
      });
      
      const response = completion.choices[0].message.content;
      setChatHistory([...chatHistory, { role: 'user', content: prompt }, { role: 'assistant', content: response }]);
      generateSpeech(response);
      setCanRecord(true); // Allow recording after response
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const processUserMessage = async (userMessage) => {
    
    const prompt = `User: ${userMessage}\nProvide a concise and actionable financial advice response.`;
    const botReply = await getCompletion(prompt);
    setCurrentResponse(botReply);
  };

  const generateSpeech = async (input) => {
    setLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    const voiceId = 'Xb7hH8MSUJpSbSDYk0k2';
    
    try {
      if (springRef.current?.startSpeaking) {
        springRef.current.startSpeaking();
      }
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        { text: input },
        { headers: { 'xi-api-key': apiKey }, responseType: 'blob' }
      );
      
      const audio = new Audio(URL.createObjectURL(response.data));
      audioRef.current = audio;
      audio.onended = () => setLoading(false);
      await audio.play();
    } catch (error) {
      console.error(error);
      setError('Speech generation failed.');
    }
  };

  const startRecording = async () => {
    setCurrentResponse('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await sendAudioToAPI(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } catch (err) {
      setError('Microphone access denied.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  const sendAudioToAPI = async (audioBlob) => {
    setLoading(true);
    try {
      const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });
      const transcription = await groq.audio.transcriptions.create({
        file: new File([audioBlob], 'recording.webm', { type: 'audio/webm' }),
        model: 'whisper-large-v3-turbo',
      });
      processUserMessage(transcription.text);
    } catch (err) {
      setError('Audio processing failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden'>
      <BubbleEffect ref={springRef} />
      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen'>
        <h1 className='text-4xl font-bold text-white mb-4'>Finacial AI Advisor</h1>
        <p className='text-gray-300 max-w-md text-center'>Ask financial questions via voice or text.</p>
        {error && <p className='mt-4 text-red-400'>{error}</p>}
        <button
          className={`px-6 py-3 rounded-lg flex items-center gap-2 ${isRecording ? 'bg-red-600' : 'bg-green-600'} text-white`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
        >
          {isRecording ? <MicOff className='w-5 h-5' /> : <Mic className='w-5 h-5' />} {isRecording ? `Stop Recording (${recordingTime}s)` : 'Start Recording'}
        </button>
        <ResponseBox chatHistory={chatHistory} getCompletion={getCompletion} />
      </div>
    </div>
  );
}

export default FinancialAdvisor;
