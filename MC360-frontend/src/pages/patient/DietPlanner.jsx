import { useState, useEffect } from 'react'
import { dietService } from '../../services/dietService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Salad, Zap, Plus, ChevronDown, ChevronUp, Download, IndianRupee, Sparkles, Clock, Utensils } from 'lucide-react'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'

const GOALS = ['Weight Loss', 'Weight Gain', 'Muscle Building', 'Diabetes Management', 'Heart Health', 'General Wellness']
const DIET_TYPES = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian', 'Gluten-Free']

export default function DietPlanner() {
  const queryClient = useQueryClient()
  const [goal, setGoal] = useState('')
  const [dietType, setDietType] = useState('')
  const [allergies, setAllergies] = useState('')
  const [calories, setCalories] = useState('')
  const [generating, setGenerating] = useState(false)
  const [plan, setPlan] = useState(null)
  const [expandedDay, setExpandedDay] = useState(0)

  const { data: activePlan } = useQuery({
    queryKey: ['active-diet-plan'],
    queryFn: () => dietService.getActivePlan().then(r => r.data.plan),
  })

  useEffect(() => {
    if (activePlan && !plan) {
      setPlan(activePlan)
      if (activePlan.goal) {
        const matchingGoal = GOALS.find(
          g =>
            g.toLowerCase() === activePlan.goal.toLowerCase() ||
            g.replace(' ', '-').toLowerCase() === activePlan.goal.toLowerCase()
        )
        if (matchingGoal) setGoal(matchingGoal)
      }
      if (activePlan.dietType) {
        const matchingDiet = DIET_TYPES.find(d => d.toLowerCase() === activePlan.dietType.toLowerCase())
        if (matchingDiet) setDietType(matchingDiet)
      }
      if (activePlan.totalCalories) {
        setCalories(String(activePlan.totalCalories))
      }
      if (activePlan.restrictions && activePlan.restrictions.length > 0) {
        setAllergies(activePlan.restrictions.join(', '))
      }
    }
  }, [activePlan, plan])

  const { data: savedPlans } = useQuery({
    queryKey: ['diet-plans'],
    queryFn: () => dietService.getPlans().then(r => r.data.plans),
  })

  const handleGenerate = async () => {
    if (!goal || !dietType) return toast.error('Select goal and diet type')
    setGenerating(true)
    try {
      const res = await dietService.generate({ goal, dietType, allergies, targetCalories: parseInt(calories) || 2000 })
      // Backend returns { status, data: { plan }, message }
      // api.js extracts res.data
      setPlan(res.data.plan)
      toast.success('Indian meal plan generated!')
      queryClient.invalidateQueries({ queryKey: ['active-diet-plan'] })
      queryClient.invalidateQueries({ queryKey: ['diet-plans'] })
    } catch (e) {
      toast.error(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const downloadPDF = () => {
    if (!plan) return
    const { jsPDF } = window.jspdf
    const doc = new jsPDF()

    // Title
    doc.setFontSize(22)
    doc.setTextColor(16, 185, 129) // Emerald-500
    doc.text("MC360 DIET PLANNER", 105, 20, { align: 'center' })
    
    doc.setFontSize(14)
    doc.setTextColor(100)
    doc.text(`Generated for ${goal} (${dietType})`, 105, 30, { align: 'center' })
    
    doc.setFontSize(11)
    doc.text(`Target: ${plan.totalCalories || calories || 2000} kcal/day`, 20, 45)
    doc.text(`Restrictions: ${allergies || 'None'}`, 20, 52)
    
    let y = 65
    plan.days?.forEach((day, index) => {
      if (y > 250) {
        doc.addPage()
        y = 20
      }
      
      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text(`Day ${index + 1} (${day.totalCalories} kcal)`, 20, y)
      y += 8
      
      doc.setFontSize(10)
      doc.setTextColor(80)
      
      const meals = ['breakfast', 'lunch', 'snack', 'dinner']
      meals.forEach(m => {
        if (day[m]) {
          doc.setFont(undefined, 'bold')
          doc.text(`${m.toUpperCase()}: ${day[m].name} (${day[m].calories} kcal)`, 25, y)
          y += 5
          doc.setFont(undefined, 'normal')
          doc.text(`- ${day[m].description}`, 30, y)
          y += 7
        }
      })
      y += 5
    })

    doc.save(`MC360_Diet_Plan_${goal.replace(' ', '_')}.pdf`)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Salad className="w-8 h-8 text-emerald-500" />
            AI Diet Planner
          </h1>
          <p className="text-slate-500 mt-1 text-lg">Personalized Indian nutrition plans powered by Groq AI</p>
        </div>
        {plan && (
          <Button variant="secondary" onClick={downloadPDF} className="flex items-center gap-2 shadow-sm border-emerald-100 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card p-6 space-y-6 shadow-xl border-slate-100">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Configure Preferences
              </h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">HEALTH GOAL</label>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map(g => (
                    <button 
                      key={g} 
                      onClick={() => setGoal(g)} 
                      className={`py-2.5 px-3 text-[11px] font-bold rounded-xl border transition-all text-left flex items-center gap-2 ${goal === g ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-100' : 'bg-white border-slate-100 text-slate-600 hover:border-primary-300'}`}
                    >
                      {goal === g && <div className="w-1 h-1 rounded-full bg-white animate-pulse" />}
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">DIET TYPE</label>
                <div className="grid grid-cols-2 gap-2">
                  {DIET_TYPES.map(d => (
                    <button 
                      key={d} 
                      onClick={() => setDietType(d)} 
                      className={`py-2.5 px-3 text-[11px] font-bold rounded-xl border transition-all text-left flex items-center gap-2 ${dietType === d ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100' : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-300'}`}
                    >
                      {dietType === d && <div className="w-1 h-1 rounded-full bg-white animate-pulse" />}
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">TARGET CALORIES</label>
                  <input 
                    type="number" 
                    value={calories} 
                    onChange={e => setCalories(e.target.value)} 
                    placeholder="e.g. 1800" 
                    className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-primary-500 rounded-xl px-4 py-2.5 text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">ALLERGIES</label>
                  <input 
                    value={allergies} 
                    onChange={e => setAllergies(e.target.value)} 
                    placeholder="e.g. nuts" 
                    className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-primary-500 rounded-xl px-4 py-2.5 text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            <Button className="w-full justify-center h-12 text-base font-bold shadow-lg shadow-primary-100" loading={generating} onClick={handleGenerate} disabled={!goal || !dietType}>
              <Zap className="w-4 h-4" /> Generate Indian Meal Plan
            </Button>
            
            <p className="text-[10px] text-center text-slate-400 italic font-medium leading-relaxed">
              Our AI designs balanced meals incorporating Indian staples like Poha, Sabzi, and Dal based on your goals.
            </p>
          </div>
        </div>

        {/* Plan Output Display */}
        <div className="lg:col-span-8">
          {!plan ? (
            <div className="card h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white/50 border-dashed border-2 border-slate-200">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <Utensils className="w-10 h-10 text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to start?</h3>
              <p className="text-slate-400 max-w-xs">Fill in your health preferences and we'll craft a personalized 7-day Indian meal plan just for you.</p>
            </div>
          ) : (
            <div className="space-y-4 animate-slide-up">
              <div className="card p-6 flex items-center justify-between border-l-4 border-l-emerald-500 bg-white shadow-lg shadow-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <Salad className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-slate-900">{plan.title || 'Personalized Diet Plan'}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Zap className="w-3 h-3 text-primary-500" /> {plan.totalCalories} kcal/day
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Clock className="w-3 h-3 text-emerald-500" /> 7-Day Schedule
                      </span>
                    </div>
                    {plan.macros && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {plan.macros.protein && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-lg border border-amber-100">
                            Protein: {plan.macros.protein}g
                          </span>
                        )}
                        {plan.macros.carbs && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100">
                            Carbs: {plan.macros.carbs}g
                          </span>
                        )}
                        {plan.macros.fat && (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-lg border border-rose-100">
                            Fat: {plan.macros.fat}g
                          </span>
                        )}
                        {plan.macros.fiber && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100">
                            Fiber: {plan.macros.fiber}g
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-widest">{goal}</span>
                  <span className="text-[10px] text-slate-400 mt-2 font-medium italic">Indian Optimized Engine</span>
                </div>
              </div>

              <div className="space-y-3">
                {plan.days?.map((day, i) => (
                  <div key={i} className="card overflow-hidden transition-all duration-300 hover:shadow-md border-slate-100">
                    <button
                      onClick={() => setExpandedDay(expandedDay === i ? -1 : i)}
                      className={`w-full flex items-center justify-between px-6 py-5 transition-colors ${expandedDay === i ? 'bg-emerald-50/50' : 'bg-white hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${expandedDay === i ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                          {i + 1}
                        </div>
                        <span className="font-bold text-slate-800">Day {i + 1} Assessment</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500">{day.totalCalories} kcal</span>
                        {expandedDay === i ? <ChevronUp className="w-5 h-5 text-emerald-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </div>
                    </button>

                    {expandedDay === i && (
                      <div className="px-6 pb-6 pt-2 space-y-4 bg-white border-t border-slate-100">
                        <div className="grid md:grid-cols-2 gap-4">
                          {['breakfast', 'lunch', 'snack', 'dinner'].map(meal => day[meal] && (
                            <div key={meal} className="relative group">
                              <div className="absolute -left-3 top-0 bottom-0 w-1 bg-emerald-100 rounded-full group-hover:bg-emerald-400 transition-colors" />
                              <div className="space-y-1 pl-2">
                                <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">{meal}</p>
                                <p className="text-sm font-bold text-slate-800">{day[meal].name}</p>
                                <p className="text-xs text-slate-500 leading-relaxed pr-2">{day[meal].description}</p>
                                <div className="flex gap-2 items-center mt-2">
                                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500">{day[meal].calories} kcal</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}