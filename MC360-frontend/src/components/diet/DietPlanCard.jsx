import Card from '../common/Card'
import Badge from '../common/Badge'

export default function DietPlanCard({ plan }) {
  return (
    <Card hover className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-slate-800">{plan?.name || 'Diet Plan'}</h3>
        <Badge variant="green">{plan?.type || 'Balanced'}</Badge>
      </div>
      <p className="text-sm text-slate-500">{plan?.description || 'Your personalized diet plan.'}</p>
      <div className="grid grid-cols-3 gap-2 pt-2">
        {[
          { label: 'Calories', value: plan?.calories || '2000 kcal' },
          { label: 'Protein', value: plan?.protein || '80g' },
          { label: 'Carbs', value: plan?.carbs || '250g' },
        ].map((item) => (
          <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-400">{item.label}</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}