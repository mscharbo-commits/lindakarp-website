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
    const content = `Assessment - ${new Date().toLocaleDateString()}\n${quizResults.details}\n${quizResults.recommendations.join('\n')}`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', 'assessment.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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
      {/* Compact Header */}
      <header className="border-b border-gray-200 sticky top-0 z-30 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
          <button onClick={() => setActiveMain('home')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full"></div>
            <span className="font-semibold text-sm text-gray-900">Linda Karp</span>
          </button>
          <nav className="flex gap-6 items-center text-xs">
            <button onClick={() => setActiveMain('medicare')} className="text-gray-700 hover:text-blue-600">Medicare</button>
            <button onClick={() => setActiveMain('individual')} className="text-gray-700 hover:text-blue-600">Individual</button>
            <button onClick={() => setActiveMain('group')} className="text-gray-700 hover:text-blue-600">Group</button>
            <a href="tel:6194392110" className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700">(619) 439-2110</a>
          </nav>
        </div>
      </header>

      {activeMain === 'home' && (
        <div>
          {/* Compact Hero - Info First */}
          <section className="max-w-5xl mx-auto px-6 py-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Health insurance simplified</h1>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">28 years helping Californians navigate Medicare, individual, and group coverage. Honest guidance. No pressure.</p>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm">
                  <p className="font-semibold text-gray-900 mb-2">Why choose Linda Karp?</p>
                  <ul className="space-y-1 text-gray-700 text-xs">
                    <li>✓ 28+ years in the field</li>
                    <li>✓ Honest, caring advice</li>
                    <li>✓ Covers all three areas (Medicare, Individual, Group)</li>
                    <li>✓ Help with subsidy optimization</li>
                  </ul>
                </div>

                <div className="flex gap-2 mb-6">
                  <button onClick={() => setShowQuiz('medicare')} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700">Medicare Assessment</button>
                  <button onClick={() => setShowQuiz('individual')} className="px-4 py-2 border border-blue-600 text-blue-600 rounded text-sm font-semibold hover:bg-blue-50">Check Subsidy</button>
                </div>

                <p className="text-xs text-gray-500">La Mesa, CA • (619) 439-2110 • info@lindakarp.com</p>
              </div>

              {/* Reviews / Social Proof */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900">What clients say:</p>
                
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                  <p className="text-xs font-semibold text-gray-900 mb-1">⭐⭐⭐⭐⭐ "Linda is a life saver"</p>
                  <p className="text-xs text-gray-700">"I was laid off and Linda helped me and a group of us get coverage. Intelligent, efficient, caring."</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <p className="text-xs font-semibold text-gray-900 mb-1">⭐⭐⭐⭐⭐ "Huge help"</p>
                  <p className="text-xs text-gray-700">"After years of picking insurance at work, shopping the exchange was overwhelming. Linda made it simple."</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-gray-900 mb-1">⭐⭐⭐⭐⭐ "Simply amazing"</p>
                  <p className="text-xs text-gray-700">"Honest, helpful, and genuinely cares about finding the right coverage for you."</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Facts */}
          <section className="max-w-5xl mx-auto px-6 py-8 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-bold text-2xl text-blue-600 mb-1">28+</p>
                <p className="text-sm text-gray-700">Years in insurance</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-bold text-2xl text-blue-600 mb-1">5.0★</p>
                <p className="text-sm text-gray-700">Client reviews</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-bold text-2xl text-blue-600 mb-1">3 Areas</p>
                <p className="text-sm text-gray-700">Medicare, Individual, Group</p>
              </div>
            </div>
          </section>

          {/* Three Simple Options */}
          <section className="max-w-5xl mx-auto px-6 py-8 border-t border-gray-200">
            <p className="font-semibold text-gray-900 mb-4">I can help with:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {title: 'Medicare', desc: 'Turning 65? Navigate Medigap, Advantage, Part D.', action: () => setActiveMain('medicare')},
                {title: 'Individual', desc: 'CoveredCA coverage with subsidy optimization.', action: () => setActiveMain('individual')},
                {title: 'Group', desc: 'Offer coverage to your team. SHOP marketplace.', action: () => setActiveMain('group')}
              ].map((item, i) => (
                <button key={i} onClick={item.action} className="text-left border border-gray-200 rounded p-4 hover:border-blue-600 hover:bg-blue-50 transition">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeMain === 'medicare' && (
        <section className="max-w-3xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Medicare Planning</h2>
          
          <div className="space-y-4 mb-6">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold text-gray-900 text-sm">Original Medicare (Part A & B)</p>
              <p className="text-xs text-gray-600">Government coverage. Part A: hospital. Part B: doctor. Covers 80% after deductible.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-semibold text-gray-900 text-sm">Medicare Supplement (Medigap) — Plan G</p>
              <p className="text-xs text-gray-600">Most popular. Covers deductibles & copays. $140-300/month. Keep any Medicare doctor.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <p className="font-semibold text-gray-900 text-sm">Medicare Advantage (Part C)</p>
              <p className="text-xs text-gray-600">All-in-one with prescriptions. Often $0 premium. Network doctors.</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-6 text-center">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-xs text-gray-600">Part A Ded.</p>
              <p className="font-bold text-gray-900">$1,780</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-xs text-gray-600">Part B Ded.</p>
              <p className="font-bold text-gray-900">$280</p>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <p className="text-xs text-gray-600">Medigap G</p>
              <p className="font-bold text-gray-900">$140-300</p>
            </div>
            <div className="bg-amber-50 p-3 rounded">
              <p className="text-xs text-gray-600">Part D Rx</p>
              <p className="font-bold text-gray-900">$30-100</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-300 rounded p-3 text-xs text-gray-700 mb-6">
            <strong>⚠️ Timing matters:</strong> Enroll within 7 months of turning 65 (3 before, during, 3 after). Late penalties are permanent.
          </div>

          <button onClick={() => setShowQuiz('medicare')} className="w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 text-sm">Get My Medicare Recommendation</button>
        </section>
      )}

      {activeMain === 'individual' && (
        <section className="max-w-3xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Individual & Family Plans</h2>
          
          <p className="text-sm text-gray-700 mb-6">Coverage through CoveredCA. Many people qualify for government subsidies based on income.</p>

          <div className="space-y-3 mb-6">
            <div className="bg-blue-50 rounded p-3">
              <p className="font-semibold text-gray-900 text-sm mb-1">No exclusions for pre-existing conditions</p>
              <p className="text-xs text-gray-600">Everyone accepted. Always covered.</p>
            </div>
            <div className="bg-green-50 rounded p-3">
              <p className="font-semibold text-gray-900 text-sm mb-1">Tax credits based on income</p>
              <p className="text-xs text-gray-600">Individual max: $37k | Family of 4: $76k for full subsidy</p>
            </div>
            <div className="bg-purple-50 rounded p-3">
              <p className="font-semibold text-gray-900 text-sm mb-1">4 plan types</p>
              <p className="text-xs text-gray-600">Bronze (60%) to Platinum (90%). Pick your coverage level.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded p-3 text-xs text-gray-700 mb-6">
            Report income changes within 30 days. Mismatches can mean repaying subsidies at tax time.
          </div>

          <button onClick={() => setShowQuiz('individual')} className="w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 text-sm">Check Your Subsidy Eligibility</button>
        </section>
      )}

      {activeMain === 'group' && (
        <section className="max-w-3xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Group Coverage for Businesses</h2>
          
          <p className="text-sm text-gray-700 mb-6">Offering health coverage attracts talent, is tax-deductible, and qualifies for government tax credits.</p>

          <div className="space-y-3 mb-6">
            <div className="bg-blue-50 rounded p-3">
              <p className="font-semibold text-gray-900 text-sm mb-1">SHOP Marketplace</p>
              <p className="text-xs text-gray-600">2-50 employees eligible. Up to 50% federal tax credit. Guaranteed coverage.</p>
            </div>
            <div className="bg-green-50 rounded p-3">
              <p className="font-semibold text-gray-900 text-sm mb-1">Costs</p>
              <p className="text-xs text-gray-600">$350-800/employee/month. You typically pay 50-75% (tax-deductible).</p>
            </div>
            <div className="bg-purple-50 rounded p-3">
              <p className="font-semibold text-gray-900 text-sm mb-1">Employee choice</p>
              <p className="text-xs text-gray-600">Employees pick their plan within your contribution level.</p>
            </div>
          </div>

          <button onClick={() => setShowQuiz('group')} className="w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 text-sm">Calculate Your Tax Credits</button>
        </section>
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Quick Assessment</h3>
              <button onClick={() => { setShowQuiz(null); setQuizResults(null); }} className="text-xl text-gray-400">×</button>
            </div>

            {!quizResults ? (
              <div className="space-y-3">
                {showQuiz === 'medicare' && (
                  <>
                    <input type="number" placeholder="Age" onChange={(e) => handleQuizAnswer('age', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
                    <select onChange={(e) => handleQuizAnswer('income', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                      <option value="">Income</option>
                      <option value="under25">Under $25k</option>
                      <option value="25to50">$25k-$50k</option>
                    </select>
                    <button onClick={calculateMedicareResults} className="w-full px-4 py-2 bg-blue-600 text-white rounded font-bold text-sm">Get Recommendation</button>
                  </>
                )}
                {showQuiz === 'individual' && (
                  <>
                    <select onChange={(e) => handleQuizAnswer('ind_household', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                      <option value="">Household Size</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                    <select onChange={(e) => handleQuizAnswer('ind_income', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                      <option value="">Income</option>
                      <option value="under25">Under $25k</option>
                      <option value="25to50">$25k-$50k</option>
                    </select>
                    <button onClick={calculateIndividualResults} className="w-full px-4 py-2 bg-blue-600 text-white rounded font-bold text-sm">Check Eligibility</button>
                  </>
                )}
                {showQuiz === 'group' && (
                  <>
                    <input type="number" placeholder="# Employees" onChange={(e) => handleQuizAnswer('group_employees', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
                    <button onClick={calculateGroupResults} className="w-full px-4 py-2 bg-blue-600 text-white rounded font-bold text-sm">Calculate</button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{quizResults.details}</p>
                {quizResults.recommendations.map((r, i) => (
                  <div key={i} className="text-xs text-gray-700 bg-blue-50 p-2 rounded">{r}</div>
                ))}
                <div className="flex gap-2 pt-2">
                  <button onClick={generatePDF} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-xs font-bold">Download</button>
                  <button onClick={() => setQuizResults(null)} className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs">Back</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 px-6 mt-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-sm mb-6">
            <div>
              <p className="font-bold">Linda Karp Insurance</p>
              <p className="text-gray-400 text-xs mt-1">28+ years of honest guidance</p>
            </div>
            <div>
              <p className="font-bold mb-2">Services</p>
              <p className="text-gray-400 text-xs">Medicare • Individual • Group</p>
            </div>
            <div>
              <p className="font-bold">(619) 439-2110</p>
              <p className="text-gray-400 text-xs mt-1">La Mesa, CA</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-xs">
            © 2026 Linda Karp Insurance Services
          </div>
        </div>
      </footer>
    </div>
  )
}
