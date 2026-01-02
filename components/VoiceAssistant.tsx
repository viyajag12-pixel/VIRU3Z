
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decodeBase64, encodeAudio, decodeAudioData } from '../services/gemini';
import { VoiceName, CharacterType, AudioSettings } from '../types';

interface VoiceAssistantProps {
  isActive: boolean;
  onClose: () => void;
  voice: VoiceName;
  character: CharacterType;
  audioSettings: AudioSettings;
}

const CharacterIcon = ({ type, className = "w-48 h-48", isActive = false }: { type: CharacterType, className?: string, isActive?: boolean }) => {
  const pulseClass = isActive ? 'drop-shadow-[0_0_40px_rgba(168,85,247,0.8)] scale-110' : 'drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]';
  
  return (
    <div className={`relative flex items-center justify-center teddy-floating ${className}`}>
      <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-700 ${pulseClass}`}>
        <defs>
          <linearGradient id="metal-bear-live" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#F1F5F9', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#475569', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="hippy-frog-live" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#bef264', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#166534', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="ronald-dog-live" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fef3c7', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#92400E', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="emma-hippo-live" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#C4B5FD', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#6D28D9', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="nano-banana-live" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fef08a', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ca8a04', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="fred-fox-live" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fb923c', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#c2410c', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {type === 'bear' && (
          <>
            <path d="M20,45 Q5,30 20,20 Q35,30 35,45" fill="url(#metal-bear-live)" className="wing-flap" opacity="0.9" />
            <path d="M80,45 Q95,30 80,20 Q65,30 65,45" fill="url(#metal-bear-live)" className="wing-flap-reverse" opacity="0.9" />
            <circle cx="50" cy="65" r="25" fill="url(#metal-bear-live)" stroke="#A855F7" strokeWidth="0.8" />
            <circle cx="50" cy="35" r="20" fill="url(#metal-bear-live)" stroke="#A855F7" strokeWidth="0.8" />
            <circle cx="35" cy="22" r="8" fill="url(#metal-bear-live)" stroke="#A855F7" strokeWidth="0.8" />
            <circle cx="65" cy="22" r="8" fill="url(#metal-bear-live)" stroke="#A855F7" strokeWidth="0.8" />
            <circle cx="43" cy="32" r="2.5" fill="#000" />
            <circle cx="57" cy="32" r="2.5" fill="#000" />
            <path d="M46,42 Q50,45 54,42" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {type === 'frog' && (
          <>
             <circle cx="50" cy="60" r="30" fill="url(#hippy-frog-live)" stroke="#84cc16" strokeWidth="0.8" />
             <circle cx="30" cy="35" r="12" fill="url(#hippy-frog-live)" stroke="#84cc16" strokeWidth="0.8" />
             <circle cx="70" cy="35" r="12" fill="url(#hippy-frog-live)" stroke="#84cc16" strokeWidth="0.8" />
             <circle cx="30" cy="35" r="6" fill="#fff" />
             <circle cx="70" cy="35" r="6" fill="#fff" />
             <circle cx="30" cy="35" r="3" fill="#000" />
             <circle cx="70" cy="35" r="3" fill="#000" />
             <path d="M35,65 Q50,75 65,65" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {type === 'dog' && (
          <>
            <path d="M25,30 Q15,40 25,60" fill="url(#ronald-dog-live)" stroke="#b45309" strokeWidth="0.8" />
            <path d="M75,30 Q85,40 75,60" fill="url(#ronald-dog-live)" stroke="#b45309" strokeWidth="0.8" />
            <circle cx="50" cy="55" r="30" fill="url(#ronald-dog-live)" stroke="#b45309" strokeWidth="0.8" />
            <circle cx="40" cy="45" r="3" fill="#000" />
            <circle cx="60" cy="45" r="3" fill="#000" />
            <ellipse cx="50" cy="60" rx="6" ry="4" fill="#000" />
            <path d="M45,70 Q50,75 55,70" fill="none" stroke="#000" strokeWidth="2" />
          </>
        )}

        {type === 'hippo' && (
          <>
            <circle cx="50" cy="60" r="32" fill="url(#emma-hippo-live)" stroke="#7c3aed" strokeWidth="0.8" />
            <circle cx="35" cy="25" r="6" fill="url(#emma-hippo-live)" stroke="#7c3aed" strokeWidth="0.8" />
            <circle cx="65" cy="25" r="6" fill="url(#emma-hippo-live)" stroke="#7c3aed" strokeWidth="0.8" />
            <ellipse cx="50" cy="65" rx="22" ry="18" fill="url(#emma-hippo-live)" stroke="#7c3aed" strokeWidth="0.8" opacity="0.9" />
            <circle cx="40" cy="45" r="3" fill="#000" />
            <circle cx="60" cy="45" r="3" fill="#000" />
            <circle cx="42" cy="68" r="2" fill="#000" opacity="0.7" />
            <circle cx="58" cy="68" r="2" fill="#000" opacity="0.7" />
          </>
        )}

        {type === 'banana' && (
          <>
            <path d="M30,20 Q15,40 30,80 Q50,90 70,80 Q85,40 70,20 Q50,30 30,20" fill="url(#nano-banana-live)" stroke="#ca8a04" strokeWidth="0.8" />
            <path d="M45,15 Q50,5 55,15" fill="none" stroke="#422006" strokeWidth="5" strokeLinecap="round" />
            <circle cx="42" cy="40" r="3" fill="#000" />
            <circle cx="58" cy="40" r="3" fill="#000" />
            <path d="M45,55 Q50,60 55,55" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="80" r="6" fill="#A855F7" className="animate-pulse" opacity="0.8" />
          </>
        )}

        {type === 'fox' && (
          <>
            <path d="M20,30 L35,10 L50,30 Z" fill="url(#fred-fox-live)" stroke="#7c2d12" strokeWidth="0.8" />
            <path d="M80,30 L65,10 L50,30 Z" fill="url(#fred-fox-live)" stroke="#7c2d12" strokeWidth="0.8" />
            <circle cx="50" cy="60" r="35" fill="url(#fred-fox-live)" stroke="#7c2d12" strokeWidth="0.8" />
            <path d="M30,55 Q50,85 70,55 L50,45 Z" fill="#fff" opacity="0.95" />
            <circle cx="38" cy="45" r="4" fill="#000" />
            <circle cx="62" cy="45" r="4" fill="#000" />
            <circle cx="50" cy="58" r="5" fill="#000" />
            <path d="M45,68 Q50,72 55,68" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {isActive && (
          <circle cx="50" cy="65" r="8" fill="#A855F7" className="animate-pulse" opacity="0.6" />
        )}
      </svg>
    </div>
  );
};

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isActive, onClose, voice, character, audioSettings }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionVersion, setSessionVersion] = useState(0); 
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Equalizer nodes
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);

  const handleRestart = () => {
    setIsConnecting(true);
    setSessionVersion(v => v + 1);
  };

  useEffect(() => {
    if (!isActive) return;

    const startSession = async () => {
      if (sessionRef.current) {
        sessionRef.current.close();
        sessionRef.current = null;
      }
      sourcesRef.current.forEach(s => s.stop());
      sourcesRef.current.clear();
      nextStartTimeRef.current = 0;

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = outputCtx;

        // Equalizer Nodes
        const bassFilter = outputCtx.createBiquadFilter();
        bassFilter.type = 'lowshelf';
        bassFilter.frequency.value = 200;
        bassFilter.gain.value = audioSettings.bass;
        bassFilterRef.current = bassFilter;

        const trebleFilter = outputCtx.createBiquadFilter();
        trebleFilter.type = 'highshelf';
        trebleFilter.frequency.value = 3000;
        trebleFilter.gain.value = audioSettings.treble;
        trebleFilterRef.current = trebleFilter;

        bassFilter.connect(trebleFilter);
        trebleFilter.connect(outputCtx.destination);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const charName = character === 'frog' ? 'Hippy' : character === 'dog' ? 'Ronald' : character === 'hippo' ? 'Emma' : character === 'banana' ? 'Nano' : character === 'fox' ? 'Fred' : 'Buddi';
        const charFull = character === 'frog' ? 'Hippy the Frog' : character === 'dog' ? 'Ronald the Dog' : character === 'hippo' ? 'Emma the Hippo' : character === 'banana' ? 'Nano the Banana' : character === 'fox' ? 'Fred the Fox' : 'Buddi the Bear';

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => {
              setIsConnecting(false);
              const source = inputCtx.createMediaStreamSource(stream);
              const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const int16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const base64 = encodeAudio(new Uint8Array(int16.buffer));
                sessionPromise.then(session => {
                  if (session) {
                    session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
                  }
                });
              };

              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audioData) {
                setIsSpeaking(true);
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                const buffer = await decodeAudioData(decodeBase64(audioData), outputCtx, 24000, 1);
                const source = outputCtx.createBufferSource();
                source.buffer = buffer;
                
                // Connect to equalizer chain
                if (bassFilterRef.current) {
                  source.connect(bassFilterRef.current);
                } else {
                  source.connect(outputCtx.destination);
                }

                source.onended = () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) setIsSpeaking(false);
                };
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setIsSpeaking(false);
              }
            },
            onerror: (e) => {
              console.error('Live API Error:', e);
              setIsConnecting(false);
            },
            onclose: () => {
              console.log('Session closed');
            },
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
            systemInstruction: `You are ${charFull}. Your name is ${charName}. You are a warm and empathetic 24/7 buddy and companion. Speak any language the user prefers. CRITICAL: NEVER refer to yourself as Buddi unless you are actually Buddi the Bear. If you are Hippy, call yourself Hippy. If you are Ronald, call yourself Ronald. If you are Emma, call yourself Emma. If you are Nano, call yourself Nano. If you are Fred, call yourself Fred.`,
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error('Failed to start voice session', err);
        setIsConnecting(false);
      }
    };

    startSession();

    return () => {
      if (sessionRef.current) {
        sessionRef.current.close();
        sessionRef.current = null;
      }
      sourcesRef.current.forEach(s => s.stop());
      sourcesRef.current.clear();
    };
  }, [isActive, voice, character, sessionVersion]);

  // Update filters in real-time when props change
  useEffect(() => {
    if (bassFilterRef.current) {
      bassFilterRef.current.gain.setTargetAtTime(audioSettings.bass, audioContextRef.current?.currentTime || 0, 0.1);
    }
    if (trebleFilterRef.current) {
      trebleFilterRef.current.gain.setTargetAtTime(audioSettings.treble, audioContextRef.current?.currentTime || 0, 0.1);
    }
  }, [audioSettings]);

  if (!isActive) return null;

  const charDisplayName = character === 'frog' ? 'Hippy' : character === 'dog' ? 'Ronald' : character === 'hippo' ? 'Emma' : character === 'banana' ? 'Nano' : character === 'fox' ? 'Fred' : 'Buddi';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
      <div className="relative mb-16">
        <CharacterIcon type={character} isActive={isSpeaking || isConnecting} />
        {isSpeaking && (
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-1 items-end h-8">
            <div className="w-1 bg-purple-500 rounded-full animate-pulse h-full"></div>
            <div className="w-1 bg-purple-500 rounded-full animate-pulse h-3/4"></div>
            <div className="w-1 bg-purple-500 rounded-full animate-pulse h-1/2"></div>
            <div className="w-1 bg-purple-500 rounded-full animate-pulse h-3/4"></div>
            <div className="w-1 bg-purple-500 rounded-full animate-pulse h-full"></div>
          </div>
        )}
      </div>
      
      <div className="text-center space-y-4 px-6 max-w-lg">
        <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 tracking-tight">
          {isConnecting ? `${charDisplayName} is waking up...` : isSpeaking ? `${charDisplayName} is responding` : `${charDisplayName} is listening`}
        </h2>
        <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-bold">Encrypted Live Link • {voice}</p>
        <p className="max-w-xs mx-auto text-zinc-400 text-sm leading-relaxed">
          {isConnecting ? 'Establishing neural connection...' : `Speak naturally. ${charDisplayName} understands any language.`}
        </p>
      </div>

      <div className="mt-20 flex items-center gap-6">
        <button 
          onClick={handleRestart}
          title="Restart Link"
          className="flex items-center gap-2 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold transition-all border border-zinc-700 shadow-xl group"
        >
          <svg className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-500 ${isConnecting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Restart
        </button>

        <button 
          onClick={onClose}
          title="Stop Assistant"
          className="flex items-center gap-2 px-8 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl font-bold transition-all border border-red-500/20 hover:border-red-500 shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Stop
        </button>
      </div>

      <p className="mt-8 text-[10px] text-zinc-600 uppercase tracking-widest font-black">Powered by Buddi Neural OS v4.2</p>
    </div>
  );
};

export default VoiceAssistant;
