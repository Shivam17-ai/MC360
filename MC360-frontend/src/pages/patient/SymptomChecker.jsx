import { useState, useRef, useEffect } from 'react'
import { Brain, Plus, X, Loader2, AlertTriangle, CheckCircle2, Info, MessageSquare, Send, User, Sparkles } from 'lucide-react'
import { aiService } from '../../services/aiService'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const COMMON_SYMPTOMS = ['Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Chest pain', 'Shortness of breath', 'Dizziness', 'Sore throat', 'Body ache']

export default function SymptomCheckerPage() {
  const [activeTab, setActiveTab] = useState('triage') // 'triage' or 'chat'
  
  // Triage state
  const [symptoms, setSymptoms] = useState([])
  const [input, setInput] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [triageResult, setTriageResult] = useState(null)
  const [triageLoading, setTriageLoading] = useState(false)

  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your MC360 AI health assistant. You can describe your symptoms or ask me any health-related questions. How can I help you today?" }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Triage logic
  const addSymptom = (s) => {
    const clean = s.trim()
    if (!clean || symptoms.includes(clean)) return
    setSymptoms(prev => [...prev, clean])
    setInput('')
  }
  const removeSymptom = (s) => setSymptoms(prev => prev.filter(x => x !== s))

  const handleTriageCheck = async () => {
    if (symptoms.length === 0) return toast.error('Add at least one symptom')
    setTriageLoading(true)
    try {
      const res = await aiService.checkSymptoms({ symptoms, age: parseInt(age) || 30, gender })
      setTriageResult(res.data.analysis)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setTriageLoading(false)
    }
  }

  // Chat logic
  const sendChatMessage = async (text) => {
    if (!text.trim() || chatLoading) return

    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setChatLoading(true)

    try {
      const history = [...messages, userMessage]
      const res = await aiService.chat({ messages: history, age: parseInt(age) || 30, gender })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }])
    } catch (e) {
      toast.error("I'm having trouble connecting right now. Please try again.")
    } finally {
      setChatLoading(false)
    }
  }

  const handleChatSend = async (e) => {
    e?.preventDefault()
    if (!chatInput.trim() || chatLoading) return
    const textToSend = chatInput
    setChatInput('')
    await sendChatMessage(textToSend)
  }

  const riskVariant = { low: 'green', moderate: 'yellow', high: 'red' }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Brain className="w-7 h-7 text-primary-600" />
          AI Symptom Checker
        </h1>
        <p className="text-slate-500 mt-1">Advanced AI analysis for your health concerns</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('triage')}
          className={clsx("px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2", activeTab === 'triage' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          <Activity className="w-4 h-4" /> Triage Assessment
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={clsx("px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2", activeTab === 'chat' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          <MessageSquare className="w-4 h-4" /> AI Chatbot
        </button>
      </div>

      {activeTab === 'triage' ? (
        <div className="space-y-6">
          <div className="card p-6 space-y-6">
            {/* Patient info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base uppercase text-[10px] tracking-wider text-slate-400">Your Age</label>
                <input type="number" min="1" max="120" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 30" className="input-base" />
              </div>
              <div>
                <label className="label-base uppercase text-[10px] tracking-wider text-slate-400">Gender</label>
                <div className="flex gap-2">
                  {['male', 'female', 'other'].map(g => (
                    <button key={g} onClick={() => setGender(g)} className={clsx("flex-1 py-2.5 rounded-xl text-sm font-medium border capitalize transition-all", gender === g ? "bg-primary-600 text-white border-primary-600" : "border-surface-200 text-slate-600 hover:border-slate-300")}>{g}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Symptom input */}
            <div>
              <label className="label-base uppercase text-[10px] tracking-wider text-slate-400">Add Symptoms</label>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSymptom(input)}
                  placeholder="Describe a symptom (e.g. Sharp headache)"
                  className="input-base flex-1"
                />
                <Button onClick={() => addSymptom(input)} variant="secondary" className="px-4">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Common symptoms */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wide">Common symptoms</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_SYMPTOMS.filter(s => !symptoms.includes(s)).map(s => (
                  <button key={s} onClick={() => addSymptom(s)} className="px-3 py-1.5 text-xs bg-surface-50 hover:bg-primary-50 hover:text-primary-700 text-slate-600 rounded-lg border border-surface-200 hover:border-primary-300 transition-all font-medium">
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected symptoms */}
            {symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {symptoms.map(s => (
                  <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm border border-primary-200 font-medium">
                    {s}
                    <button onClick={() => removeSymptom(s)} className="hover:text-primary-900 transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </span>
                ))}
              </div>
            )}

            <Button className="w-full justify-center h-12 text-base shadow-lg shadow-primary-100" loading={triageLoading} onClick={handleTriageCheck} disabled={symptoms.length === 0}>
              <Brain className="w-5 h-5" /> Analyze My Symptoms
            </Button>
          </div>

          {/* Triage Result */}
          {triageResult && (
            <div className="card p-8 space-y-6 animate-slide-up border-l-4 border-l-primary-500">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Assessment Result
                </h2>
                <Badge variant={riskVariant[triageResult.riskLevel] || 'gray'} dot className="uppercase font-bold tracking-widest text-[10px] px-3 py-1">
                  {triageResult.riskLevel} Risk
                </Badge>
              </div>

              <div className={clsx("p-5 rounded-2xl border-2 italic font-medium", triageResult.riskLevel === 'high' ? "bg-red-50/50 border-red-100 text-red-900" : triageResult.riskLevel === 'moderate' ? "bg-amber-50/50 border-amber-100 text-amber-900" : "bg-emerald-50/50 border-emerald-100 text-emerald-900")}>
                {triageResult.summary}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Conditions */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Possible Conditions</p>
                  <div className="space-y-2">
                    {triageResult.possibleConditions?.map((c, i) => (
                      <div key={i} className="p-3 bg-surface-50 rounded-xl border border-surface-100">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-slate-800">{c.name}</p>
                          <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">{c.probability}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Recommendations */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recommendations</p>
                    <div className="space-y-2">
                      {triageResult.recommendations?.map((r, i) => (
                        <div key={i} className="flex gap-2.5 text-xs text-slate-600 leading-relaxed font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Remedies */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">Home Remedies</p>
                    <div className="flex flex-wrap gap-2">
                      {triageResult.remedies?.map((r, i) => (
                        <span key={i} className="px-2.5 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-[11px] font-bold border border-teal-100">{r}</span>
                      ))}
                    </div>
                  </div>

                  {/* To Avoid */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Medicines to Avoid</p>
                    <div className="flex flex-wrap gap-2">
                      {triageResult.medicinesToAvoid?.map((m, i) => (
                        <span key={i} className="px-2.5 py-1.5 bg-red-50 text-red-700 rounded-lg text-[11px] font-bold border border-red-100">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {triageResult.riskLevel === 'high' && (
                <div className="flex items-center gap-4 p-4 bg-red-100 border-2 border-red-200 rounded-2xl animate-pulse">
                  <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-sm text-red-900 font-bold">EMERGENCY ALERT: Please seek immediate medical attention or call emergency services.</p>
                </div>
              )}

              <div className="pt-4 border-t border-surface-100">
                <p className="text-[11px] text-slate-400 text-center italic font-medium leading-relaxed">
                  <Info className="w-3 h-3 inline-block mr-1 mb-0.5" />
                  {triageResult.disclaimer || "Medical analysis by AI is for informational purposes only and is not a professional diagnosis. Always consult a healthcare provider for any serious medical concerns."}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card h-[600px] flex flex-col overflow-hidden bg-white shadow-xl border-slate-100">
          {/* Chat Header */}
          <div className="p-4 border-b border-surface-100 bg-surface-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">MC360 Medical Assistant</p>
                <p className="text-[10px] text-emerald-500 flex items-center gap-1 font-bold italic"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online & Secure</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={clsx("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "")}>
                <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center shrink-0", m.role === 'user' ? "bg-slate-100 text-slate-500" : "bg-primary-50 text-primary-500")}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                </div>
                <div className={clsx("max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed", m.role === 'user' ? "bg-primary-600 text-white rounded-tr-none" : "bg-surface-100 text-slate-700 rounded-tl-none shadow-sm border border-slate-100")}>
                  {m.role === 'user' ? (
                    m.content
                  ) : (
                    <InteractiveMessage
                      content={m.content}
                      onSend={sendChatMessage}
                      onAppend={(text) => setChatInput(prev => prev ? `${prev}, ${text}` : text)}
                      chatLoading={chatLoading}
                    />
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="bg-surface-100 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleChatSend} className="p-4 bg-surface-50 border-t border-surface-100">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask me about your symptoms or medical concerns…"
                className="input-base flex-1 rounded-full px-5 border-transparent focus:border-primary-500"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 transition-all shadow-md shadow-primary-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2 italic font-medium">Personalized AI Health Chat • Not a Replacement for Professional Care</p>
          </form>
        </div>
      )}
    </div>
  )
}

function Activity(props) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

function InteractiveMessage({ content, onSend, onAppend, chatLoading }) {
  const [selected, setSelected] = useState([])

  const parseContent = (text) => {
    if (!text) return []

    // Normalize inline markers like '* ' or '+ ' or '- ' to newlines if mashed together
    const normalized = text
      .replace(/(?:\s+|\n|^)\*(?=\s)/g, '\n*')
      .replace(/(?:\s+|\n|^)\+(?=\s)/g, '\n+')
      .replace(/(?:\s+|\n|^)-(?=\s)/g, '\n-')

    const lines = normalized.split('\n')
    const blocks = []
    let currentChips = null

    lines.forEach(line => {
      const trimmed = line.trim()
      if (!trimmed) return

      if (trimmed.startsWith('+')) {
        const value = trimmed.substring(1).trim()
        if (value) {
          if (!currentChips) {
            currentChips = { type: 'chips', items: [] }
            blocks.push(currentChips)
          }
          currentChips.items.push(value)
        }
      } else {
        currentChips = null
        
        if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
          const value = trimmed.substring(1).trim()
          if (value) {
            blocks.push({ type: 'bullet', text: value })
          }
        } else {
          blocks.push({ type: 'paragraph', text: trimmed })
        }
      }
    })

    return blocks
  }

  const blocks = parseContent(content)

  const toggleSelect = (item) => {
    setSelected(prev => 
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    )
  }

  const renderTextWithFormatting = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={index} className="font-semibold text-slate-900">{part.slice(1, -1)}</strong>
      }
      return part
    })
  }

  const handleSendReply = () => {
    if (selected.length === 0) return
    const replyText = `I am experiencing: ${selected.join(', ')}`
    onSend(replyText)
    setSelected([])
  }

  const handleAddToInput = () => {
    if (selected.length === 0) return
    onAppend(selected.join(', '))
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => {
        if (block.type === 'paragraph') {
          return (
            <p key={idx} className="text-slate-700 leading-relaxed">
              {renderTextWithFormatting(block.text)}
            </p>
          )
        }
        if (block.type === 'bullet') {
          return (
            <div key={idx} className="flex gap-2.5 items-start pl-1 my-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0 animate-pulse" />
              <p className="text-slate-700 leading-relaxed flex-1">
                {renderTextWithFormatting(block.text)}
              </p>
            </div>
          )
        }
        if (block.type === 'chips') {
          return (
            <div key={idx} className="flex flex-wrap gap-2 my-3 pl-4">
              {block.items.map((item, itemIdx) => {
                const isSelected = selected.includes(item)
                return (
                  <button
                    key={itemIdx}
                    onClick={() => toggleSelect(item)}
                    className={clsx(
                      "px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95",
                      isSelected 
                        ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-100" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    <span className={clsx(
                      "w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border transition-colors",
                      isSelected ? "border-white bg-white/20" : "border-slate-300"
                    )}>
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {item}
                  </button>
                )
              })}
            </div>
          )
        }
        return null
      })}

      {selected.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-3 pt-3 border-t border-slate-200/80 animate-fade-in">
          <p className="text-xs text-slate-500 font-medium italic">
            Selected: <span className="text-primary-700 font-bold">{selected.length}</span> {selected.length === 1 ? 'item' : 'items'}
          </p>
          <div className="flex gap-2 self-end sm:self-auto">
            <button
              onClick={handleAddToInput}
              disabled={chatLoading}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all duration-150 border border-slate-200"
            >
              Add to input
            </button>
            <button
              onClick={handleSendReply}
              disabled={chatLoading}
              className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg transition-all duration-150 shadow-md shadow-primary-100 flex items-center gap-1"
            >
              Send response
            </button>
          </div>
        </div>
      )}
    </div>
  )
}