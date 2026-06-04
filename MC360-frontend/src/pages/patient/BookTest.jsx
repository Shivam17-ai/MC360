import { useState } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'

const tests = [
  { id: 1, name: 'Complete Blood Count (CBC)', category: 'Blood', price: 350,  homeCollection: true,  turnaround: '24 hrs' },
  { id: 2, name: 'Lipid Profile',              category: 'Blood', price: 600,  homeCollection: true,  turnaround: '24 hrs' },
  { id: 3, name: 'Thyroid Function Test',      category: 'Blood', price: 800,  homeCollection: true,  turnaround: '48 hrs' },
  { id: 4, name: 'Chest X-Ray',                category: 'Imaging', price: 500, homeCollection: false, turnaround: '2 hrs' },
  { id: 5, name: 'ECG',                        category: 'Cardiac', price: 300, homeCollection: false, turnaround: '1 hr' },
  { id: 6, name: 'HbA1c (Diabetes)',           category: 'Blood', price: 450,  homeCollection: true,  turnaround: '24 hrs' },
]

export default function BookTest() {
  const [selected, setSelected] = useState([])

  const toggle = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])

  const total = tests.filter((t) => selected.includes(t.id)).reduce((sum, t) => sum + t.price, 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-800">Book Lab Tests</h1>
        <p className="text-slate-500 text-sm mt-1">Select tests and book home collection or visit.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => {
          const isSelected = selected.includes(test.id)
          return (
            <Card key={test.id} className={`space-y-3 cursor-pointer border-2 transition-colors ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-transparent'}`} onClick={() => toggle(test.id)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{test.name}</p>
                  <Badge variant="slate" className="mt-1">{test.category}</Badge>
                </div>
                <input type="checkbox" checked={isSelected} readOnly className="accent-primary-600 w-4 h-4 mt-1" />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>⏱ {test.turnaround}</span>
                <Badge variant={test.homeCollection ? 'green' : 'slate'}>{test.homeCollection ? '🏠 Home Collection' : '🏥 Visit Required'}</Badge>
              </div>
              <p className="font-bold text-slate-800">₹{test.price}</p>
            </Card>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-float rounded-2xl px-6 py-4 flex items-center gap-6 border border-slate-100">
          <div>
            <p className="text-sm text-slate-500">{selected.length} test(s) selected</p>
            <p className="font-bold text-slate-800">Total: ₹{total}</p>
          </div>
          <Button>Proceed to Book</Button>
        </div>
      )}
    </div>
  )
}