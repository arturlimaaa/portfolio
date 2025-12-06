import React, { useState, useEffect, useRef } from 'react';
import { Send, RotateCcw, Feather, Loader, Crown, Volume2, VolumeX, Sparkles } from 'lucide-react';

// --- STYLES ---

const RENAISSANCE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=IM+Fell+English:ital@0;1&display=swap');
  
  .font-heading { font-family: 'Cinzel Decorative', cursive; }
  .font-body { font-family: 'IM Fell English', serif; }

  .bg-velvet {
    background-color: #0c0a09;
    background-image: radial-gradient(circle at 50% 50%, #1c1917 0%, #000000 100%);
  }

  .perspective-1000 { perspective: 1000px; }
  .preserve-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }

  @keyframes float-spirit {
    0% { transform: translate(0, 0) scale(1); opacity: 0; }
    50% { opacity: 0.8; }
    100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
  }
  
  .spirit-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #cfb53b;
    border-radius: 50%;
    pointer-events: none;
    animation: float-spirit 2s ease-out forwards;
    box-shadow: 0 0 10px #cfb53b, 0 0 20px #ffeb3b;
  }

  @keyframes mystic-aura {
    0%, 100% { box-shadow: 0 0 20px rgba(207, 181, 59, 0.2), 0 0 40px rgba(207, 181, 59, 0.1); border-color: #8b4513; }
    50% { box-shadow: 0 0 40px rgba(207, 181, 59, 0.6), 0 0 80px rgba(207, 181, 59, 0.3); border-color: #cfb53b; }
  }

  .animate-aura {
    animation: mystic-aura 3s ease-in-out infinite;
    z-index: 40;
  }

  .scrollbar-antique::-webkit-scrollbar { width: 6px; }
  .scrollbar-antique::-webkit-scrollbar-track { background: #1a1a1a; }
  .scrollbar-antique::-webkit-scrollbar-thumb { background: #8b4513; border-radius: 3px; }
  
  .blend-vintage { filter: sepia(0.6) contrast(1.1) brightness(0.9); }

  @keyframes bubble-pop {
    0% { opacity: 0; transform: translateY(10px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  .animate-bubble { animation: bubble-pop 0.4s ease-out forwards; }
`;

// --- COMPONENTS ---

const SpiritParticles = ({ active }) => {
    if (!active) return null;
    const particles = Array.from({ length: 12 }).map((_, i) => ({
        tx: (Math.random() - 0.5) * 200 + 'px',
        ty: (Math.random() - 1) * 150 + 'px', 
        delay: Math.random() * 2 + 's'
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
            {particles.map((p, i) => (
                <div 
                    key={i} 
                    className="spirit-particle"
                    style={{ 
                        left: '50%', 
                        top: '50%', 
                        '--tx': p.tx, 
                        '--ty': p.ty, 
                        animationDelay: p.delay 
                    }}
                />
            ))}
        </div>
    );
};

const CardSlot = ({ card, index, label, isTalking }) => (
    <div className={`
        relative w-48 h-80 border-2 border-dashed border-[#5c4033]/50 rounded 
        flex items-center justify-center transition-all duration-500
        ${!card ? 'bg-black/20 hover:bg-black/40 hover:border-[#cfb53b]' : 'border-transparent'}
        ${isTalking ? 'scale-105 z-40' : ''}
    `}>
        {!card ? (
            <div className="text-[#5c4033] text-center pointer-events-none select-none">
                <div className="font-heading text-5xl opacity-20 mb-2">{index + 1}</div>
                <div className="text-xs uppercase tracking-[0.2em] opacity-50 font-heading">{label}</div>
            </div>
        ) : (
            <div className="relative w-full h-full preserve-3d animate-in zoom-in duration-500">
                <SpiritParticles active={isTalking} />
                <div className={`
                    w-full h-full rounded overflow-hidden border-[3px] border-[#2a1a1a] shadow-2xl relative
                    ${isTalking ? 'animate-aura' : ''}
                    ${card.isReversed ? 'rotate-180' : ''}
                `}>
                    <div className="absolute inset-1 border border-[#cfb53b] z-20 pointer-events-none"></div>
                    <img 
                        src={card.img} 
                        alt={card.name} 
                        className={`w-full h-full object-cover ${card.isMinor ? 'blend-vintage' : ''}`} 
                    />
                </div>
                <div className={`
                    absolute left-0 right-0 text-center animate-in fade-in slide-in-from-top-2 duration-700
                    ${card.isReversed ? '-top-10' : '-bottom-10'}
                `}>
                    <p className="text-[#cfb53b] font-heading text-[10px] tracking-[0.2em] uppercase bg-black/80 py-1 px-2 inline-block rounded border border-[#cfb53b]/30 shadow-lg">
                        {label} {card.isReversed && "(Rev)"}
                    </p>
                </div>
            </div>
        )}
    </div>
);

// --- DATA ---
const MAJOR_ARCANA = [
  { id: 'fool', name: 'The Fool', voice: 'Puck', 
    fortune_telling: 'Watch for new projects and new beginnings. Prepare to take a leap of faith.',
    keywords: 'Beginnings, Freedom, Innocence, Originality, Adventure',
    archetype: 'The Divine Child', numerology: '0 (The Void)', element: 'Air', img: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Visconti-Sforza_tarot_deck_-_Fool.jpg" },
  { id: 'magician', name: 'The Magician', voice: 'Orus', 
    fortune_telling: 'A powerful man may play a role in your day. Your talents are being called upon.',
    keywords: 'Manifestation, Resourcefulness, Power, Inspired Action', archetype: 'The Alchemist', numerology: '1', element: 'Air', img: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Visconti-Sforza_tarot_deck_-_Magician.jpg" },
  { id: 'priestess', name: 'The High Priestess', voice: 'Leda', 
    fortune_telling: 'A mysterious woman arrives. A secret is revealed.',
    keywords: 'Intuition, Sacred Knowledge, Divine Feminine', archetype: 'The Oracle', numerology: '2', element: 'Water', img: "https://upload.wikimedia.org/wikipedia/commons/7/73/Visconti-Sforza_tarot_deck_-_Popess.jpg" },
  { id: 'empress', name: 'The Empress', voice: 'Aoede', 
    fortune_telling: 'Pregnancy or a new creative project. Abundance is coming.',
    keywords: 'Femininity, Beauty, Nature, Nurturing', archetype: 'The Mother', numerology: '3', element: 'Earth', img: "https://upload.wikimedia.org/wikipedia/commons/d/db/Visconti-Sforza_tarot_deck_-_Empress.jpg" },
  { id: 'emperor', name: 'The Emperor', voice: 'Fenrir', 
    fortune_telling: 'A father figure or boss. Structure and order are needed.',
    keywords: 'Authority, Establishment, Structure', archetype: 'The Father', numerology: '4', element: 'Fire', img: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", isMinor: true }, 
  { id: 'lovers', name: 'The Lovers', voice: 'Zephyr', 
    fortune_telling: 'A choice to be made. A new relationship or a deepening of an existing one.',
    keywords: 'Love, Harmony, Relationships', archetype: 'The Soulmate', numerology: '6', element: 'Air', img: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Visconti-Sforza_tarot_deck_-_Lovers.jpg" },
  { id: 'chariot', name: 'The Chariot', voice: 'Kore', 
    fortune_telling: 'Victory is yours if you stay focused. Do not give up.',
    keywords: 'Control, Willpower, Success', archetype: 'The Warrior', numerology: '7', element: 'Water', img: "https://upload.wikimedia.org/wikipedia/commons/2/23/Visconti-Sforza_tarot_deck_-_Chariot.jpg" },
  { id: 'justice', name: 'Justice', voice: 'Leda', 
    fortune_telling: 'A legal matter will be resolved.',
    keywords: 'Justice, Fairness, Truth', archetype: 'The Judge', numerology: '11', element: 'Air', img: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Visconti-Sforza_tarot_deck_-_Justice.jpg" },
  { id: 'hermit', name: 'The Hermit', voice: 'Charon', 
    fortune_telling: 'A time for solitude and reflection.',
    keywords: 'Soul Searching, Introspection', archetype: 'The Sage', numerology: '9', element: 'Earth', img: "https://upload.wikimedia.org/wikipedia/commons/8/86/Visconti-Sforza_tarot_deck_-_Hermit.jpg" },
  { id: 'wheel', name: 'Wheel of Fortune', voice: 'Puck', 
    fortune_telling: 'Good luck is coming. A turning point.',
    keywords: 'Good Luck, Karma, Destiny', archetype: 'Destiny', numerology: '10', element: 'Fire', img: "https://upload.wikimedia.org/wikipedia/commons/3/35/Visconti-Sforza_tarot_deck_-_Wheel_of_Fortune.jpg" },
  { id: 'strength', name: 'Strength', voice: 'Kore', 
    fortune_telling: 'You have the strength to overcome.',
    keywords: 'Strength, Courage, Compassion', archetype: 'The Heroine', numerology: '8', element: 'Fire', img: "https://upload.wikimedia.org/wikipedia/commons/1/13/Visconti-Sforza_tarot_deck_-_Strength.jpg" },
  { id: 'hanged_man', name: 'The Hanged Man', voice: 'Fenrir', 
    fortune_telling: 'A time of pause and surrender.',
    keywords: 'Pause, Surrender, Letting Go', archetype: 'The Martyr', numerology: '12', element: 'Water', img: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Visconti-Sforza_tarot_deck_-_Hanged_Man.jpg" },
  { id: 'death', name: 'Death', voice: 'Charon', 
    fortune_telling: 'An ending makes way for a new beginning.',
    keywords: 'Endings, Change, Transformation', archetype: 'The Reaper', numerology: '13', element: 'Water', img: "https://upload.wikimedia.org/wikipedia/commons/9/90/Visconti-Sforza_tarot_deck_-_Death.jpg" },
  { id: 'star', name: 'The Star', voice: 'Aoede', 
    fortune_telling: 'Hope and inspiration. Your dreams are within reach.',
    keywords: 'Hope, Faith, Purpose', archetype: 'The Healer', numerology: '17', element: 'Air', img: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Visconti-Sforza_tarot_deck_-_Star.jpg" },
  { id: 'moon', name: 'The Moon', voice: 'Leda', 
    fortune_telling: 'Trust your intuition. Things may not be as they seem.',
    keywords: 'Illusion, Fear, Anxiety, Subconscious, Intuition',
    archetype: 'The Dreamer',
    numerology: '18', element: 'Water', img: "https://upload.wikimedia.org/wikipedia/commons/4/45/Visconti-Sforza_tarot_deck_-_Moon.jpg" },
  { id: 'sun', name: 'The Sun', voice: 'Orus', 
    fortune_telling: 'Success, joy, and happiness. Everything is going your way.',
    keywords: 'Positivity, Success, Vitality', archetype: 'The Child', numerology: '19', element: 'Fire', img: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Visconti-Sforza_tarot_deck_-_Sun.jpg" },
  { id: 'world', name: 'The World', voice: 'Aoede', 
    fortune_telling: 'A cycle is complete. You have achieved your goal.',
    keywords: 'Completion, Integration, Travel', archetype: 'The Completer', numerology: '21', element: 'Earth', img: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Visconti-Sforza_tarot_deck_-_World.jpg" },
];

const generateMinorArcana = () => {
    const suits = [
        { name: 'Wands', element: 'Fire', voice: 'Fenrir', keywords: 'Inspiration, Energy' },
        { name: 'Cups', element: 'Water', voice: 'Leda', keywords: 'Emotion, Relationship' },
        { name: 'Swords', element: 'Air', voice: 'Zephyr', keywords: 'Intellect, Conflict' },
        { name: 'Pentacles', element: 'Earth', voice: 'Charon', keywords: 'Material, Stability' }
    ];
    const ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
    
    return suits.flatMap(suit => ranks.map(rank => ({
        id: `${rank.toLowerCase()}-${suit.name.toLowerCase()}`,
        name: `${rank} of ${suit.name}`,
        voice: suit.voice,
        fortune_telling: `Energy of ${rank} in the realm of ${suit.name}.`,
        keywords: `${rank}, ${suit.keywords}`,
        archetype: `The ${rank} of ${suit.element}`,
        numerology: 'Minor',
        element: suit.element,
        img: `https://www.sacred-texts.com/tarot/pkt/img/${getShortSuit(suit.name)}${getShortRank(rank)}.jpg`,
        isMinor: true
    })));
};

const getShortSuit = (s) => ({'Wands':'wa','Cups':'cu','Swords':'sw','Pentacles':'pe'}[s]);
const getShortRank = (r) => ({'Ace':'ac','Page':'pa','Knight':'kn','Queen':'qu','King':'ki'}[r] || (parseInt(r)?`0${parseInt(r)}`.slice(-2):'10'));

const FULL_DECK = [...MAJOR_ARCANA, ...generateMinorArcana()];

export default function RenaissanceTarotBoard() {
  const [deck, setDeck] = useState(FULL_DECK);
  
  // Drag & Drop State
  const [slots, setSlots] = useState([null, null, null]); 
  const [draggedCard, setDraggedCard] = useState(null);
  
  const [phase, setPhase] = useState('init');
  const [activeMessage, setActiveMessage] = useState(null); 
  
  const [userQuery, setUserQuery] = useState('');
  const [initialQuestion, setInitialQuestion] = useState('');
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false); // Default to false as TTS is disabled
  
  const sessionRef = useRef(0);
  const chatEndRef = useRef(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const shuffled = [...FULL_DECK].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
  }, [phase === 'init']);

  // --- ACTIONS ---
  const resetBoard = () => {
    sessionRef.current += 1; 
    setSlots([null, null, null]);
    setActiveMessage(null);
    setPhase('init');
    setInitialQuestion('');
    setActiveSpeakerId(null);
    if (audioRef.current) { 
        audioRef.current.pause(); 
        audioRef.current.src = ""; 
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
    }
    setDeck([...FULL_DECK].sort(() => Math.random() - 0.5));
  };

  const startPicking = () => {
      if (!initialQuestion.trim()) return;
      setPhase('picking');
  };

  const handleDragStart = (e, card) => {
      setDraggedCard(card);
  };

  const handleDrop = (e, index) => {
      e.preventDefault();
      if (!draggedCard || slots[index]) return;

      const newSlots = [...slots];
      const cardWithReversal = {
          ...draggedCard,
          isReversed: Math.random() < 0.3 
      };
      
      newSlots[index] = cardWithReversal;
      setSlots(newSlots);
      setDraggedCard(null);

      setDeck(prev => prev.filter(c => c.id !== draggedCard.id));

      if (newSlots.every(s => s !== null)) {
          setPhase('interpreting');
          setTimeout(() => generateFullReading(newSlots), 1500);
      }
  };

  const handleDragOver = (e) => { e.preventDefault(); };

  // --- API ---
  const callGeminiText = async (prompt, systemInstruction, useJson = false) => {
    // Secure Backend Call
    try {
        const response = await fetch('/api/generate', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ prompt, systemInstruction, useJson }) 
        });
        
        if (!response.ok) {
             console.warn("API Status:", response.status);
             return null;
        }
        const data = await response.json();
        return data.text || null;
    } catch (error) { return null; }
  };

  const speakLine = async (cardName, text, voiceName, isCartomancer = false) => {
    const currentSession = sessionRef.current;
    const card = slots.find(c => c?.name === cardName);
    
    if (card && !isCartomancer) setActiveSpeakerId(card.id);
    
    // --- TTS DISABLED ---
    // The previous fetch logic for /api/tts has been removed here.
    // We simulate the reading time based on text length.
   
    // Simulation delay for reading (approx 50ms per character, capped at 4s)
    await new Promise(r => setTimeout(r, Math.min(text.length * 50, 4000)));

    if (sessionRef.current === currentSession) {
        setActiveSpeakerId(null);
    }
  };

  const generateFullReading = async (cards) => {
    const currentSession = sessionRef.current;
    setActiveMessage({ sender: "System", text: "The spirits are gathering...", variant: 'system' });
    setIsLoading(true);

    const positions = ["The Situation", "The Challenge", "The Outcome"];
    const cardsContext = cards.map((c, i) => `
        POSITION ${i+1}: ${positions[i]}
        CARD: ${c.name} (${c.isReversed ? 'Reversed' : 'Upright'})
        ARCHETYPE: ${c.archetype}
        KEYWORDS: ${c.keywords}
        FORTUNE TELLING: ${c.fortune_telling}
        MEANING (Light): ${c.meanings_light}
        MEANING (Shadow): ${c.meanings_shadow}
        ELEMENT: ${c.element}
        QUESTIONS: ${c.questions}
    `).join('\n\n');

    const systemPrompt = `You are an ancient Tarot Reading Engine.
    TASK: Generate a deep, mystical reading for: "${initialQuestion}".
    
    OUTPUT FORMAT: JSON Array with 3 objects.
    JSON: [ { "position": "The Situation", "card_name": "Name", "card_voice": "I am... (First Person)", "cartomancer_voice": "The card indicates... (Third Person)" }, ... ]`;

    const userPrompt = `Here is the card data:\n${cardsContext}`;

    let readingData = [];
    try {
        const jsonStr = await callGeminiText(userPrompt, systemPrompt, true);
        if (sessionRef.current !== currentSession) return;
        if (jsonStr) readingData = JSON.parse(jsonStr);
        else readingData = cards.map((c, i) => ({
            position: positions[i], card_name: c.name,
            card_voice: `I am ${c.name}. ${c.keywords}.`,
            cartomancer_voice: `${c.name} indicates ${c.fortune_telling}.`
        }));
    } catch (e) {
        if (sessionRef.current !== currentSession) return;
        readingData = cards.map((c, i) => ({
            position: positions[i], card_name: c.name,
            card_voice: `I am ${c.name}. ${c.keywords}.`,
            cartomancer_voice: `${c.name} indicates ${c.fortune_telling}.`
        }));
    }

    setIsLoading(false);

    for (let i = 0; i < readingData.length; i++) {
        if (sessionRef.current !== currentSession) return;
        const item = readingData[i];
        const card = cards[i];

        // 1. Card Speaks
        setActiveMessage({ sender: card.name, text: item.card_voice, title: item.position, variant: 'card', cardIndex: i });
        await speakLine(card.name, item.card_voice, card.voice);
        
        if (sessionRef.current !== currentSession) return;
        await new Promise(r => setTimeout(r, 600));

        // 2. Cartomancer Explains
        setActiveMessage({ sender: "Cartomancer", text: item.cartomancer_voice, title: "Interpretation", variant: 'cartomancer' });
        await speakLine("Cartomancer", item.cartomancer_voice, "Fenrir", true);
        
        if (sessionRef.current !== currentSession) return;
        await new Promise(r => setTimeout(r, 1000));
    }
    
    if (sessionRef.current === currentSession) {
        setPhase('chatting');
        setActiveMessage(null);
    }
  };

  const handleUserChat = async (e) => {
    e.preventDefault();
    const currentSession = sessionRef.current;
    if (!userQuery.trim() || isLoading) return;
    const query = userQuery;
    setUserQuery('');
    setIsLoading(true);

    const responderIndex = Math.floor(Math.random() * slots.length);
    const responder = slots[responderIndex];
    const systemPrompt = `You are ${responder.name}. Answer "${query}" in first person.`;
    let text = await callGeminiText(query, systemPrompt, false);
    
    if (sessionRef.current !== currentSession) return;
    if (!text) text = "The connection fades...";
    
    setIsLoading(false);
    setActiveMessage({ sender: responder.name, text: text, title: "Answer", variant: 'card', cardIndex: responderIndex });
    await speakLine(responder.name, text, responder.voice);
    
    if(sessionRef.current === currentSession) setTimeout(() => setActiveMessage(null), 4000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessage]);

  return (
    <>
      <style>{RENAISSANCE_STYLES}</style>
      
      <div className="flex h-screen w-full bg-velvet text-[#e8dfcc] overflow-hidden font-body relative selection:bg-[#cfb53b] selection:text-black">
        
        {/* --- FULL BOARD --- */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">
            
            {/* Header & Controls */}
            <div className="absolute top-10 left-10 z-10 pointer-events-none">
                <h1 className="text-5xl font-heading text-gold drop-shadow-lg flex items-center gap-4 tracking-wider"><Crown className="w-8 h-8 text-[#cfb53b]" /> VISCONTI SFORZA</h1>
            </div>

            <div className="absolute top-10 right-10 z-10 flex gap-4">
                 {/* Audio Toggle (Currently only affects visual timing since TTS is disabled) */}
                 <button onClick={() => setAudioEnabled(!audioEnabled)} className="text-[#8b4513] hover:text-[#cfb53b] p-2 border border-[#8b4513] rounded hover:border-[#cfb53b]">
                    {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                {/* Configuration Button Removed */}
                <button onClick={resetBoard} className="text-[#8b4513] hover:text-[#cfb53b] p-2 border border-[#8b4513] rounded hover:border-[#cfb53b]"><RotateCcw className="w-4 h-4" /></button>
            </div>

            {/* --- PHASE 1: INTENT (Landing Screen) --- */}
            {phase === 'init' && (
                <div className="z-20 flex flex-col items-center justify-center max-w-xl w-full animate-in fade-in zoom-in duration-700">
                     <div className="bg-[#1a1a1a]/90 p-10 border-2 border-[#cfb53b] rounded-sm shadow-2xl text-center w-full">
                        <h2 className="font-heading text-3xl text-[#cfb53b] mb-6 tracking-widest">CONSULT THE<br/>CARTOMANCER</h2>
                        <input type="text" className="w-full bg-[#0d0a08] border border-[#8b4513] p-4 text-xl text-center text-[#cfb53b] mb-8 focus:outline-none focus:border-[#cfb53b] placeholder-[#8b4513]/50 font-heading tracking-wide uppercase" placeholder="WHAT DO YOU SEEK?" value={initialQuestion} onChange={(e) => setInitialQuestion(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && startPicking()} autoFocus />
                        <button onClick={startPicking} disabled={!initialQuestion.trim()} className="px-8 py-4 bg-[#cfb53b]/20 text-[#cfb53b] font-bold font-heading tracking-[0.2em] hover:bg-[#cfb53b] hover:text-black transition-all border border-[#cfb53b] w-full disabled:opacity-50">BEGIN RITUAL</button>
                     </div>
                </div>
            )}

            {/* --- PHASE 2 & 3: DRAG & DROP BOARD --- */}
            {phase !== 'init' && (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
                
                {/* CENTRAL CARTOMANCER BUBBLE (Overlays everything when active) */}
                {activeMessage && activeMessage.variant === 'cartomancer' && (
                    <div className="absolute top-[15%] z-50 max-w-2xl animate-bubble">
                        <div className="bg-[#e8dfcc] text-[#1a1a1a] p-8 rounded-lg shadow-[0_0_50px_rgba(207,181,59,0.3)] border-2 border-[#8b4513] text-center relative">
                            <h3 className="font-heading text-xl text-[#8b4513] mb-4 border-b border-[#8b4513]/20 pb-2">{activeMessage.title}</h3>
                            <p className="text-lg leading-relaxed font-serif italic">"{activeMessage.text}"</p>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#e8dfcc] rotate-45 border-b-2 border-r-2 border-[#8b4513]"></div>
                        </div>
                    </div>
                )}

                {/* LOADING INDICATOR */}
                {isLoading && (
                     <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 text-[#cfb53b] bg-black/80 px-4 py-2 rounded border border-[#cfb53b]">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span className="text-xs uppercase tracking-widest font-heading">Consulting Spirits...</span>
                     </div>
                )}
                
                <div className="flex w-full max-w-6xl h-full relative items-center">
                    
                    {/* 1. DECK PILE (Left Side) */}
                    <div className="w-1/4 flex justify-center items-center relative h-full">
                        {deck.length > 0 && (
                            <div className="relative w-48 h-80 group cursor-grab active:cursor-grabbing"
                                draggable={phase === 'picking'}
                                onDragStart={(e) => handleDragStart(e, deck[deck.length - 1])}
                            >
                                {/* Stack effect cards */}
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="absolute inset-0 bg-[#1a1a1a] rounded border border-[#5c4033]" style={{ transform: `translate(-${i*1}px, -${i*1}px)` }} />
                                ))}
                                {/* Top Card (The draggable one) */}
                                <div className="absolute inset-0 bg-[#1a1a1a] rounded border-2 border-[#cfb53b] shadow-2xl flex items-center justify-center hover:-translate-y-2 transition-transform">
                                    <div className="absolute inset-2 border border-[#8b4513]/50 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-40">
                                        <Crown className="w-12 h-12 text-[#cfb53b] opacity-80" />
                                    </div>
                                </div>
                                {/* Label */}
                                <div className="absolute -bottom-10 left-0 right-0 text-center text-[#8b4513] font-heading tracking-widest text-sm">
                                    THE DECK
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. DROP ZONES (Center/Right) */}
                    <div className="flex-1 relative h-full">
                        
                         {/* CARD 1 SPEECH BUBBLE (Top Center) */}
                         {activeMessage && activeMessage.cardIndex === 0 && activeMessage.variant === 'card' && (
                             <div className="absolute top-[5%] left-1/2 -translate-x-1/2 z-50 w-80 animate-bubble">
                                 <div className="bg-[#1a1a1a] text-[#cfb53b] p-4 rounded border border-[#cfb53b] shadow-xl text-center">
                                     <div className="font-heading text-sm mb-1 border-b border-[#cfb53b]/30 pb-1">{activeMessage.title}</div>
                                     <div className="text-sm font-serif italic">"{activeMessage.text}"</div>
                                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1a1a1a] rotate-45 border-b border-r border-[#cfb53b]"></div>
                                 </div>
                             </div>
                         )}

                         {/* SLOT 1: TOP CENTER */}
                         <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-10" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 0)}>
                            <CardSlot card={slots[0]} index={0} label="The Situation" isTalking={activeSpeakerId === slots[0]?.id} />
                         </div>

                         {/* CARD 2 SPEECH BUBBLE (Bottom Left) */}
                         {activeMessage && activeMessage.cardIndex === 1 && activeMessage.variant === 'card' && (
                             <div className="absolute top-[40%] left-[15%] z-50 w-80 animate-bubble">
                                 <div className="bg-[#1a1a1a] text-[#cfb53b] p-4 rounded border border-[#cfb53b] shadow-xl text-center">
                                     <div className="font-heading text-sm mb-1 border-b border-[#cfb53b]/30 pb-1">{activeMessage.title}</div>
                                     <div className="text-sm font-serif italic">"{activeMessage.text}"</div>
                                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1a1a1a] rotate-45 border-b border-r border-[#cfb53b]"></div>
                                 </div>
                             </div>
                         )}

                         {/* SLOT 2: BOTTOM LEFT */}
                         <div className="absolute bottom-[15%] left-[25%] -translate-x-1/2 z-10" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 1)}>
                            <CardSlot card={slots[1]} index={1} label="The Challenge" isTalking={activeSpeakerId === slots[1]?.id} />
                         </div>


                         {/* CARD 3 SPEECH BUBBLE (Bottom Right) */}
                         {activeMessage && activeMessage.cardIndex === 2 && activeMessage.variant === 'card' && (
                             <div className="absolute top-[40%] right-[15%] z-50 w-80 animate-bubble">
                                 <div className="bg-[#1a1a1a] text-[#cfb53b] p-4 rounded border border-[#cfb53b] shadow-xl text-center">
                                     <div className="font-heading text-sm mb-1 border-b border-[#cfb53b]/30 pb-1">{activeMessage.title}</div>
                                     <div className="text-sm font-serif italic">"{activeMessage.text}"</div>
                                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1a1a1a] rotate-45 border-b border-r border-[#cfb53b]"></div>
                                 </div>
                             </div>
                         )}

                         {/* SLOT 3: BOTTOM RIGHT */}
                         <div className="absolute bottom-[15%] right-[25%] translate-x-1/2 z-10" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 2)}>
                            <CardSlot card={slots[2]} index={2} label="The Outcome" isTalking={activeSpeakerId === slots[2]?.id} />
                         </div>
                    </div>

                </div>
                
                {/* INTEGRATED INPUT (Bottom Center, replacing sidebar) */}
                {(phase === 'interpreting' || phase === 'chatting') && !isLoading && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 animate-in fade-in slide-in-from-bottom-4">
                        <form onSubmit={handleUserChat} className="relative bg-[#1a1a1a] border-2 border-[#cfb53b] rounded-full px-6 py-3 shadow-2xl flex items-center">
                             <input 
                                type="text" 
                                value={userQuery} 
                                onChange={(e) => setUserQuery(e.target.value)} 
                                placeholder="Ask a follow-up question..." 
                                className="w-full bg-transparent text-[#e8dfcc] placeholder-[#8b4513] focus:outline-none font-heading tracking-wide" 
                             />
                             <button type="submit" disabled={!userQuery.trim()} className="ml-4 text-[#cfb53b] hover:text-white transition-colors">
                                <Send className="w-5 h-5" />
                             </button>
                        </form>
                    </div>
                )}

                {/* Instruction Text */}
                {phase === 'picking' && (
                    <div className="absolute bottom-10 text-[#cfb53b] font-heading text-xl animate-pulse pointer-events-none">
                        Drag cards from the Deck to the 3 Slots
                    </div>
                )}

            </div>
            )}
        </div>

        {/* --- RIGHT: SIDEBAR (Chat Only) --- */}
        {/* Hides completely during 'init' phase for clean landing page */}
        {phase !== 'init' && (
        <div className="w-[400px] bg-[#d4c4a8] border-l-4 border-[#2a1a1a] flex flex-col shadow-2xl z-20 text-[#1a1a1a] hidden">
           {/* SIDEBAR HIDDEN AS REQUESTED BUT KEPT IN DOM FOR LOGIC CONTINUITY IF NEEDED LATER */}
        </div>
        )}
      </div>
      <div ref={chatEndRef} />
    </>
  );
}