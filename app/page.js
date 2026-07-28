'use client'
import { useState } from 'react'

export default function Home() {
  const [activeMain, setActiveMain] = useState('home')
  const [showQuiz, setShowQuiz] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResults, setQuizResults] = useState(null)

  const handleQuizAnswer = (question, answer) => {
    setQuizAnswers(prev => ({...prev, [question]: answer}))
  }

  const generatePDF = () => {
    const content = `Assessment - ${new Date().toLocaleDateString()}\n\n${quizResults.details}\n\n${quizResults.recommendations.join('\n')}`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', 'assessment.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const incomeRanges = {
    'under25': '$25k',
    '25to50': '$50k',
    '50to75': '$75k',
    '75to100': '$100k',
    '100to150': '$150k',
    '150plus': '$150k+'
  }

  const calculateMedicareResults = () => {
    setQuizResults({
      recommendations: ['Plan G Medigap recommended', 'Part D for prescriptions'],
      details: `Age: ${quizAnswers.age} | Income: ${quizAnswers.income}`
    })
  }

  const calculateIndividualResults = () => {
    setQuizResults({
      recommendations: ['You likely qualify for subsidies', 'Visit CoveredCA.com to apply'],
      details: `Household: ${quizAnswers.ind_household} | Income: ${quizAnswers.ind_income}`
    })
  }

  const calculateGroupResults = () => {
    setQuizResults({
      recommendations: ['SHOP marketplace eligible', 'Estimated tax credit: $500-2000/month'],
      details: `Employees: ${quizAnswers.group_employees}`
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-30 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => setActiveMain('home')} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#003366] to-[#0066cc] rounded flex items-center justify-center text-white font-bold">LK</div>
            <span className="text-lg font-bold text-[#003366]">Linda Karp</span>
          </button>
          <nav className="flex gap-6 items-center text-sm">
            <button onClick={() => setActiveMain('medicare')} className="text-gray-700 hover:text-[#003366] font-medium">Medicare</button>
            <button onClick={() => setActiveMain('individual')} className="text-gray-700 hover:text-[#003366] font-medium">Individual</button>
            <button onClick={() => setActiveMain('group')} className="text-gray-700 hover:text-[#003366] font-medium">Group</button>
            <button className="px-4 py-2 bg-[#003366] text-white rounded text-sm font-medium hover:bg-[#002240]">(619) 439-2110</button>
          </nav>
        </div>
      </header>

      {activeMain === 'home' && (
        <div>
          {/* Hero */}
          <section className="max-w-5xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Health insurance you can trust</h1>
                <p className="text-gray-700 mb-6 leading-relaxed">28 years helping Californians find the right coverage for their lives.</p>
                <div className="flex gap-3">
                  <button onClick={() => setActiveMain('medicare')} className="px-6 py-2 bg-[#003366] text-white rounded font-medium hover:bg-[#002240]">Medicare</button>
                  <button onClick={() => setActiveMain('individual')} className="px-6 py-2 border-2 border-[#003366] text-[#003366] rounded font-medium hover:bg-[#003366] hover:text-white">Individual</button>
                  <button onClick={() => setActiveMain('group')} className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50">Group</button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-80 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop" alt="Professional woman" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          </section>

          {/* Three Simple Cards */}
          <section className="max-w-5xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {icon: '🏥', title: 'Medicare', desc: 'Turning 65?', action: () => setActiveMain('medicare')},
                {icon: '👨‍👩‍👧', title: 'Individual', desc: 'Need coverage?', action: () => setActiveMain('individual')},
                {icon: '🏢', title: 'Group', desc: 'For your team?', action: () => setActiveMain('group')}
              ].map((item, i) => (
                <button key={i} onClick={item.action} className="text-left border border-gray-200 rounded-lg p-6 hover:border-[#003366] hover:shadow-lg transition">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeMain === 'medicare' && (
        <section className="max-w-3xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Medicare Planning</h2>
          
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg h-80 mb-8 flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop" alt="Senior healthcare" className="w-full h-full object-cover rounded-lg" />
          </div>

          <div className="space-y-6 mb-8">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="font-bold text-gray-900 mb-1">Original Medicare</h3>
              <p className="text-sm text-gray-600">Government coverage (Part A & B). Covers 80% after deductible.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="font-bold text-gray-900 mb-1">Medicare Supplement (Medigap)</h3>
              <p className="text-sm text-gray-600">Fills gaps. Most choose Plan G. $140-300/month.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="font-bold text-gray-900 mb-1">Medicare Advantage (Part C)</h3>
              <p className="text-sm text-gray-600">All-in-one with prescriptions. Often $0 premium.</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded p-4 text-sm text-gray-700 mb-8">
            <strong>Important:</strong> Enroll within 7 months of turning 65 (3 months before, during, 3 months after). Late penalties are permanent.
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Part A</p>
              <p className="font-bold text-gray-900">$1,780</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Part B</p>
              <p className="font-bold text-gray-900">$280</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Medigap G</p>
              <p className="font-bold text-gray-900">$140-300</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Part D</p>
              <p className="font-bold text-gray-900">$30-100</p>
            </div>
          </div>

          <button onClick={() => setShowQuiz('medicare')} className="w-full px-6 py-3 bg-[#003366] text-white rounded font-bold hover:bg-[#002240]">Get My Recommendation</button>
        </section>
      )}

      {activeMain === 'individual' && (
        <section className="max-w-3xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Individual & Family Plans</h2>
          
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg h-80 mb-8 flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop" alt="Family" className="w-full h-full object-cover rounded-lg" />
          </div>

          <p className="text-gray-700 mb-8">Coverage through CoveredCA. The government helps many people with subsidies based on income.</p>

          <div className="space-y-3 mb-8">
            <div className="flex gap-3 items-start">
              <span className="text-lg">✓</span>
              <p className="text-sm text-gray-700"><strong>No exclusions</strong> for pre-existing conditions</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-lg">✓</span>
              <p className="text-sm text-gray-700"><strong>Tax credits</strong> available based on income</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-lg">✓</span>
              <p className="text-sm text-gray-700"><strong>4 plan types</strong> (Bronze 60% → Platinum 90%)</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 mb-8">
            2026 income thresholds for maximum subsidy: Individual $37k | Family of 4 $76k
          </div>

          <button onClick={() => setShowQuiz('individual')} className="w-full px-6 py-3 bg-[#003366] text-white rounded font-bold hover:bg-[#002240]">Check Subsidy Eligibility</button>
        </section>
      )}

      {activeMain === 'group' && (
        <section className="max-w-3xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Group Coverage</h2>
          
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg h-80 mb-8 flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop" alt="Business team" className="w-full h-full object-cover rounded-lg" />
          </div>

          <p className="text-gray-700 mb-8">Offering health coverage attracts talent, is tax-deductible, and can qualify for government tax credits.</p>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="font-bold text-gray-900 mb-1">SHOP Marketplace</p>
              <p className="text-sm text-gray-700">2-50 employees. Up to 50% tax credit. Guaranteed coverage.</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="font-bold text-gray-900 mb-1">Costs</p>
              <p className="text-sm text-gray-700">$350-800/employee/month. You typically cover 50-75%.</p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
              <p className="font-bold text-gray-900 mb-1">Employee Choice</p>
              <p className="text-sm text-gray-700">Employees pick their own plan within your contribution level.</p>
            </div>
          </div>

          <button onClick={() => setShowQuiz('group')} className="w-full px-6 py-3 bg-[#003366] text-white rounded font-bold hover:bg-[#002240]">Calculate Tax Credits</button>
        </section>
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Quick Assessment</h3>
              <button onClick={() => { setShowQuiz(null); setQuizResults(null); }} className="text-2xl text-gray-400">×</button>
            </div>

            {!quizResults ? (
              <div className="space-y-4">
                {showQuiz === 'medicare' && (
                  <>
                    <input type="number" placeholder="Age" onChange={(e) => handleQuizAnswer('age', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" />
                    <select onChange={(e) => handleQuizAnswer('income', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm">
                      <option value="">Income</option>
                      <option value="under25">Under $25k</option>
                      <option value="25to50">$25k-$50k</option>
                      <option value="50to75">$50k-$75k</option>
                    </select>
                    <button onClick={calculateMedicareResults} className="w-full px-4 py-2 bg-[#003366] text-white rounded font-bold">Get Recommendation</button>
                  </>
                )}
                {showQuiz === 'individual' && (
                  <>
                    <select onChange={(e) => handleQuizAnswer('ind_household', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm">
                      <option value="">Household Size</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                    <select onChange={(e) => handleQuizAnswer('ind_income', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm">
                      <option value="">Income</option>
                      <option value="under25">Under $25k</option>
                      <option value="25to50">$25k-$50k</option>
                      <option value="50to75">$50k-$75k</option>
                    </select>
                    <button onClick={calculateIndividualResults} className="w-full px-4 py-2 bg-[#003366] text-white rounded font-bold">Check Eligibility</button>
                  </>
                )}
                {showQuiz === 'group' && (
                  <>
                    <input type="number" placeholder="# Employees" onChange={(e) => handleQuizAnswer('group_employees', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" />
                    <button onClick={calculateGroupResults} className="w-full px-4 py-2 bg-[#003366] text-white rounded font-bold">Calculate</button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{quizResults.details}</p>
                {quizResults.recommendations.map((r, i) => (
                  <div key={i} className="bg-blue-50 p-3 rounded text-sm">{r}</div>
                ))}
                <div className="flex gap-2 pt-4">
                  <button onClick={generatePDF} className="flex-1 px-4 py-2 bg-[#003366] text-white rounded text-sm font-bold">Download</button>
                  <button onClick={() => setQuizResults(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm">Back</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6 mt-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="font-bold mb-1">Linda Karp Insurance</p>
            <p className="text-gray-400">28+ years helping Californians.</p>
          </div>
          <div>
            <p className="font-bold mb-2">Services</p>
            <p className="text-gray-400 text-xs">Medicare • Individual • Group</p>
          </div>
          <div>
            <p className="font-bold mb-1">(619) 439-2110</p>
            <p className="text-gray-400 text-xs">La Mesa, CA</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-xs">
          © 2026 Linda Karp Insurance
        </div>
      </footer>
    </div>
  )
}
