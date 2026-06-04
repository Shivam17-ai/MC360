import Card from '../../components/common/Card'
import NutritionChart from '../../components/diet/NutritionChart'
import DietPlanCard from '../../components/diet/DietPlanCard'

const meals = [
  { time: 'Breakfast', items: ['Oats with milk', 'Banana', 'Green tea'], calories: 380 },
  { time: 'Lunch',     items: ['Brown rice', 'Dal', 'Sabzi', 'Salad'],   calories: 520 },
  { time: 'Snacks',    items: ['Handful of almonds', 'Apple'],           calories: 180 },
  { time: 'Dinner',    items: ['Roti x2', 'Paneer curry', 'Soup'],       calories: 460 },
]

export default function DietPlanner() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-display font-bold text-slate-800">Diet Planner</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <DietPlanCard plan={{ name: 'Diabetic Diet Plan', type: 'Low Carb', description: 'Tailored for blood sugar management with balanced macros.', calories: '1540 kcal', protein: '72g', carbs: '180g' }} />
        <NutritionChart />
      </div>

      <Card>
        <h3 className="font-display font-semibold text-slate-800 mb-4">Today's Meal Plan</h3>
        <div className="space-y-4">
          {meals.map((meal) => (
            <div key={meal.time} className="flex items-start gap-4 p-3 rounded-xl bg-slate-50">
              <div className="w-20 shrink-0">
                <p className="text-xs font-semibold text-primary-600">{meal.time}</p>
                <p className="text-xs text-slate-400 mt-0.5">{meal.calories} kcal</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {meal.items.map((item) => (
                  <span key={item} className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-lg">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}