'use client'
import { useState } from 'react'

export default function Home() {
  const [activeMain, setActiveMain] = useState('home')
  const [activeMedicare, setActiveMedicare] = useState('coverage')
  const [activeIndividual, setActiveIndividual] = useState('overview')
  const [activeGroup, setActiveGroup] = useState('overview')
  const [showQuiz, setShowQuiz] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResults, setQuizResults] = useState(null)
  const [expandedFaq, setExpandedFaq] = useState(null)

  const handleQuizAnswer = (question, answer) => {
    setQuizAnswers(prev => ({...prev, [question]: answer}))
  }

  const generatePDF = () => {
    const content = `Assessment Report - ${new Date().toLocaleDateString()}\n\n${quizResults.details}\n\n${quizResults.recommendations.map((r, i) => `${r}\n${quizResults.estimatedCosts[i]}`).join('\n\n')}\n\nContact: (XXX) XXX-XXXX`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', 'assessment-report.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const incomeRanges = {
    'under25': { label: 'Under $25,000', value: 20000 },
    '25to50': { label: '$25,000 - $50,000', value: 37500 },
    '50to75': { label: '$50,000 - $75,000', value: 62500 },
    '75to100': { label: '$75,000 - $100,000', value: 87500 },
    '100to150': { label: '$100,000 - $150,000', value: 125000 },
    '150plus': { label: '$150,000+', value: 175000 }
  }

  const calculateMedicareResults = () => {
    const age = parseInt(quizAnswers.age) || 0
    let recommendations = []
    let estimatedCosts = []

    if (age >= 65) {
      if (quizAnswers.conditions === 'yes' || parseInt(quizAnswers.medications) >= 3) {
        recommendations.push('Medicare Advantage (Part C) - Covers prescriptions, often $0 premium')
        estimatedCosts.push('$0-150/month + copays')
      } else {
        recommendations.push('Medicare Supplement Plan G - Most comprehensive gap coverage')
        estimatedCosts.push('$140-300/month')
      }
      
      if (parseInt(quizAnswers.medications) > 0) {
        recommendations.push('Part D Prescription Drug Coverage')
        estimatedCosts.push('$30-100/month')
      }
    }

    setQuizResults({
      recommendations,
      estimatedCosts,
      details: `Age: ${age} | Income: ${quizAnswers.income ? incomeRanges[quizAnswers.income].label : 'Not specified'} | Conditions: ${quizAnswers.conditions === 'yes' ? 'Yes' : 'No'} | Medications: ${quizAnswers.medications || 0}`
    })
  }

  const calculateIndividualResults = () => {
    const income = incomeRanges[quizAnswers.ind_income]?.value || 0
    const householdSize = parseInt(quizAnswers.ind_household) || 1
    const fpl = householdSize * 14580
    const incomePercent = (income / fpl) * 100

    let options = []
    if (incomePercent <= 150) {
      options.push('Strong subsidy eligibility - likely $400-600/month help')
    } else if (incomePercent <= 200) {
      options.push('Substantial subsidies - likely $200-400/month')
    } else if (incomePercent <= 400) {
      options.push('Moderate subsidies - likely $50-200/month')
    } else {
      options.push('Limited subsidies - full price likely $300-700/month')
    }

    setQuizResults({
      recommendations: options,
      estimatedCosts: ['Review plans at CoveredCA.com'],
      details: `Income: ${quizAnswers.ind_income ? incomeRanges[quizAnswers.ind_income].label : 'Not specified'} | Household: ${householdSize}`
    })
  }

  const calculateGroupResults = () => {
    const employees = parseInt(quizAnswers.group_employees) || 0
    const budget = parseInt(quizAnswers.group_budget) || 0
    const credit = Math.min((employees * 7980 * 0.5) / 12, employees * budget)

    setQuizResults({
      recommendations: [`Est. monthly tax credit: $${Math.round(credit)}`],
      estimatedCosts: [`Your cost: $${Math.round(budget * employees - credit)}/month`],
      details: `Employees: ${employees} | Budget: $${budget}/employee`
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
          <button onClick={() => setActiveMain('home')} className="text-lg font-light text-[#003366]">Linda Karp</button>
          <div className="flex gap-6 items-center">
            <button onClick={() => setActiveMain('medicare')} className="text-sm text-gray-600 hover:text-gray-900 font-light">Medicare</button>
            <button onClick={() => setActiveMain('individual')} className="text-sm text-gray-600 hover:text-gray-900 font-light">Individual</button>
            <button onClick={() => setActiveMain('group')} className="text-sm text-gray-600 hover:text-gray-900 font-light">Group</button>
            <button className="text-sm px-4 py-1.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 font-light">Contact</button>
          </div>
        </div>
      </header>

      {activeMain === 'home' && (
        <div>
          {/* Hero */}
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-4xl font-light text-gray-900 mb-6 leading-relaxed">Health insurance that makes sense</h1>
                  <p className="text-gray-600 font-light mb-8 leading-relaxed">I help Californians find coverage they trust. No jargon. No pressure. Just honest guidance.</p>
                  <div className="flex gap-4">
                    <button onClick={() => setActiveMain('medicare')} className="text-sm px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-light">Medicare</button>
                    <button onClick={() => setActiveMain('individual')} className="text-sm px-6 py-2 bg-[#003366] text-white rounded hover:bg-[#002240] font-light">Individual</button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-100 to-blue-100 rounded-lg h-72 flex items-center justify-center text-5xl opacity-40">
                  ❤️
                </div>
              </div>
            </div>
          </section>

          {/* Three simple options */}
          <section className="py-16 px-6 bg-gray-50 border-y border-gray-200">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <button onClick={() => setActiveMain('medicare')} className="bg-white p-6 rounded border border-gray-200 hover:border-gray-400 transition text-left">
                  <div className="text-3xl mb-4 opacity-50">🏥</div>
                  <h3 className="text-base font-light text-gray-900 mb-2">Medicare</h3>
                  <p className="text-xs text-gray-600 font-light">Turning 65 or already there.</p>
                </button>

                <button onClick={() => setActiveMain('individual')} className="bg-white p-6 rounded border border-gray-200 hover:border-gray-400 transition text-left">
                  <div className="text-3xl mb-4 opacity-50">👨‍👩‍👧</div>
                  <h3 className="text-base font-light text-gray-900 mb-2">Individual & Family</h3>
                  <p className="text-xs text-gray-600 font-light">No employer coverage.</p>
                </button>

                <button onClick={() => setActiveMain('group')} className="bg-white p-6 rounded border border-gray-200 hover:border-gray-400 transition text-left">
                  <div className="text-3xl mb-4 opacity-50">🏢</div>
                  <h3 className="text-base font-light text-gray-900 mb-2">Group Business</h3>
                  <p className="text-xs text-gray-600 font-light">For your team.</p>
                </button>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-light text-gray-900 mb-4">Ready to explore your options?</h2>
              <button className="px-8 py-2 bg-[#003366] text-white rounded hover:bg-[#002240] font-light text-sm">Schedule a conversation</button>
            </div>
          </section>
        </div>
      )}

      {activeMain === 'medicare' && (
        <div>
          {/* Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-5xl mx-auto px-6 flex gap-8 py-3">
              {[
                {key: 'coverage', label: 'Coverage Options'},
                {key: 'costs', label: '2026 Costs'},
                {key: 'enrollment', label: 'When to Enroll'}
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveMedicare(tab.key)}
                  className={`text-sm font-light pb-2 border-b-2 transition ${
                    activeMedicare === tab.key 
                      ? 'border-[#003366] text-[#003366]' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <section className="py-16 px-6">
            <div className="max-w-3xl mx-auto">
              {activeMedicare === 'coverage' && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-light text-gray-900 mb-8">Your Options</h2>
                    
                    <div className="space-y-8">
                      <div className="border border-gray-200 rounded-lg p-8">
                        <div className="flex gap-6 items-start">
                          <div className="text-4xl opacity-40 flex-shrink-0">🏥</div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-light text-gray-900 mb-3">Original Medicare</h3>
                            <p className="text-sm text-gray-600 font-light mb-4">Government coverage for hospital (Part A) and doctor visits (Part B).</p>
                            <p className="text-xs text-gray-500 font-light">• You pick any doctor • Covers 80% of costs • No prescriptions included</p>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-8">
                        <div className="flex gap-6 items-start">
                          <div className="text-4xl opacity-40 flex-shrink-0">💊</div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-light text-gray-900 mb-3">Medicare Supplement (Medigap)</h3>
                            <p className="text-sm text-gray-600 font-light mb-4">Private insurance that covers what Original Medicare doesn't.</p>
                            <p className="text-xs text-gray-500 font-light">• Covers deductibles & copays • Keep any Medicare doctor • Plans A-N available</p>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-8">
                        <div className="flex gap-6 items-start">
                          <div className="text-4xl opacity-40 flex-shrink-0">🎯</div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-light text-gray-900 mb-3">Medicare Advantage (Part C)</h3>
                            <p className="text-sm text-gray-600 font-light mb-4">All-in-one coverage with prescriptions included.</p>
                            <p className="text-xs text-gray-500 font-light">• Often $0 premium • Prescriptions included • Extra benefits (dental, vision) • Network doctors</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeMedicare === 'costs' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">2026 Costs</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <p className="text-sm text-gray-600 font-light">Part A Deductible (per stay)</p>
                      <p className="text-lg font-light text-gray-900">$1,780</p>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <p className="text-sm text-gray-600 font-light">Part B Deductible (per year)</p>
                      <p className="text-lg font-light text-gray-900">$280</p>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <p className="text-sm text-gray-600 font-light">Medigap Plan G (monthly)</p>
                      <p className="text-lg font-light text-gray-900">$140-300</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 font-light">Part D Prescription (monthly)</p>
                      <p className="text-lg font-light text-gray-900">$30-100</p>
                    </div>
                  </div>
                  <div className="mt-8 p-6 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-sm text-gray-700 font-light"><strong>Penalties matter:</strong> Miss your enrollment window and you'll pay permanently higher premiums. Act during your 7-month Initial Enrollment Period (3 months before, during, 3 months after turning 65).</p>
                  </div>
                </div>
              )}

              {activeMedicare === 'enrollment' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">When to Enroll</h2>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-6 py-4">
                      <p className="font-light text-gray-900 text-base mb-2">Initial Enrollment Period</p>
                      <p className="text-sm text-gray-600 font-light">7 months: 3 months before, during, 3 months after your 65th birthday</p>
                      <p className="text-xs text-gray-500 font-light mt-2">Your critical window. Act here to avoid penalties.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-6 py-4">
                      <p className="font-light text-gray-900 text-base mb-2">Annual Enrollment</p>
                      <p className="text-sm text-gray-600 font-light">October 15 - December 7 each year</p>
                      <p className="text-xs text-gray-500 font-light mt-2">Switch plans once yearly.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12">
                <button 
                  onClick={() => setShowQuiz('medicare')}
                  className="w-full px-8 py-3 bg-[#003366] text-white rounded hover:bg-[#002240] font-light text-sm"
                >
                  Get personalized recommendations
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeMain === 'individual' && (
        <div>
          {/* Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-5xl mx-auto px-6 flex gap-8 py-3">
              {['overview', 'subsidies', 'plans'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveIndividual(tab)}
                  className={`text-sm font-light pb-2 border-b-2 transition ${
                    activeIndividual === tab 
                      ? 'border-[#003366] text-[#003366]' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'subsidies' && 'Tax Credits'}
                  {tab === 'plans' && 'Plan Types'}
                </button>
              ))}
            </div>
          </div>

          <section className="py-16 px-6">
            <div className="max-w-3xl mx-auto">
              {activeIndividual === 'overview' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Individual & Family Plans</h2>
                  <p className="text-gray-600 font-light mb-8 leading-relaxed">Coverage through California's CoveredCA marketplace. The government helps many people afford it through tax credits based on income.</p>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <div className="text-xl opacity-40 flex-shrink-0">✓</div>
                      <div>
                        <p className="font-light text-gray-900 text-sm mb-1">No exclusions for pre-existing conditions</p>
                        <p className="text-xs text-gray-600 font-light">You'll always be covered.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="text-xl opacity-40 flex-shrink-0">✓</div>
                      <div>
                        <p className="font-light text-gray-900 text-sm mb-1">Potential tax credits</p>
                        <p className="text-xs text-gray-600 font-light">Many people qualify for help with premiums.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="text-xl opacity-40 flex-shrink-0">✓</div>
                      <div>
                        <p className="font-light text-gray-900 text-sm mb-1">Life event flexibility</p>
                        <p className="text-xs text-gray-600 font-light">Lost coverage? Moving? Had a baby? You can enroll outside open enrollment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeIndividual === 'subsidies' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Tax Credits & Subsidies</h2>
                  <p className="text-gray-600 font-light mb-8">The government helps lower premiums based on your household income. The thresholds change yearly.</p>
                  
                  <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
                    <p className="text-sm text-gray-600 font-light mb-6">2026 Income thresholds for maximum help:</p>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-light">Individual</span>
                        <span className="font-light text-gray-900">$37,000</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-gray-300 pt-4">
                        <span className="text-gray-600 font-light">Family of 4</span>
                        <span className="font-light text-gray-900">$76,000</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-amber-50 border border-amber-200 rounded">
                    <p className="text-sm font-light text-gray-700">Report income changes within 30 days. Mismatches can mean repaying subsidies at tax time.</p>
                  </div>
                </div>
              )}

              {activeIndividual === 'plans' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Plan Types</h2>
                  <p className="text-gray-600 font-light mb-8">Four metal levels based on how much the plan covers.</p>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded p-6">
                      <p className="font-light text-gray-900 text-base mb-2">Bronze (60% covered)</p>
                      <p className="text-xs text-gray-600 font-light">Lowest premium, highest deductible. For healthy people.</p>
                    </div>
                    <div className="border border-gray-200 rounded p-6">
                      <p className="font-light text-gray-900 text-base mb-2">Silver (70% covered)</p>
                      <p className="text-xs text-gray-600 font-light">Balanced. Best if you get subsidies.</p>
                    </div>
                    <div className="border border-gray-200 rounded p-6">
                      <p className="font-light text-gray-900 text-base mb-2">Gold (80% covered)</p>
                      <p className="text-xs text-gray-600 font-light">Higher premium, lower deductible. Regular doctor visits.</p>
                    </div>
                    <div className="border border-gray-200 rounded p-6">
                      <p className="font-light text-gray-900 text-base mb-2">Platinum (90% covered)</p>
                      <p className="text-xs text-gray-600 font-light">Highest premium, lowest deductible. Maximum coverage.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12">
                <button 
                  onClick={() => setShowQuiz('individual')}
                  className="w-full px-8 py-3 bg-[#003366] text-white rounded hover:bg-[#002240] font-light text-sm"
                >
                  Check your subsidy eligibility
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeMain === 'group' && (
        <div>
          {/* Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-5xl mx-auto px-6 flex gap-8 py-3">
              {['overview', 'shop', 'costs'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveGroup(tab)}
                  className={`text-sm font-light pb-2 border-b-2 transition ${
                    activeGroup === tab 
                      ? 'border-[#003366] text-[#003366]' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'shop' && 'SHOP Marketplace'}
                  {tab === 'costs' && 'Costs'}
                </button>
              ))}
            </div>
          </div>

          <section className="py-16 px-6">
            <div className="max-w-3xl mx-auto">
              {activeGroup === 'overview' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Group Coverage</h2>
                  <p className="text-gray-600 font-light mb-8">Coverage for your team shows you value them. It's also tax-deductible and often more affordable than you'd think.</p>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <div className="text-xl opacity-40 flex-shrink-0">✓</div>
                      <p className="text-sm text-gray-600 font-light">Attracts and keeps good talent</p>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="text-xl opacity-40 flex-shrink-0">✓</div>
                      <p className="text-sm text-gray-600 font-light">Tax-deductible business expense</p>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="text-xl opacity-40 flex-shrink-0">✓</div>
                      <p className="text-sm text-gray-600 font-light">Potential government tax credits up to 50%</p>
                    </div>
                  </div>
                </div>
              )}

              {activeGroup === 'shop' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">SHOP Marketplace</h2>
                  <p className="text-gray-600 font-light mb-8">If you have 2-50 employees, you can access special tax credits and guaranteed coverage.</p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-6 py-4">
                      <p className="font-light text-gray-900 text-base mb-2">Tax Credits</p>
                      <p className="text-sm text-gray-600 font-light">Up to 50% of premiums (or 35% for non-profits)</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-6 py-4">
                      <p className="font-light text-gray-900 text-base mb-2">Guaranteed Coverage</p>
                      <p className="text-sm text-gray-600 font-light">All qualified businesses approved, no health underwriting</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-6 py-4">
                      <p className="font-light text-gray-900 text-base mb-2">Employee Choice</p>
                      <p className="text-sm text-gray-600 font-light">Employees pick their own plan within your contribution level</p>
                    </div>
                  </div>
                </div>
              )}

              {activeGroup === 'costs' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Typical Costs</h2>
                  <p className="text-gray-600 font-light mb-8">Per employee per month:</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between border-b border-gray-200 pb-4">
                      <p className="text-sm text-gray-600 font-light">Bronze</p>
                      <p className="font-light text-gray-900">$350-450</p>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-4">
                      <p className="text-sm text-gray-600 font-light">Silver</p>
                      <p className="font-light text-gray-900">$450-600</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 font-light">Gold</p>
                      <p className="font-light text-gray-900">$600-800</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-6 border border-gray-200">
                    <p className="text-sm text-gray-700 font-light"><strong>Typical split:</strong> You cover 50-75%, employees pay the rest via payroll deduction.</p>
                  </div>
                </div>
              )}

              <div className="mt-12">
                <button 
                  onClick={() => setShowQuiz('group')}
                  className="w-full px-8 py-3 bg-[#003366] text-white rounded hover:bg-[#002240] font-light text-sm"
                >
                  Calculate your tax credits
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-light text-gray-900">Quick Assessment</h3>
              <button onClick={() => { setShowQuiz(null); setQuizResults(null); }} className="text-2xl text-gray-400">×</button>
            </div>

            {!quizResults ? (
              <div className="space-y-5">
                {showQuiz === 'medicare' && (
                  <>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Age?</label>
                      <input type="number" placeholder="65" onChange={(e) => handleQuizAnswer('age', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#003366]/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Household income?</label>
                      <select onChange={(e) => handleQuizAnswer('income', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#003366]/20">
                        <option value="">Select...</option>
                        <option value="under25">Under $25,000</option>
                        <option value="25to50">$25k-$50k</option>
                        <option value="50to75">$50k-$75k</option>
                        <option value="75to100">$75k-$100k</option>
                        <option value="100to150">$100k-$150k</option>
                        <option value="150plus">$150k+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Chronic conditions?</label>
                      <div className="flex gap-3">
                        <button onClick={() => handleQuizAnswer('conditions', 'yes')} className={`px-4 py-2 rounded text-sm font-light ${quizAnswers.conditions === 'yes' ? 'bg-[#003366] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('conditions', 'no')} className={`px-4 py-2 rounded text-sm font-light ${quizAnswers.conditions === 'no' ? 'bg-[#003366] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>No</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Regular medications?</label>
                      <select onChange={(e) => handleQuizAnswer('medications', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#003366]/20">
                        <option value="">Select...</option>
                        <option value="0">None</option>
                        <option value="1">1-2</option>
                        <option value="3">3-5</option>
                        <option value="6">6+</option>
                      </select>
                    </div>
                    <button onClick={calculateMedicareResults} className="w-full px-6 py-2 bg-[#003366] text-white rounded hover:bg-[#002240] font-light text-sm">Get Recommendations</button>
                  </>
                )}

                {showQuiz === 'individual' && (
                  <>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Household income?</label>
                      <select onChange={(e) => handleQuizAnswer('ind_income', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#003366]/20">
                        <option value="">Select...</option>
                        <option value="under25">Under $25,000</option>
                        <option value="25to50">$25k-$50k</option>
                        <option value="50to75">$50k-$75k</option>
                        <option value="75to100">$75k-$100k</option>
                        <option value="100to150">$100k-$150k</option>
                        <option value="150plus">$150k+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Household size?</label>
                      <select onChange={(e) => handleQuizAnswer('ind_household', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#003366]/20">
                        <option value="">Select...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5+</option>
                      </select>
                    </div>
                    <button onClick={calculateIndividualResults} className="w-full px-6 py-2 bg-[#003366] text-white rounded hover:bg-[#002240] font-light text-sm">See Eligibility</button>
                  </>
                )}

                {showQuiz === 'group' && (
                  <>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Number of employees?</label>
                      <input type="number" placeholder="25" onChange={(e) => handleQuizAnswer('group_employees', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#003366]/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Budget per employee/month? $</label>
                      <input type="number" placeholder="350" onChange={(e) => handleQuizAnswer('group_budget', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#003366]/20" />
                    </div>
                    <button onClick={calculateGroupResults} className="w-full px-6 py-2 bg-[#003366] text-white rounded hover:bg-[#002240] font-light text-sm">Calculate Credits</button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded text-xs text-gray-600 font-light">{quizResults.details}</div>
                {quizResults.recommendations.map((r, i) => (
                  <div key={i} className="bg-blue-50 p-4 rounded">
                    <p className="text-sm font-light text-gray-900">{r}</p>
                    <p className="text-xs text-gray-600 font-light mt-1">{quizResults.estimatedCosts[i]}</p>
                  </div>
                ))}
                <div className="flex gap-3 pt-4">
                  <button onClick={generatePDF} className="flex-1 px-4 py-2 bg-[#003366] text-white rounded font-light text-xs">Download</button>
                  <button onClick={() => setQuizResults(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded font-light text-xs">Start Over</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6 mt-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-light text-gray-900 text-sm mb-3">Linda Karp Insurance</h4>
              <p className="text-xs text-gray-600 font-light">28+ years helping Californians.</p>
            </div>
            <div>
              <h4 className="font-light text-gray-900 text-sm mb-3">Services</h4>
              <ul className="text-xs space-y-2 text-gray-600 font-light">
                <li><button onClick={() => setActiveMain('medicare')} className="hover:text-gray-900">Medicare</button></li>
                <li><button onClick={() => setActiveMain('individual')} className="hover:text-gray-900">Individual</button></li>
                <li><button onClick={() => setActiveMain('group')} className="hover:text-gray-900">Group</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-light text-gray-900 text-sm mb-3">Contact</h4>
              <p className="text-xs text-gray-600 font-light">(XXX) XXX-XXXX</p>
              <p className="text-xs text-gray-600 font-light">info@lindakarp.com</p>
            </div>
            <div>
              <button className="text-xs px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-white font-light">Schedule call</button>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-xs text-gray-500 font-light">&copy; 2024 Linda Karp Insurance</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
