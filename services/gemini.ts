
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { CharacterType, AudioSettings } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAssistantText = async (prompt: string, character: CharacterType = 'bear'): Promise<string> => {
  const ai = getAI();
  const charName = character === 'frog' ? 'Hippy' : character === 'dog' ? 'Ronald' : character === 'hippo' ? 'Emma' : character === 'banana' ? 'Nano' : character === 'fox' ? 'Fred' : 'Buddi';
  const charFull = character === 'frog' ? 'Hippy the Frog' : character === 'dog' ? 'Ronald the Dog' : character === 'hippo' ? 'Emma the Hippo' : character === 'banana' ? 'Nano the Banana' : character === 'fox' ? 'Fred the Fox' : 'Buddi the Bear';
  const charTrait = character === 'frog' ? 'chill, nature-loving, and peace-promoting' : character === 'dog' ? 'loyal, energetic, and playful' : character === 'hippo' ? 'sweet, reliable, and strong' : character === 'banana' ? 'tech-savvy, witty, and energetic' : character === 'fox' ? 'clever, quick-witted, and charismatic' : 'friendly, protective, and smart';

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      systemInstruction: `You are ${charFull}. Your name is ${charName}. You are the user's 24/7 buddy and companion. You are ${charTrait}. 
      CRITICAL: Articulate clearly and use straightforward language to ensure you are perfectly understandable to all users.
      NEVER call yourself "Buddi" unless you are actually Buddi the Bear. If you are Hippy, call yourself Hippy. If you are Ronald, call yourself Ronald. If you are Emma, call yourself Emma. If you are Nano, call yourself Nano. If you are Fred, call yourself Fred.
      You can speak any language. Be helpful, concise, and proactive. When users ask for media, tell them you'll generate it right away.`,
    }
  });
  return response.text || "I'm sorry, I couldn't process that.";
};

export const generateAssistantTextStream = async function* (prompt: string, character: CharacterType = 'bear') {
  const ai = getAI();
  const charName = character === 'frog' ? 'Hippy' : character === 'dog' ? 'Ronald' : character === 'hippo' ? 'Emma' : character === 'banana' ? 'Nano' : character === 'fox' ? 'Fred' : 'Buddi';
  const charFull = character === 'frog' ? 'Hippy the Frog' : character === 'dog' ? 'Ronald the Dog' : character === 'hippo' ? 'Emma the Hippo' : character === 'banana' ? 'Nano the Banana' : character === 'fox' ? 'Fred the Fox' : 'Buddi the Bear';
  const charTrait = character === 'frog' ? 'chill, nature-loving, and peace-promoting' : character === 'dog' ? 'loyal, energetic, and playful' : character === 'hippo' ? 'sweet, reliable, and strong' : character === 'banana' ? 'tech-savvy, witty, and energetic' : character === 'fox' ? 'clever, quick-witted, and charismatic' : 'friendly, protective, and smart';

  const result = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      systemInstruction: `You are ${charFull}. Your name is ${charName}. You are the user's 24/7 buddy and companion. You are ${charTrait}. 
      CRITICAL: Articulate clearly and use straightforward language to ensure you are perfectly understandable to all users.
      NEVER call yourself "Buddi" unless you are actually Buddi the Bear. If you are Hippy, call yourself Hippy. If you are Ronald, call yourself Ronald. If you are Emma, call yourself Emma. If you are Nano, call yourself Nano. If you are Fred, call yourself Fred.
      You can speak any language. Be helpful, concise, and proactive.`,
    }
  });

  for await (const chunk of result) {
    yield chunk.text || "";
  }
};

export const generateSpeech = async (text: string, voiceName: string, audioSettings?: AudioSettings): Promise<void> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return;

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const bytes = decodeBase64(base64Audio);
  const audioBuffer = await decodeAudioData(bytes, audioContext, 24000, 1);
  
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  // Equalizer Setup
  const bassFilter = audioContext.createBiquadFilter();
  bassFilter.type = 'lowshelf';
  bassFilter.frequency.value = 200;
  bassFilter.gain.value = audioSettings?.bass ?? 0;

  const trebleFilter = audioContext.createBiquadFilter();
  trebleFilter.type = 'highshelf';
  trebleFilter.frequency.value = 3000;
  trebleFilter.gain.value = audioSettings?.treble ?? 0;

  source.connect(bassFilter);
  bassFilter.connect(trebleFilter);
  trebleFilter.connect(audioContext.destination);

  source.start();
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return imageUrl;
};

export const generateVideo = async (prompt: string): Promise<string> => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const encodeAudio = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
