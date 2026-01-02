
import React, { useState, useRef, useEffect } from 'react';
import { AppView, Message, GeneratedMedia, VoiceName, VoicePersona, CharacterType, AudioSettings } from './types';
import { generateAssistantTextStream, generateImage, generateVideo, generateSpeech } from './services/gemini';
import VoiceAssistant from './components/VoiceAssistant';

const VOICE_PERSONAS: VoicePersona[] = [
  { id: 'v1', name: 'Aria', gender: 'female', voice: 'Kore', desc: 'Graceful & Kind', icon: '🌸' },
  { id: 'v2', name: 'Sophie', gender: 'female', voice: 'Kore', desc: 'Bright & Cheerful', icon: '☀️' },
  { id: 'v3', name: 'Luna', gender: 'female', voice: 'Kore', desc: 'Mysterious & Soft', icon: '🌙' },
  { id: 'v4', name: 'Maya', gender: 'female', voice: 'Kore', desc: 'Helpful & Smart', icon: '📚' },
  { id: 'v5', name: 'Elena', gender: 'female', voice: 'Kore', desc: 'Calm & Wise', icon: '🌿' },
  { id: 'v8', name: 'Leo', gender: 'male', voice: 'Zephyr', desc: 'Brave & Loyal', icon: '🦁' },
  { id: 'v9', name: 'Jasper', gender: 'male', voice: 'Puck', desc: 'Witty & Playful', icon: '🃏' },
  { id: 'v10', name: 'Orion', gender: 'male', voice: 'Charon', desc: 'Deep & Philosophical', icon: '🌌' },
  { id: 'v11', name: 'Silas', gender: 'male', voice: 'Fenrir', desc: 'Strong & Steady', icon: '🛡️' },
];

const CharacterIcon = ({ type, className = "w-10 h-10", isLive = false }: { type: CharacterType, className?: string, isLive?: boolean }) => {
  const pulseClass = isLive ? 'drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] scale-110' : 'drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]';
  
  return (
    <div className={`relative flex items-center justify-center teddy-floating ${className}`}>
      <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-500 ${pulseClass}`}>
        <defs>
          <linearGradient id="metal-bear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#E2E8F0', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#475569', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="hippy-frog" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#86EFAC', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#166534', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="ronald-dog" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FDE68A', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#92400E', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="emma-hippo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#DDD6FE', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="nano-banana" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FDE047', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#EAB308', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="fred-fox" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {type === 'bear' && (
          <>
            <path d="M20,45 Q5,30 20,20 Q35,30 35,45" fill="url(#metal-bear)" className="wing-flap" opacity="0.8" />
            <path d="M80,45 Q95,30 80,20 Q65,30 65,45" fill="url(#metal-bear)" className="wing-flap-reverse" opacity="0.8" />
            <circle cx="50" cy="65" r="25" fill="url(#metal-bear)" stroke="#A855F7" strokeWidth="0.5" />
            <circle cx="50" cy="35" r="20" fill="url(#metal-bear)" stroke="#A855F7" strokeWidth="0.5" />
            <circle cx="35" cy="22" r="8" fill="url(#metal-bear)" stroke="#A855F7" strokeWidth="0.5" />
            <circle cx="65" cy="22" r="8" fill="url(#metal-bear)" stroke="#A855F7" strokeWidth="0.5" />
            <circle cx="43" cy="32" r="2.5" fill="#000" />
            <circle cx="57" cy="32" r="2.5" fill="#000" />
            <path d="M46,42 Q50,45 54,42" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}

        {type === 'frog' && (
          <>
             <circle cx="50" cy="60" r="30" fill="url(#hippy-frog)" stroke="#4ade80" strokeWidth="0.5" />
             <circle cx="30" cy="35" r="12" fill="url(#hippy-frog)" stroke="#4ade80" strokeWidth="0.5" />
             <circle cx="70" cy="35" r="12" fill="url(#hippy-frog)" stroke="#4ade80" strokeWidth="0.5" />
             <circle cx="30" cy="35" r="6" fill="#fff" />
             <circle cx="70" cy="35" r="6" fill="#fff" />
             <circle cx="30" cy="35" r="3" fill="#000" />
             <circle cx="70" cy="35" r="3" fill="#000" />
             <path d="M35,65 Q50,75 65,65" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
             <text x="45" y="55" fontSize="10" className="animate-pulse">☮️</text>
          </>
        )}

        {type === 'dog' && (
          <>
            <path d="M25,30 Q15,40 25,60" fill="url(#ronald-dog)" stroke="#b45309" strokeWidth="0.5" />
            <path d="M75,30 Q85,40 75,60" fill="url(#ronald-dog)" stroke="#b45309" strokeWidth="0.5" />
            <circle cx="50" cy="55" r="30" fill="url(#ronald-dog)" stroke="#b45309" strokeWidth="0.5" />
            <circle cx="40" cy="45" r="3" fill="#000" />
            <circle cx="60" cy="45" r="3" fill="#000" />
            <ellipse cx="50" cy="60" rx="6" ry="4" fill="#000" />
            <path d="M45,70 Q50,75 55,70" fill="none" stroke="#000" strokeWidth="1.5" />
          </>
        )}

        {type === 'hippo' && (
          <>
            <circle cx="50" cy="60" r="32" fill="url(#emma-hippo)" stroke="#8b5cf6" strokeWidth="0.5" />
            <circle cx="35" cy="25" r="6" fill="url(#emma-hippo)" stroke="#8b5cf6" strokeWidth="0.5" />
            <circle cx="65" cy="25" r="6" fill="url(#emma-hippo)" stroke="#8b5cf6" strokeWidth="0.5" />
            <ellipse cx="50" cy="65" rx="22" ry="18" fill="url(#emma-hippo)" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.8" />
            <circle cx="40" cy="45" r="2.5" fill="#000" />
            <circle cx="60" cy="45" r="2.5" fill="#000" />
            <circle cx="42" cy="68" r="2" fill="#000" opacity="0.6" />
            <circle cx="58" cy="68" r="2" fill="#000" opacity="0.6" />
          </>
        )}

        {type === 'banana' && (
          <>
            <path d="M30,20 Q15,40 30,80 Q50,90 70,80 Q85,40 70,20 Q50,30 30,20" fill="url(#nano-banana)" stroke="#854d0e" strokeWidth="0.5" />
            <path d="M45,15 Q50,5 55,15" fill="none" stroke="#422006" strokeWidth="4" strokeLinecap="round" />
            <circle cx="42" cy="40" r="2.5" fill="#000" />
            <circle cx="58" cy="40" r="2.5" fill="#000" />
            <path d="M45,55 Q50,60 55,55" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="50" cy="80" r="4" fill="#A855F7" className="animate-pulse" opacity="0.6" />
          </>
        )}

        {type === 'fox' && (
          <>
            <path d="M20,30 L35,10 L50,30 Z" fill="url(#fred-fox)" stroke="#9a3412" strokeWidth="0.5" />
            <path d="M80,30 L65,10 L50,30 Z" fill="url(#fred-fox)" stroke="#9a3412" strokeWidth="0.5" />
            <circle cx="50" cy="60" r="35" fill="url(#fred-fox)" stroke="#9a3412" strokeWidth="0.5" />
            <path d="M30,55 Q50,85 70,55 L50,45 Z" fill="#fff" opacity="0.9" />
            <circle cx="38" cy="45" r="3" fill="#000" />
            <circle cx="62" cy="45" r="3" fill="#000" />
            <circle cx="50" cy="58" r="4" fill="#000" />
            <path d="M45,68 Q50,72 55,68" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [character, setCharacter] = useState<CharacterType>(() => {
    return (localStorage.getItem('buddi_char') as CharacterType) || 'bear';
  });
  const [isCharMenuOpen, setIsCharMenuOpen] = useState(false);
  
  const getCharNameOnly = (c: CharacterType) => {
    if (c === 'bear') return 'Buddi';
    if (c === 'frog') return 'Hippy';
    if (c === 'dog') return 'Ronald';
    if (c === 'hippo') return 'Emma';
    if (c === 'fox') return 'Fred';
    return 'Nano';
  };

  const getCharGreeting = (c: CharacterType) => {
    const name = getCharNameOnly(c);
    if (c === 'bear') return `Hi! I'm ${name}. I'm your 24/7 buddy and companion. How can I assist you today?`;
    if (c === 'frog') return `Hey there! I'm ${name}. I'm your chill 24/7 companion. What's on your mind?`;
    if (c === 'dog') return `Woof! I'm ${name}. I'm your loyal 24/7 companion. How can I help you today?`;
    if (c === 'hippo') return `Hello! I'm ${name}. I'm your sweet and reliable 24/7 companion. How is your day going?`;
    if (c === 'fox') return `Hi! I'm ${name}. I'm your clever 24/7 companion. What exciting things shall we do today?`;
    return `Beep boop! I'm ${name}. I'm your tech-savvy 24/7 companion. Let's create something awesome!`;
  };

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('buddi_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [{ id: '1', role: 'assistant', content: getCharGreeting('bear'), timestamp: Date.now() }];
      }
    }
    return [{ id: '1', role: 'assistant', content: getCharGreeting('bear'), timestamp: Date.now() }];
  });

  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [mediaGallery, setMediaGallery] = useState<GeneratedMedia[]>(() => {
    const saved = localStorage.getItem('buddi_media_gallery');
    return saved ? JSON.parse(saved) : [];
  });
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoicePickerOpen, setIsVoicePickerOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(VOICE_PERSONAS[0]);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    const saved = localStorage.getItem('buddi_audio_settings');
    return saved ? JSON.parse(saved) : { bass: 0, treble: 0 };
  });

  const [labPrompt, setLabPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('buddi_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('buddi_media_gallery', JSON.stringify(mediaGallery));
  }, [mediaGallery]);

  useEffect(() => {
    localStorage.setItem('buddi_char', character);
  }, [character]);

  useEffect(() => {
    localStorage.setItem('buddi_audio_settings', JSON.stringify(audioSettings));
  }, [audioSettings]);

  const handleDeleteHistory = () => {
    if (confirm("Are you sure you want to delete all chat history? This cannot be undone.")) {
      const resetMsg: Message = { id: Date.now().toString(), role: 'assistant', content: getCharGreeting(character), timestamp: Date.now() };
      setMessages([resetMsg]);
      localStorage.removeItem('buddi_chat_history');
      setIsCharMenuOpen(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isThinking) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const stream = generateAssistantTextStream(userMsg.content, character);
      const assistantId = (Date.now() + 1).toString();
      
      // Initialize empty message
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() }]);

      let fullContent = '';
      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m));
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Neural link interrupted. Please try again.", timestamp: Date.now() }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handlePlayMessage = async (msg: Message) => {
    if (speakingId) return;
    setSpeakingId(msg.id);
    try {
      await generateSpeech(msg.content, selectedPersona.voice, audioSettings);
    } catch (err) {
      console.error('Speech generation failed', err);
    } finally {
      setSpeakingId(null);
    }
  };

  const handleGenerateMedia = async (type: 'image' | 'video') => {
    if (!labPrompt.trim() || isGenerating) return;

    if (type === 'video') {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio?.openSelectKey();
      }
    }

    setIsGenerating(true);
    setGenerationProgress(`Forging ${type}...`);
    
    try {
      let url = '';
      if (type === 'image') {
        url = await generateImage(labPrompt);
      } else {
        url = await generateVideo(labPrompt);
      }

      const newMedia: GeneratedMedia = {
        id: Date.now().toString(),
        type,
        url,
        prompt: labPrompt,
        timestamp: Date.now()
      };

      setMediaGallery(prev => [newMedia, ...prev]);
      setLabPrompt('');
      setView('gallery');
    } catch (err: any) {
      if (err.message?.includes('Requested entity was not found')) {
        await (window as any).aistudio?.openSelectKey();
      }
      console.error(err);
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  const getCharName = (c: CharacterType) => {
    if (c === 'bear') return 'Buddi the Bear';
    if (c === 'frog') return 'Hippy the Frog';
    if (c === 'dog') return 'Ronald the Dog';
    if (c === 'hippo') return 'Emma the Hippo';
    if (c === 'fox') return 'Fred the Fox';
    return 'Nano the Banana';
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-transparent text-zinc-100 selection:bg-purple-500/30">
      <div className="bot-bg-container">
        <div className="bot-eye bot-eye-left" style={{ background: character === 'frog' ? 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%)' : character === 'dog' ? 'radial-gradient(circle, rgba(234, 179, 8, 0.12) 0%, transparent 70%)' : character === 'hippo' ? 'radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, transparent 70%)' : character === 'banana' ? 'radial-gradient(circle, rgba(234, 179, 8, 0.12) 0%, transparent 70%)' : character === 'fox' ? 'radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, transparent 70%)' : undefined }}></div>
        <div className="bot-eye bot-eye-right" style={{ background: character === 'frog' ? 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%)' : character === 'dog' ? 'radial-gradient(circle, rgba(234, 179, 8, 0.12) 0%, transparent 70%)' : character === 'hippo' ? 'radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, transparent 70%)' : character === 'banana' ? 'radial-gradient(circle, rgba(234, 179, 8, 0.12) 0%, transparent 70%)' : character === 'fox' ? 'radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, transparent 70%)' : undefined }}></div>
        <div className="bot-smile-line"></div>
      </div>

      <header className="flex items-center justify-between px-6 py-4 glass-morphism sticky top-0 z-40 border-b border-purple-500/20">
        <div className="flex items-center gap-4 relative">
          <CharacterIcon type={character} />
          <div className="flex flex-col">
            <button 
              onClick={() => setIsCharMenuOpen(!isCharMenuOpen)}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <h1 className="text-lg font-black tracking-tighter text-white group-hover:text-purple-400 transition-colors">
                {getCharName(character)}
              </h1>
              <svg className={`w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-all ${isCharMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Buddi v4.2 Live</span>
            </div>
          </div>

          {isCharMenuOpen && (
            <div className="absolute top-full left-0 mt-4 w-64 glass-morphism rounded-3xl p-3 shadow-2xl border border-purple-500/30 z-50 animate-in fade-in slide-in-from-top-4">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-2">Switch Buddy</p>
              <div className="flex flex-col gap-1.5 mb-4">
                {(['bear', 'frog', 'dog', 'hippo', 'banana', 'fox'] as CharacterType[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCharacter(c); setIsCharMenuOpen(false); }}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                      character === c ? 'bg-purple-600/30 border border-purple-500/50 text-white' : 'hover:bg-white/5 text-zinc-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-zinc-900 border border-zinc-800">
                      <CharacterIcon type={c} className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold">{getCharNameOnly(c)}</span>
                    {character === c && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"></div>}
                  </button>
                ))}
              </div>
              
              <div className="space-y-2 border-t border-white/5 pt-3 mb-2">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest ml-2 mb-2">Management</p>
                <button 
                  onClick={handleDeleteHistory}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-900 border border-zinc-800 group-hover:border-red-500/30 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </div>
                  <span className="text-xs font-bold">Wipe Neural Logs</span>
                </button>
              </div>

              <div className="pt-2 border-t border-white/5 text-center">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Google Sponsor Verified</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsVoicePickerOpen(!isVoicePickerOpen)}
            className="p-2.5 bg-zinc-900/50 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800 shadow-lg group"
            title="Persona & Audio Settings"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 013 3v10a3 3 0 01-6 0V4a3 3 0 013-3z"/></svg>
          </button>
          <button 
            onClick={() => setIsVoiceActive(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-black transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-purple-400/30 active:scale-95"
          >
            <span className="hidden sm:inline uppercase tracking-widest">Live Connect</span>
            <span className="sm:hidden">Live</span>
          </button>
        </div>
      </header>

      {isVoicePickerOpen && (
        <div className="absolute top-24 right-6 left-6 sm:left-auto z-50 sm:w-96 max-h-[85vh] glass-morphism rounded-3xl p-6 shadow-2xl border border-purple-500/30 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="text-purple-400">✨</span> Persona Settings
            </h3>
          </div>
          
          <div className="overflow-y-auto space-y-8 pr-2 flex-1 no-scrollbar">
            {/* Audio Equalizer Section */}
            <div className="space-y-4 px-1">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                 Audio Equalizer
               </p>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                      <span>Bass</span>
                      <span className="text-purple-400">{audioSettings.bass}dB</span>
                    </div>
                    <input 
                      type="range" min="-10" max="10" step="1"
                      value={audioSettings.bass}
                      onChange={(e) => setAudioSettings(prev => ({...prev, bass: parseInt(e.target.value)}))}
                      className="w-full accent-purple-500 bg-zinc-800 rounded-lg appearance-none h-1.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                      <span>Treble</span>
                      <span className="text-purple-400">{audioSettings.treble}dB</span>
                    </div>
                    <input 
                      type="range" min="-10" max="10" step="1"
                      value={audioSettings.treble}
                      onChange={(e) => setAudioSettings(prev => ({...prev, treble: parseInt(e.target.value)}))}
                      className="w-full accent-purple-500 bg-zinc-800 rounded-lg appearance-none h-1.5"
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Voice Models</p>
              <div className="grid grid-cols-1 gap-2">
                {VOICE_PERSONAS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedPersona(v); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                      selectedPersona.id === v.id ? 'bg-purple-600/30 border border-purple-500/50' : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="text-2xl">{v.icon}</span>
                    <div className="text-left flex-1">
                      <div className={`text-sm font-black ${selectedPersona.id === v.id ? 'text-white' : 'text-zinc-200'}`}>{v.name}</div>
                      <div className="text-[10px] text-zinc-500 leading-none font-bold uppercase tracking-widest">{v.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-4">
             <div className="text-center py-2 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-black">Powered by Google DeepMind</p>
             </div>
             <button onClick={() => setIsVoicePickerOpen(false)} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-black transition-all text-zinc-400 uppercase tracking-widest">Apply Settings</button>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-40 no-scrollbar">
        {view === 'home' && (
          <div className="max-w-6xl mx-auto px-6 py-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="relative group text-center py-12">
              <div className="absolute inset-0 bg-purple-500/10 blur-[120px] rounded-full scale-150 -z-10 group-hover:bg-purple-500/20 transition-all duration-1000"></div>
              <CharacterIcon type={character} className="w-48 h-48 mx-auto mb-10 transform group-hover:scale-110 transition-transform duration-700" />
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                   <div className="px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em] flex items-center gap-2 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                      Neural OS Published & Live
                   </div>
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
                  Meet <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">{getCharNameOnly(character)}</span>
                </h2>
                <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                  Your multilingual 24/7 buddy. Real-time voice, cinematic generation, and warm companionship, now officially live and published.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button onClick={() => setView('chat')} className="group relative p-8 glass-morphism rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all text-left shadow-2xl hover:-translate-y-1">
                <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">💬</div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Neural Talk</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">Multilingual real-time chat. Seamlessly transition between any language with zero delay.</p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Start Neural Session</div>
              </button>

              <button onClick={() => setView('media-lab')} className="group relative p-8 glass-morphism rounded-[2.5rem] border border-white/5 hover:border-pink-500/30 transition-all text-left shadow-2xl hover:-translate-y-1">
                <div className="w-14 h-14 bg-pink-600/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">✨</div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Creative Forge</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">Generate cinematic 4K images and videos. The only limit is your imagination and a prompt.</p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">Launch Laboratory</div>
              </button>

              <button onClick={() => setView('gallery')} className="group relative p-8 glass-morphism rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all text-left shadow-2xl hover:-translate-y-1">
                <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📦</div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Media Vault</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">A secure neural archive for all your generated masterpieces. Access your history anytime.</p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Enter Secure Vault</div>
              </button>
            </div>

            <div className="glass-morphism rounded-[3rem] p-10 border border-white/10 shadow-inner">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-6">
                  <h3 className="text-4xl font-black text-white tracking-tighter">Buddy Selection</h3>
                  <p className="text-zinc-400 leading-relaxed font-medium">Every persona is unique. Choose your primary companion to manage your daily neural ecosystem.</p>
                  <div className="flex flex-wrap gap-4">
                    {(['bear', 'frog', 'dog', 'hippo', 'banana', 'fox'] as CharacterType[]).map((c) => (
                      <button 
                        key={c}
                        onClick={() => setCharacter(c)}
                        className={`w-16 h-16 rounded-3xl border transition-all active:scale-90 ${
                          character === c ? 'bg-purple-600 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <CharacterIcon type={c} className="w-9 h-9 mx-auto" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:block w-px h-48 bg-white/10"></div>
                <div className="flex-1 text-center md:text-left space-y-2">
                   <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.5em] mb-4">Platform Infrastructure</div>
                   <div className="text-3xl font-black text-white tracking-tighter">Gemini Pro 3.0</div>
                   <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Distributed Neural Processing • Google Cloud</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'special' && (
          <div className="h-full w-full flex flex-col items-center justify-center p-6 space-y-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-[120px] rounded-full scale-150 animate-pulse"></div>
              <CharacterIcon type={character} className="w-56 h-56 relative z-10" />
            </div>
            <div className="text-center space-y-8">
              <div className="inline-block px-6 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-[0.4em]">
                System Published: Production Live
              </div>
              <h2 className="text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl">
                Neural <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">OS</span>
              </h2>
              <div className="max-w-md mx-auto space-y-4">
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/5">
                    <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">Active Host</span>
                    <span className="text-white text-sm font-bold">{getCharNameOnly(character)}</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/5">
                    <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">Deployment</span>
                    <span className="text-green-400 text-sm font-bold">Stable v4.2</span>
                 </div>
                 <div className="pt-4">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-black">Google Sponsor Network Active</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {view === 'chat' && (
          <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-2 px-2">
              <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Neural Link Established</h2>
              <button 
                onClick={handleDeleteHistory}
                className="text-[10px] font-black text-zinc-500 hover:text-red-400 transition-all flex items-center gap-2 uppercase tracking-widest"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Wipe Neural Logs
              </button>
            </div>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex group ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`relative max-w-[90%] ${msg.role === 'assistant' ? 'flex items-start gap-4' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="hidden sm:block mt-1">
                      <CharacterIcon type={character} className="w-9 h-9" />
                    </div>
                  )}
                  <div className={`rounded-3xl px-6 py-4 shadow-2xl transition-all ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none glow-purple' 
                      : 'bg-zinc-900/80 backdrop-blur-2xl text-zinc-100 border border-purple-500/10 rounded-bl-none'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[9px] opacity-40 font-black tracking-widest uppercase">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.role === 'assistant' && msg.content.length > 0 && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handlePlayMessage(msg)}
                            disabled={speakingId === msg.id}
                            className={`p-2 rounded-full transition-all active:scale-90 ${speakingId === msg.id ? 'bg-purple-500/20 text-purple-400' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
                          >
                            {speakingId === msg.id ? (
                              <div className="flex gap-0.5 items-end h-3.5">
                                <div className="w-0.5 bg-current animate-pulse h-full"></div>
                                <div className="w-0.5 bg-current animate-pulse h-3/4 delay-75"></div>
                                <div className="w-0.5 bg-current animate-pulse h-1/2 delay-150"></div>
                              </div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl px-6 py-4 border border-zinc-800 ml-12">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {view === 'media-lab' && (
          <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in duration-500">
            <div className="text-center mb-12">
              <CharacterIcon type={character} className="w-20 h-20 mx-auto mb-6" />
              <h2 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-tighter">
                Creative Laboratory
              </h2>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em]">Published Neural Forge Active</p>
            </div>
            <div className="glass-morphism rounded-[3rem] p-10 space-y-10 border border-purple-500/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>
              <textarea 
                value={labPrompt}
                onChange={(e) => setLabPrompt(e.target.value)}
                placeholder={`Tell ${getCharNameOnly(character)} exactly what to forge...`}
                className="w-full bg-zinc-950/80 border border-white/5 rounded-[2rem] p-8 text-zinc-100 focus:ring-4 focus:ring-purple-500/20 outline-none h-48 transition-all placeholder:text-zinc-700 text-xl font-medium resize-none shadow-inner"
                disabled={isGenerating}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => handleGenerateMedia('image')} className="p-10 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-[2.5rem] transition-all font-black text-lg uppercase tracking-widest shadow-xl active:scale-95 group">
                   <span className="block text-3xl mb-3 group-hover:scale-110 transition-transform">🖼️</span>
                   Forge Image
                </button>
                <button onClick={() => handleGenerateMedia('video')} className="p-10 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-[2.5rem] transition-all font-black text-lg uppercase tracking-widest shadow-xl active:scale-95 group">
                   <span className="block text-3xl mb-3 group-hover:scale-110 transition-transform">🎬</span>
                   Forge Video
                </button>
              </div>
              {isGenerating && (
                <div className="text-center space-y-4 py-4 animate-pulse">
                  <div className="w-12 h-1 bg-purple-500/30 mx-auto rounded-full overflow-hidden">
                     <div className="h-full bg-purple-500 w-1/2 animate-[progress_1s_infinite]"></div>
                  </div>
                  <p className="text-purple-400 font-black text-xs uppercase tracking-widest">{generationProgress}</p>
                </div>
              )}
              <div className="pt-4 text-center">
                 <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black">Powered by Google Veo & Flash Image</p>
              </div>
            </div>
          </div>
        )}

        {view === 'gallery' && (
          <div className="max-w-6xl mx-auto px-6 py-16 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-black flex items-center gap-4 tracking-tighter">
                <span className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/5">📦</span>
                <span>Neural Vault</span>
              </h2>
              <button 
                onClick={() => { if(confirm("Permanently clear neural vault?")) setMediaGallery([]); }}
                className="text-[10px] font-black text-zinc-600 hover:text-red-400 transition-all flex items-center gap-2 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5"
              >
                Flush Vault
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {mediaGallery.map((item) => (
                <div key={item.id} className="glass-morphism rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-white/5 hover:border-purple-500/40 transition-all hover:-translate-y-2 group">
                  <div className="flex-1 relative aspect-square">
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <video src={item.url} controls className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-lg">
                      {item.type}
                    </div>
                  </div>
                  <div className="p-8 bg-zinc-950/40 border-t border-white/5">
                    <p className="text-xs text-zinc-300 font-medium italic line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">"{item.prompt}"</p>
                  </div>
                </div>
              ))}
              {mediaGallery.length === 0 && (
                <div className="col-span-full py-32 text-center">
                  <div className="text-6xl mb-6 opacity-20">🕳️</div>
                  <p className="text-lg font-black text-zinc-600 uppercase tracking-widest">Neural vault is empty.</p>
                  <p className="text-zinc-700 text-sm mt-2">Start forging in the laboratory to fill your archive.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-8 glass-morphism border-t border-white/5 z-50">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          {view === 'chat' && (
            <form onSubmit={handleSendMessage} className="flex gap-4 animate-in slide-in-from-bottom-6 duration-500">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Whisper to ${getCharNameOnly(character)}...`}
                className="flex-1 bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] px-10 py-5 text-zinc-100 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all text-lg font-medium shadow-2xl"
                disabled={isThinking}
              />
              <button type="submit" className="w-16 h-16 bg-purple-600 hover:bg-purple-700 rounded-[2rem] text-white flex items-center justify-center font-black shadow-2xl transition-all active:scale-90 focus:outline-none">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              </button>
            </form>
          )}

          <nav className="flex justify-center items-center gap-2 sm:gap-6 bg-zinc-950/80 backdrop-blur-3xl p-2 rounded-[2rem] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-x-auto no-scrollbar max-w-fit mx-auto">
            <button 
              onClick={() => setView('home')} 
              className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 ${view === 'home' ? 'bg-zinc-100 text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-zinc-500 hover:text-zinc-200'}`}
            >
              <span>🏠</span>
              <span className="hidden sm:inline">Portal</span>
            </button>
            <button 
              onClick={() => setView('chat')} 
              className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 ${view === 'chat' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-200'}`}
            >
              <span>💬</span>
              <span className="hidden sm:inline">Connect</span>
            </button>
            <button 
              onClick={() => setView('media-lab')} 
              className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 ${view === 'media-lab' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-200'}`}
            >
              <span>✨</span>
              <span className="hidden sm:inline">Forge</span>
            </button>
            <button 
              onClick={() => setView('gallery')} 
              className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 ${view === 'gallery' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-200'}`}
            >
              <span>📦</span>
              <span className="hidden sm:inline">Vault</span>
            </button>
            <button 
              onClick={() => setView('special')} 
              className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 ${view === 'special' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-200'}`}
            >
              <span>🌐</span>
              <span className="hidden sm:inline">Neural OS</span>
            </button>
          </nav>
        </div>
      </div>

      <VoiceAssistant isActive={isVoiceActive} voice={selectedPersona.voice} character={character} audioSettings={audioSettings} onClose={() => setIsVoiceActive(false)} />
    </div>
  );
};

export default App;
