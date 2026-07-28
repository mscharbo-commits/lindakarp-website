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

  const handleQuizAnswer = (question, answer) => {
    setQuizAnswers(prev => ({...prev, [question]: answer}))
  }

  const generatePDF = () => {
    const content = `Assessment Report - ${new Date().toLocaleDateString()}\n\n${quizResults.details}\n\n${quizResults.recommendations.map((r, i) => `${r}\n${quizResults.estimatedCosts[i]}`).join('\n\n')}`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', 'assessment.txt')
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
        recommendations.push('Medicare Advantage (Part C) - Prescriptions included, often $0 premium')
        estimatedCosts.push('$0-150/month')
      } else {
        recommendations.push('Medicare Supplement Plan G - Best gap coverage')
        estimatedCosts.push('$140-300/month')
      }
      
      if (parseInt(quizAnswers.medications) > 0) {
        recommendations.push('Part D Prescription Coverage')
        estimatedCosts.push('$30-100/month')
      }
    }

    setQuizResults({
      recommendations,
      estimatedCosts,
      details: `Age: ${age} | Income: ${quizAnswers.income ? incomeRanges[quizAnswers.income].label : 'Not specified'}`
    })
  }

  const calculateIndividualResults = () => {
    const income = incomeRanges[quizAnswers.ind_income]?.value || 0
    const householdSize = parseInt(quizAnswers.ind_household) || 1
    const fpl = householdSize * 14580
    const incomePercent = (income / fpl) * 100

    let options = []
    if (incomePercent <= 150) {
      options.push('Strong eligibility for help - likely $400-600/month')
    } else if (incomePercent <= 200) {
      options.push('Substantial subsidies available - likely $200-400/month')
    } else if (incomePercent <= 400) {
      options.push('Moderate help - likely $50-200/month')
    } else {
      options.push('Limited subsidies - full price likely $300-700/month')
    }

    setQuizResults({
      recommendations: options,
      estimatedCosts: ['Visit CoveredCA.com to apply'],
      details: `Income: ${quizAnswers.ind_income ? incomeRanges[quizAnswers.ind_income].label : 'Not specified'} | Household Size: ${householdSize}`
    })
  }

  const calculateGroupResults = () => {
    const employees = parseInt(quizAnswers.group_employees) || 0
    const budget = parseInt(quizAnswers.group_budget) || 0
    const credit = Math.min((employees * 7980 * 0.5) / 12, employees * budget)

    setQuizResults({
      recommendations: [`Estimated tax credit: $${Math.round(credit)}/month`],
      estimatedCosts: [`Your cost: $${Math.round(budget * employees - credit)}/month`],
      details: `Employees: ${employees} | Budget: $${budget}/employee`
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <button onClick={() => setActiveMain('home')} className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-br from-[#003366] to-[#0066cc] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LK</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#003366]">Linda Karp</span>
              <span className="text-xs text-gray-500">Insurance</span>
            </div>
          </button>
          <nav className="flex gap-8 items-center">
            <button onClick={() => setActiveMain('medicare')} className="text-sm text-gray-700 hover:text-[#003366] font-medium transition">Medicare</button>
            <button onClick={() => setActiveMain('individual')} className="text-sm text-gray-700 hover:text-[#003366] font-medium transition">Individual</button>
            <button onClick={() => setActiveMain('group')} className="text-sm text-gray-700 hover:text-[#003366] font-medium transition">Group</button>
            <button className="text-sm px-5 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002240] font-medium transition">Contact</button>
          </nav>
        </div>
      </header>

      {activeMain === 'home' && (
        <div>
          {/* Hero */}
          <section className="relative bg-gradient-to-br from-[#f8fafc] via-white to-[#f0f4f8] py-20 px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">Health insurance you can trust</h1>
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">28 years helping Californians navigate Medicare, individual, and group coverage. Honest guidance. No pressure. Peace of mind.</p>
                  <div className="flex gap-4">
                    <button onClick={() => setActiveMain('medicare')} className="px-7 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002240] font-semibold transition">Explore Medicare</button>
                    <button onClick={() => setActiveMain('individual')} className="px-7 py-3 border-2 border-[#003366] text-[#003366] rounded-lg hover:bg-[#003366] hover:text-white font-semibold transition">Find Coverage</button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl h-96 flex items-center justify-center text-7xl opacity-60">
                  ❤️
                </div>
              </div>
            </div>
          </section>

          {/* Three Paths */}
          <section className="py-20 px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Choose Your Path</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <button onClick={() => setActiveMain('medicare')} className="group bg-white border-2 border-gray-200 hover:border-[#003366] rounded-xl p-8 transition transform hover:-translate-y-1">
                  <div className="text-5xl mb-6 opacity-50 group-hover:opacity-100 transition">🏥</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Medicare</h3>
                  <p className="text-gray-600 mb-6">Turning 65 or already enrolled. Navigate coverage options with confidence.</p>
                  <div className="text-[#003366] font-semibold text-sm">Learn more →</div>
                </button>

                <button onClick={() => setActiveMain('individual')} className="group bg-white border-2 border-gray-200 hover:border-[#003366] rounded-xl p-8 transition transform hover:-translate-y-1">
                  <div className="text-5xl mb-6 opacity-50 group-hover:opacity-100 transition">👨‍👩‍👧</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Individual & Family</h3>
                  <p className="text-gray-600 mb-6">No employer coverage? Find affordable options with subsidy help.</p>
                  <div className="text-[#003366] font-semibold text-sm">Learn more →</div>
                </button>

                <button onClick={() => setActiveMain('group')} className="group bg-white border-2 border-gray-200 hover:border-[#003366] rounded-xl p-8 transition transform hover:-translate-y-1">
                  <div className="text-5xl mb-6 opacity-50 group-hover:opacity-100 transition">🏢</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Group Business</h3>
                  <p className="text-gray-600 mb-6">Offer coverage to your team. Access tax credits and competitive rates.</p>
                  <div className="text-[#003366] font-semibold text-sm">Learn more →</div>
                </button>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 px-8 bg-[#003366] text-white">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to find your best option?</h2>
              <p className="text-blue-100 mb-8">Let's talk about what works for your situation.</p>
              <button className="px-8 py-3 bg-white text-[#003366] rounded-lg hover:bg-gray-100 font-bold transition">Schedule a call</button>
            </div>
          </section>
        </div>
      )}

      {activeMain === 'medicare' && (
        <div>
          <div className="bg-gradient-to-r from-[#f8fafc] to-white border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-6xl mx-auto px-8 flex gap-8 py-4">
              {['coverage', 'costs', 'enroll'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveMedicare(tab)}
                  className={`text-sm font-semibold pb-3 border-b-2 transition ${
                    activeMedicare === tab 
                      ? 'border-[#003366] text-[#003366]' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'coverage' && 'Coverage Options'}
                  {tab === 'costs' && '2026 Costs'}
                  {tab === 'enroll' && 'When to Enroll'}
                </button>
              ))}
            </div>
          </div>

          <section className="py-16 px-8">
            <div className="max-w-4xl mx-auto">
              {activeMedicare === 'coverage' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-12">Your Medicare Options</h2>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 bg-blue-50 p-8 rounded-lg">
                      <div className="flex gap-6 items-start">
                        <div className="text-4xl flex-shrink-0">🏥</div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Original Medicare (Part A & B)</h3>
                          <p className="text-gray-700 mb-3">Government coverage for hospital and doctor visits. You pick any doctor.</p>
                          <p className="text-sm text-gray-600">Coverage: 80% after deductible | No prescriptions included</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 bg-green-50 p-8 rounded-lg">
                      <div className="flex gap-6 items-start">
                        <div className="text-4xl flex-shrink-0">💊</div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Medicare Supplement (Medigap)</h3>
                          <p className="text-gray-700 mb-3">Fills the gaps in Original Medicare. Covers deductibles and copays.</p>
                          <p className="text-sm text-gray-600">Plans A-N available | Keep any Medicare doctor | No network restrictions</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-purple-500 bg-purple-50 p-8 rounded-lg">
                      <div className="flex gap-6 items-start">
                        <div className="text-4xl flex-shrink-0">🎯</div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Medicare Advantage (Part C)</h3>
                          <p className="text-gray-700 mb-3">All-in-one coverage with prescriptions included. Often $0 premium.</p>
                          <p className="text-sm text-gray-600">Prescriptions included | Extra benefits (dental, vision) | Network doctors</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeMedicare === 'costs' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-12">2026 Medicare Costs</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 font-semibold mb-2">PART A DEDUCTIBLE</p>
                      <p className="text-3xl font-bold text-blue-900">$1,780</p>
                      <p className="text-xs text-gray-600 mt-1">per hospital stay</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600 font-semibold mb-2">PART B DEDUCTIBLE</p>
                      <p className="text-3xl font-bold text-green-900">$280</p>
                      <p className="text-xs text-gray-600 mt-1">per year</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                      <p className="text-sm text-gray-600 font-semibold mb-2">MEDIGAP PLAN G</p>
                      <p className="text-3xl font-bold text-purple-900">$140-300</p>
                      <p className="text-xs text-gray-600 mt-1">per month</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg border border-amber-200">
                      <p className="text-sm text-gray-600 font-semibold mb-2">PART D PRESCRIPTIONS</p>
                      <p className="text-3xl font-bold text-amber-900">$30-100</p>
                      <p className="text-xs text-gray-600 mt-1">per month</p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-orange-50 border-l-4 border-orange-500 rounded">
                    <p className="font-bold text-gray-900 mb-2">⚠️ Important: Late Enrollment Penalties</p>
                    <p className="text-sm text-gray-700">Miss your enrollment window and penalties stay forever. Part B costs 10% more per year late. Part D costs 1% more per month late.</p>
                  </div>
                </div>
              )}

              {activeMedicare === 'enroll' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-12">When to Enroll</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                      <h3 className="font-bold text-gray-900 mb-2">Initial Enrollment Period (IEP)</h3>
                      <p className="text-gray-700 mb-2">7 months: 3 months before, during, and 3 months after turning 65</p>
                      <p className="text-sm text-gray-600"><strong>Critical:</strong> Your main chance to avoid penalties</p>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
                      <h3 className="font-bold text-gray-900 mb-2">Annual Enrollment Period (AEP)</h3>
                      <p className="text-gray-700 mb-2">October 15 - December 7 every year</p>
                      <p className="text-sm text-gray-600">Switch plans once yearly</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-16">
                <button 
                  onClick={() => setShowQuiz('medicare')}
                  className="w-full px-8 py-4 bg-[#003366] text-white rounded-lg hover:bg-[#002240] font-bold transition text-lg"
                >
                  Get Personalized Medicare Recommendations
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeMain === 'individual' && (
        <div>
          <div className="bg-gradient-to-r from-[#f8fafc] to-white border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-6xl mx-auto px-8 flex gap-8 py-4">
              {['overview', 'subsidies', 'plans'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveIndividual(tab)}
                  className={`text-sm font-semibold pb-3 border-b-2 transition ${
                    activeIndividual === tab 
                      ? 'border-[#003366] text-[#003366]' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'subsidies' && 'Subsidies'}
                  {tab === 'plans' && 'Plan Types'}
                </button>
              ))}
            </div>
          </div>

          <section className="py-16 px-8">
            <div className="max-w-4xl mx-auto">
              {activeIndividual === 'overview' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Individual & Family Coverage</h2>
                  <p className="text-lg text-gray-700 mb-8">Coverage through California's CoveredCA marketplace. The government helps many people afford it through tax credits based on income.</p>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <div className="text-2xl">✓</div>
                      <div>
                        <p className="font-bold text-gray-900 mb-1">No exclusions for pre-existing conditions</p>
                        <p className="text-sm text-gray-700">Everyone gets covered, always.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                      <div className="text-2xl">✓</div>
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Potential tax credits</p>
                        <p className="text-sm text-gray-700">Many qualify for help with premiums.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <div className="text-2xl">✓</div>
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Life event flexibility</p>
                        <p className="text-sm text-gray-700">Lost coverage? Enroll outside open enrollment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeIndividual === 'subsidies' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Tax Credits & Subsidies</h2>
                  <p className="text-lg text-gray-700 mb-8">The government helps lower premiums based on household income.</p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-200 mb-8">
                    <p className="font-bold text-gray-900 mb-6">2026 Income Thresholds for Maximum Help</p>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Individual</p>
                        <p className="text-2xl font-bold text-blue-900">$37,000</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Family of 2</p>
                        <p className="text-2xl font-bold text-blue-900">$50,000</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Family of 4</p>
                        <p className="text-2xl font-bold text-blue-900">$76,000</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-orange-50 border-l-4 border-orange-500 rounded">
                    <p className="font-bold text-gray-900 mb-2">Report changes within 30 days</p>
                    <p className="text-sm text-gray-700">Income changes can affect your subsidy. Discrepancies may mean repaying at tax time.</p>
                  </div>
                </div>
              )}

              {activeIndividual === 'plans' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">CoveredCA Plan Types</h2>
                  <p className="text-lg text-gray-700 mb-8">Four metal levels based on how much the plan covers.</p>
                  
                  <div className="space-y-4">
                    {[
                      {name: 'Bronze', coverage: '60%', desc: 'Lowest premium, highest deductible. For healthy people.'},
                      {name: 'Silver', coverage: '70%', desc: 'Balanced. Most popular, especially with subsidies.'},
                      {name: 'Gold', coverage: '80%', desc: 'Higher premium, lower deductible. Regular doctor visits.'},
                      {name: 'Platinum', coverage: '90%', desc: 'Highest premium, lowest deductible. Maximum coverage.'}
                    ].map((plan, i) => (
                      <div key={i} className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900">{plan.name} Plan</h3>
                          <span className="text-sm font-semibold text-gray-600">{plan.coverage} covered</span>
                        </div>
                        <p className="text-sm text-gray-700">{plan.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-16">
                <button 
                  onClick={() => setShowQuiz('individual')}
                  className="w-full px-8 py-4 bg-[#003366] text-white rounded-lg hover:bg-[#002240] font-bold transition text-lg"
                >
                  Check Your Subsidy Eligibility
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeMain === 'group' && (
        <div>
          <div className="bg-gradient-to-r from-[#f8fafc] to-white border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-6xl mx-auto px-8 flex gap-8 py-4">
              {['overview', 'shop', 'costs'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveGroup(tab)}
                  className={`text-sm font-semibold pb-3 border-b-2 transition ${
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

          <section className="py-16 px-8">
            <div className="max-w-4xl mx-auto">
              {activeGroup === 'overview' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Group Coverage for Your Business</h2>
                  <p className="text-lg text-gray-700 mb-8">Offering health coverage shows you value your team. It's also tax-deductible and can be more affordable than expected.</p>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                      <div className="text-2xl">✓</div>
                      <p className="text-gray-900 font-semibold">Attract and retain talent</p>
                    </div>
                    <div className="flex gap-4 items-start p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <div className="text-2xl">✓</div>
                      <p className="text-gray-900 font-semibold">Tax-deductible business expense</p>
                    </div>
                    <div className="flex gap-4 items-start p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <div className="text-2xl">✓</div>
                      <p className="text-gray-900 font-semibold">Access government tax credits (up to 50%)</p>
                    </div>
                  </div>
                </div>
              )}

              {activeGroup === 'shop' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">SHOP Marketplace</h2>
                  <p className="text-lg text-gray-700 mb-8">For businesses with 2-50 employees, SHOP offers special tax credits and guaranteed coverage.</p>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                      <h3 className="font-bold text-gray-900 mb-2">Tax Credits</h3>
                      <p className="text-gray-700">Up to 50% of premiums for for-profit businesses (35% for non-profits)</p>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
                      <h3 className="font-bold text-gray-900 mb-2">Guaranteed Coverage</h3>
                      <p className="text-gray-700">All qualified businesses approved. No health underwriting required.</p>
                    </div>
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
                      <h3 className="font-bold text-gray-900 mb-2">Employee Choice</h3>
                      <p className="text-gray-700">Employees select their own plan within your contribution level</p>
                    </div>
                  </div>
                </div>
              )}

              {activeGroup === 'costs' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Group Plan Costs</h2>
                  <p className="text-lg text-gray-700 mb-8">Monthly cost per employee:</p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 font-semibold mb-2">Bronze</p>
                      <p className="text-3xl font-bold text-blue-900">$350-450</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 font-semibold mb-2">Silver</p>
                      <p className="text-3xl font-bold text-gray-900">$450-600</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg border border-amber-200">
                      <p className="text-sm text-gray-600 font-semibold mb-2">Gold</p>
                      <p className="text-3xl font-bold text-amber-900">$600-800</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                    <p className="font-bold text-gray-900 mb-3">Typical cost split:</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>You cover: 50-75% (tax-deductible)</p>
                      <p>Employees pay: 25-50% (payroll deduction)</p>
                      <p>Admin fees: $10-30 per employee/month</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-16">
                <button 
                  onClick={() => setShowQuiz('group')}
                  className="w-full px-8 py-4 bg-[#003366] text-white rounded-lg hover:bg-[#002240] font-bold transition text-lg"
                >
                  Calculate Your Tax Credits
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
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Quick Assessment</h3>
              <button onClick={() => { setShowQuiz(null); setQuizResults(null); }} className="text-3xl text-gray-400 hover:text-gray-600 font-light">×</button>
            </div>

            {!quizResults ? (
              <div className="space-y-6">
                {showQuiz === 'medicare' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">What is your age?</label>
                      <input type="number" placeholder="65" onChange={(e) => handleQuizAnswer('age', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Household income?</label>
                      <select onChange={(e) => handleQuizAnswer('income', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#003366]">
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
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Chronic conditions?</label>
                      <div className="flex gap-3">
                        <button onClick={() => handleQuizAnswer('conditions', 'yes')} className={`px-6 py-2 rounded-lg font-semibold transition ${quizAnswers.conditions === 'yes' ? 'bg-[#003366] text-white' : 'border-2 border-gray-300 text-gray-900 hover:border-[#003366]'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('conditions', 'no')} className={`px-6 py-2 rounded-lg font-semibold transition ${quizAnswers.conditions === 'no' ? 'bg-[#003366] text-white' : 'border-2 border-gray-300 text-gray-900 hover:border-[#003366]'}`}>No</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Regular medications?</label>
                      <select onChange={(e) => handleQuizAnswer('medications', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#003366]">
                        <option value="">Select...</option>
                        <option value="0">None</option>
                        <option value="1">1-2</option>
                        <option value="3">3-5</option>
                        <option value="6">6+</option>
                      </select>
                    </div>
                    <button onClick={calculateMedicareResults} className="w-full px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002240] font-bold transition">Get Recommendations</button>
                  </>
                )}

                {showQuiz === 'individual' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Household income?</label>
                      <select onChange={(e) => handleQuizAnswer('ind_income', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#003366]">
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
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Household size?</label>
                      <select onChange={(e) => handleQuizAnswer('ind_household', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#003366]">
                        <option value="">Select...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5+</option>
                      </select>
                    </div>
                    <button onClick={calculateIndividualResults} className="w-full px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002240] font-bold transition">See Eligibility</button>
                  </>
                )}

                {showQuiz === 'group' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Number of employees?</label>
                      <input type="number" placeholder="25" onChange={(e) => handleQuizAnswer('group_employees', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Budget per employee/month? $</label>
                      <input type="number" placeholder="350" onChange={(e) => handleQuizAnswer('group_budget', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                    </div>
                    <button onClick={calculateGroupResults} className="w-full px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002240] font-bold transition">Calculate Credits</button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <p className="text-sm text-gray-700">{quizResults.details}</p>
                </div>
                {quizResults.recommendations.map((r, i) => (
                  <div key={i} className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                    <p className="font-semibold text-gray-900">{r}</p>
                    <p className="text-sm text-gray-700 mt-2">{quizResults.estimatedCosts[i]}</p>
                  </div>
                ))}
                <div className="flex gap-3 pt-4">
                  <button onClick={generatePDF} className="flex-1 px-6 py-2 bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002240] transition">Download</button>
                  <button onClick={() => setQuizResults(null)} className="flex-1 px-6 py-2 border-2 border-gray-300 text-gray-900 rounded-lg font-bold hover:bg-gray-50 transition">Start Over</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-8 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LK</span>
                </div>
                <span className="font-bold">Linda Karp</span>
              </div>
              <p className="text-sm text-gray-400">28+ years helping Californians navigate health insurance with honesty and care.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setActiveMain('medicare')} className="hover:text-white transition">Medicare</button></li>
                <li><button onClick={() => setActiveMain('individual')} className="hover:text-white transition">Individual</button></li>
                <li><button onClick={() => setActiveMain('group')} className="hover:text-white transition">Group</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-sm text-gray-400">(XXX) XXX-XXXX</p>
              <p className="text-sm text-gray-400">info@lindakarp.com</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Ready to talk?</h4>
              <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition text-sm">Schedule call</button>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">&copy; 2026 Linda Karp Insurance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
