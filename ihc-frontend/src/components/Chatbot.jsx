import { useState, useEffect, useRef } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '¡Hola! 👋 Soy tu asistente de SmartFood. ¿En qué puedo ayudarte?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const faqResponses = {
    'perfiles': {
      keywords: ['perfil', 'perfiles', 'cuenta', 'guardar', 'familia'],
      response: 'Los perfiles son configuraciones personalizadas vinculadas a tu cuenta. Te permiten guardar diferentes preferencias alimenticias para cada persona. Por ejemplo, puedes crear un perfil para tu hermano, otro para tu mamá o tu primo, cada uno con sus propios gustos y restricciones. ¡Así el sistema filtra el menú según cada persona! 👨‍👩‍👧‍👦'
    },
    'estrellas': {
      keywords: ['estrella', 'estrellas', 'rating', 'amarilla', 'verde', 'compatibilidad', 'calificación'],
      response: '¡Excelente pregunta! 🌟\n\n⭐ Estrella amarilla: Es el rating promedio del plato. Muestra qué tan popular es según las opiniones de otros usuarios (del 1 al 5).\n\n💚 Estrella verde: Es la compatibilidad personalizada. El sistema calcula qué tan bien coincide el plato con TUS gustos y preferencias (del 1 al 5). ¡Mientras más verde, más perfecto para ti!'
    },
    'estilo_vida': {
      keywords: ['estilo de vida', 'dieta', 'omnívoro', 'vegetariano', 'vegano', 'pescetariano', 'alimentación'],
      response: 'El "estilo de vida" se refiere a tu forma habitual de alimentación. 🍽️\n\nLas opciones son:\n\n🥩 Omnívoro: Come de todo (carnes, vegetales, lácteos)\n🥗 Vegetariano: No come carnes, pero sí lácteos y huevos\n🌱 Vegano: Solo alimentos de origen vegetal\n🐟 Pescetariano: Come pescado, pero no otras carnes\n\n¡Esto ayuda al sistema a mostrarte solo los platos que se ajusten a tu dieta!'
    },
    'crear_perfil': {
      keywords: ['crear perfil', 'cómo creo', 'nuevo perfil', 'hacer perfil', 'agregar perfil'],
      response: 'Crear un perfil es súper fácil: ✨\n\n1. Haz clic en el botón "Crear perfil" en la parte superior\n2. Dale un nombre al perfil (ejemplo: "Hermano", "Kevin", "Sis", "Mamá")\n3. Selecciona el estilo de vida (dieta)\n4. Configura las preferencias: nivel de picante, alérgenos a evitar, rango de calorías\n5. ¡Guarda y listo! 🎉\n\nAhora puedes seleccionar ese perfil cuando quieras filtrar el menú según esos gustos.'
    },
    'alergenos': {
      keywords: ['alérgeno', 'alérgenos', 'alergia', 'alergias', 'intolerancias'],
      response: 'Los alérgenos son ingredientes que pueden causar reacciones alérgicas o intolerancias. 🚫\n\nEn tu perfil puedes marcar los que necesites evitar (lácteos, mariscos, frutos secos, gluten, etc.). El sistema automáticamente filtrará los platos que los contengan para mantener tu alimentación segura. ¡Tu salud es lo primero! 💪'
    }
  };

  const getDefaultResponses = () => [
    '¿Qué son los perfiles?',
    '¿Qué significan las estrellas?',
    '¿Qué es el estilo de vida?',
    '¿Cómo creo un perfil?'
  ];

  const findBestResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, data] of Object.entries(faqResponses)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.response;
      }
    }
    
    return 'Hmm, no estoy seguro de entender tu pregunta. 🤔\n\nPuedo ayudarte con:\n• Qué son los perfiles\n• Qué significan las estrellas\n• Qué es el estilo de vida\n• Cómo crear un perfil\n• Información sobre alérgenos\n\n¡Pregúntame sobre cualquiera de estos temas!';
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: findBestResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };

  const handleQuickQuestion = (question) => {
    const userMessage = {
      type: 'user',
      text: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: findBestResponse(question),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#DFD0B8',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 200ms, box-shadow 200ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
        >
          <span style={{ fontSize: '30px' }}>💬</span>
        </button>
      ) : (
        <div style={{
          width: '380px',
          height: '550px',
          backgroundColor: '#393E46',
          borderRadius: '15px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '2px solid #948979'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#222831',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #948979'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#DFD0B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                🤖
              </div>
              <div>
                <h3 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>Asistente SmartFood</h3>
                <p style={{ margin: 0, color: '#DFD0B8', fontSize: '0.75rem' }}>Siempre aquí para ayudarte</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '5px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '20px', color: '#DFD0B8' }}>✕</span>
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: message.type === 'user' ? '#DFD0B8' : '#222831',
                  color: message.type === 'user' ? '#222831' : 'white',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-line'
                }}>
                  {message.text}
                </div>
              </div>
            ))}
            
            {/* Quick Questions */}
            {messages.length === 1 && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ color: '#948979', fontSize: '0.85rem', marginBottom: '8px' }}>
                  Preguntas frecuentes:
                </p>
                {getDefaultResponses().map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      marginBottom: '6px',
                      backgroundColor: '#222831',
                      color: '#DFD0B8',
                      border: '1px solid #948979',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      textAlign: 'left',
                      transition: 'all 200ms'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#948979';
                      e.currentTarget.style.color = '#222831';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#222831';
                      e.currentTarget.style.color = '#DFD0B8';
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '15px',
            borderTop: '2px solid #948979',
            backgroundColor: '#222831'
          }}>
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '20px',
                  border: '1px solid #948979',
                  backgroundColor: '#393E46',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#DFD0B8',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 200ms'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{ fontSize: '18px' }}>➤</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;