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
    const employed = quizAnswers.employed === 'yes'
    const conditions = quizAnswers.conditions === 'yes'
    const medications = parseInt(quizAnswers.medications) || 0

    let recommendations = []
    let estimatedCosts = []

    if (age >= 65) {
      if (conditions || medications >= 3) {
        recommendations.push('Medicare Advantage (Part C) - Covers prescriptions, often $0 premium')
        estimatedCosts.push('$0-150/month + copays')
      } else {
        recommendations.push('Medicare Supplement Plan G - Most comprehensive gap coverage')
        estimatedCosts.push('$140-300/month')
      }
      
      if (medications > 0) {
        recommendations.push('Part D Prescription Drug - Match to your specific medications')
        estimatedCosts.push('$30-100/month')
      }

      recommendations.push('Review Enrollment Deadlines - Avoid lifetime penalties')
      estimatedCosts.push('Critical: Act within 7 months of 65th birthday')
    }

    setQuizResults({
      recommendations,
      estimatedCosts,
      details: `Age: ${age} | Employment: ${employed ? 'Working' : 'Retired'} | Chronic Conditions: ${conditions ? 'Yes' : 'No'} | # of Medications: ${medications}`
    })
  }

  const calculateIndividualResults = () => {
    const income = incomeRanges[quizAnswers.ind_income]?.value || 0
    const householdSize = parseInt(quizAnswers.ind_household) || 1

    let options = []
    const fpl = householdSize * 14580
    const incomePercent = (income / fpl) * 100

    if (incomePercent <= 150) {
      options.push('MAXIMUM subsidy eligibility - Likely covers most or all premium')
      options.push('Estimated help: $400-600/month')
    } else if (incomePercent <= 200) {
      options.push('Substantial subsidies available')
      options.push('Estimated help: $200-400/month')
    } else if (incomePercent <= 400) {
      options.push('Moderate subsidies may apply')
      options.push('Estimated help: $50-200/month')
    } else {
      options.push('Limited/no subsidies available')
      options.push('Full price: $300-700/month')
    }

    setQuizResults({
      recommendations: options,
      estimatedCosts: ['Visit CoveredCA.com to apply'],
      details: `Annual Income: ${quizAnswers.ind_income ? incomeRanges[quizAnswers.ind_income].label : 'Not specified'} | Household Size: ${householdSize}`
    })
  }

  const calculateGroupResults = () => {
    const employees = parseInt(quizAnswers.group_employees) || 0
    const budget = parseInt(quizAnswers.group_budget) || 0

    let options = []
    let taxCredit = 0

    if (employees >= 2 && employees <= 50) {
      const credit = Math.min((employees * 7980 * 0.5) / 12, employees * budget)
      taxCredit = credit
      options.push(`SHOP Marketplace Eligible - Est. Monthly Tax Credit: $${Math.round(credit)}`)
      options.push(`Your Employer Contribution: $${Math.round(budget * employees - credit)}/month`)
    }

    options.push(`Total Employee Cost Share: $${Math.round(budget * 0.3 * employees)}/month (approx 30%)`)

    setQuizResults({
      recommendations: options,
      estimatedCosts: [`Tax Credit: $${Math.round(taxCredit)}/month`, `Total Premium Range: $${Math.round(budget * employees)}-${Math.round(budget * employees * 1.2)}/month`],
      details: `Employees: ${employees} | Budget/Employee/Month: $${budget}`
    })
  }

  const Logo = () => (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 flex items-center justify-center">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
          <circle cx="35" cy="35" r="22" fill="none" stroke="#8db3d8" strokeWidth="3"/>
          <circle cx="65" cy="35" r="22" fill="none" stroke="#5b8fc7" strokeWidth="3"/>
          <circle cx="50" cy="58" r="22" fill="none" stroke="#4a6fa5" strokeWidth="3"/>
        </svg>
      </div>
      <div className="text-left">
        <p className="font-bold text-lg text-gray-900">Linda Karp</p>
        <p className="text-xs text-gray-600 font-semibold">Insurance Services</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-300 sticky top-0 z-30 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-2 flex justify-between items-center">
          <button onClick={() => setActiveMain('home')} className="flex items-center">
            <Logo />
          </button>
          <nav className="flex gap-6 items-center text-xs">
            <button onClick={() => setActiveMain('medicare')} className="text-gray-700 hover:text-blue-600 font-medium">Medicare</button>
            <button onClick={() => setActiveMain('individual')} className="text-gray-700 hover:text-blue-600 font-medium">Individual</button>
            <button onClick={() => setActiveMain('group')} className="text-gray-700 hover:text-blue-600 font-medium">Group</button>
            <a href="tel:6194392110" className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700">(619) 439-2110</a>
          </nav>
        </div>
      </header>

      {activeMain === 'home' && (
        <div>
          {/* Warm Hero with Image */}
          <section className="bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="max-w-5xl mx-auto px-6 py-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Health insurance you can trust</h1>
                  <p className="text-gray-700 mb-6 leading-relaxed">28 years helping Californians navigate Medicare, individual, and group coverage. Honest guidance. No pressure.</p>
                  
                  <div className="flex gap-2 mb-6 flex-wrap">
                    <button onClick={() => setActiveMain('medicare')} className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded font-semibold hover:bg-blue-50">Medicare</button>
                    <button onClick={() => setActiveMain('individual')} className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded font-semibold hover:bg-blue-50">Individual</button>
                    <button onClick={() => setActiveMain('group')} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-50">Group</button>
                  </div>

                  <p className="text-sm text-gray-600">San Diego, CA • (619) 439-2110</p>
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop" alt="Health insurance consultation" className="w-full h-80 object-cover"/>
                </div>
              </div>
            </div>
          </section>

          {/* Three Categories with Images */}
          <section className="max-w-5xl mx-auto px-6 py-12">
            <p className="font-semibold text-gray-900 mb-6 text-lg">I can help with:</p>
            <div className="grid md:grid-cols-3 gap-6">
              <button onClick={() => setActiveMain('medicare')} className="text-left rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white border border-gray-200">
                <div className="h-40 overflow-hidden bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=300&fit=crop" alt="Medicare" className="w-full h-full object-cover"/>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-lg mb-2">Medicare</p>
                  <p className="text-sm text-gray-600">Turning 65? Navigate Medigap, Advantage, Part D.</p>
                </div>
              </button>
              <button onClick={() => setActiveMain('individual')} className="text-left rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white border border-gray-200">
                <div className="h-40 overflow-hidden bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=300&fit=crop" alt="Individual coverage" className="w-full h-full object-cover"/>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-lg mb-2">Individual</p>
                  <p className="text-sm text-gray-600">CoveredCA coverage with subsidy optimization.</p>
                </div>
              </button>
              <button onClick={() => setActiveMain('group')} className="text-left rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white border border-gray-200">
                <div className="h-40 overflow-hidden bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop" alt="Group benefits" className="w-full h-full object-cover"/>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-lg mb-2">Group</p>
                  <p className="text-sm text-gray-600">Offer coverage to your team. SHOP marketplace.</p>
                </div>
              </button>
            </div>
          </section>

          {/* Quick Facts */}
          <section className="bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="font-bold text-3xl text-blue-600 mb-1">28+</p>
                  <p className="text-sm text-gray-700">Years in insurance</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-3xl text-blue-600 mb-1">3</p>
                  <p className="text-sm text-gray-700">Service areas</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-3xl text-blue-600 mb-1">1000s</p>
                  <p className="text-sm text-gray-700">Satisfied clients</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeMain === 'medicare' && (
        <section className="max-w-4xl mx-auto px-6 py-8">
          <button onClick={() => setActiveMain('home')} className="mb-6 text-blue-600 hover:text-blue-700 text-sm font-semibold">← Back to Home</button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Medicare Planning & Guidance</h1>
            <p className="text-gray-700 text-lg mb-6">Turning 65? Let's find the right Medicare coverage for you. With 28 years of experience, I help clients understand all options and avoid costly mistakes.</p>
            <button onClick={() => setShowQuiz('medicare')} className="px-8 py-4 bg-blue-600 text-white rounded font-bold text-lg hover:bg-blue-700">Start Your Medicare Assessment</button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop" alt="Medicare planning" className="w-full h-80 object-cover"/>
            </div>
            
            <div className="space-y-4">
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

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-200">
                <div className="bg-blue-50 p-3 rounded text-center"><p className="text-xs text-gray-600">Part A</p><p className="font-bold text-gray-900">$1,780</p></div>
                <div className="bg-green-50 p-3 rounded text-center"><p className="text-xs text-gray-600">Part B</p><p className="font-bold text-gray-900">$280</p></div>
                <div className="bg-purple-50 p-3 rounded text-center"><p className="text-xs text-gray-600">Medigap G</p><p className="font-bold text-gray-900">$140-300</p></div>
                <div className="bg-amber-50 p-3 rounded text-center"><p className="text-xs text-gray-600">Part D</p><p className="font-bold text-gray-900">$30-100</p></div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-300 rounded p-4 text-sm text-gray-700 mb-8">
            <strong>⚠️ Critical Timing:</strong> Enroll within 7 months of turning 65 (3 months before, during, 3 months after). Late penalties are permanent and apply for life.
          </div>

          <div className="bg-blue-100 border border-blue-300 rounded-lg p-8 text-center">
            <p className="text-gray-900 font-semibold mb-4 text-lg">Ready to find your best Medicare plan?</p>
            <button onClick={() => setShowQuiz('medicare')} className="px-8 py-4 bg-blue-600 text-white rounded font-bold text-lg hover:bg-blue-700">Get Personalized Recommendations</button>
          </div>
        </section>
      )}

      {activeMain === 'individual' && (
        <section className="max-w-4xl mx-auto px-6 py-8">
          <button onClick={() => setActiveMain('home')} className="mb-6 text-blue-600 hover:text-blue-700 text-sm font-semibold">← Back to Home</button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Individual & Family Health Plans</h1>
            <p className="text-gray-700 text-lg mb-6">Coverage through CoveredCA with subsidy optimization. Many Californians qualify for government assistance to lower their monthly costs.</p>
            <button onClick={() => setShowQuiz('individual')} className="px-8 py-4 bg-blue-600 text-white rounded font-bold text-lg hover:bg-blue-700">Check Your Subsidy Eligibility</button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop" alt="Individual and family plans" className="w-full h-80 object-cover"/>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50 rounded p-4 border border-blue-200">
                <p className="font-semibold text-gray-900 text-sm mb-1">✓ No exclusions for pre-existing conditions</p>
                <p className="text-xs text-gray-600">Everyone accepted. Always covered.</p>
              </div>
              <div className="bg-green-50 rounded p-4 border border-green-200">
                <p className="font-semibold text-gray-900 text-sm mb-1">✓ Tax credits based on income</p>
                <p className="text-xs text-gray-600">Individual max: $37k | Family of 4: $76k for full subsidy eligibility</p>
              </div>
              <div className="bg-purple-50 rounded p-4 border border-purple-200">
                <p className="font-semibold text-gray-900 text-sm mb-1">✓ 4 plan types available</p>
                <p className="text-xs text-gray-600">Bronze (60%) to Platinum (90%). Pick your coverage level and monthly cost.</p>
              </div>
              <div className="bg-amber-50 rounded p-4 border border-amber-200">
                <p className="font-semibold text-gray-900 text-sm mb-1">✓ Annual open enrollment</p>
                <p className="text-xs text-gray-600">Sign up yearly or when you have qualifying life events.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 border border-blue-300 rounded-lg p-8 text-center">
            <p className="text-gray-900 font-semibold mb-4 text-lg">See how much you could save on monthly premiums.</p>
            <button onClick={() => setShowQuiz('individual')} className="px-8 py-4 bg-blue-600 text-white rounded font-bold text-lg hover:bg-blue-700">Get Your Subsidy Estimate</button>
          </div>
        </section>
      )}

      {activeMain === 'group' && (
        <section className="max-w-4xl mx-auto px-6 py-8">
          <button onClick={() => setActiveMain('home')} className="mb-6 text-blue-600 hover:text-blue-700 text-sm font-semibold">← Back to Home</button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Group Coverage for Your Business</h1>
            <p className="text-gray-700 text-lg mb-6">Offering health coverage attracts talent, is tax-deductible, and qualifies for significant government tax credits through the SHOP marketplace.</p>
            <button onClick={() => setShowQuiz('group')} className="px-8 py-4 bg-blue-600 text-white rounded font-bold text-lg hover:bg-blue-700">Calculate Your Tax Credits</button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop" alt="Group benefits" className="w-full h-80 object-cover"/>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50 rounded p-4 border border-blue-200">
                <p className="font-semibold text-gray-900 text-sm mb-1">✓ SHOP Marketplace Eligible</p>
                <p className="text-xs text-gray-600">2-50 employees. Up to 50% federal tax credit. Guaranteed coverage.</p>
              </div>
              <div className="bg-green-50 rounded p-4 border border-green-200">
                <p className="font-semibold text-gray-900 text-sm mb-1">✓ Predictable Costs</p>
                <p className="text-xs text-gray-600">$350-800/employee/month. You pay 50-75% (tax-deductible).</p>
              </div>
              <div className="bg-purple-50 rounded p-4 border border-purple-200">
                <p className="font-semibold text-gray-900 text-sm mb-1">✓ Employee Choice</p>
                <p className="text-xs text-gray-600">Employees pick their own plan within your contribution level.</p>
              </div>
              <div className="bg-amber-50 rounded p-4 border border-amber-200">
                <p className="font-semibold text-gray-900 text-sm mb-1">✓ Talent Retention</p>
                <p className="text-xs text-gray-600">Health benefits are a top reason employees stay long-term.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 border border-blue-300 rounded-lg p-8 text-center">
            <p className="text-gray-900 font-semibold mb-4 text-lg">See how much your business could save with federal tax credits.</p>
            <button onClick={() => setShowQuiz('group')} className="px-8 py-4 bg-blue-600 text-white rounded font-bold text-lg hover:bg-blue-700">Calculate Your Tax Credit Estimate</button>
          </div>
        </section>
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {showQuiz === 'medicare' && 'Medicare Assessment'}
                {showQuiz === 'individual' && 'Individual Plan Assessment'}
                {showQuiz === 'group' && 'Group Plan Assessment'}
              </h3>
              <button onClick={() => { setShowQuiz(null); setQuizResults(null); }} className="text-2xl text-gray-400">×</button>
            </div>

            {!quizResults ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {showQuiz === 'medicare' && (
                  <>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-gray-700 mb-4">
                      <strong>📋 Your contact info helps us follow up with personalized recommendations</strong>
                    </div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                    <input type="text" placeholder="Your name" onChange={(e) => handleQuizAnswer('name', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <input type="email" placeholder="Your email" onChange={(e) => handleQuizAnswer('email', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                    <input type="tel" placeholder="(619) XXX-XXXX" onChange={(e) => handleQuizAnswer('phone', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Age?</label>
                    <input type="number" placeholder="65" onChange={(e) => handleQuizAnswer('age', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Currently employed?</label>
                    <div className="flex gap-3"><button onClick={() => handleQuizAnswer('employed', 'yes')} className={`px-4 py-2 rounded text-sm ${quizAnswers.employed === 'yes' ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>Yes</button>
                    <button onClick={() => handleQuizAnswer('employed', 'no')} className={`px-4 py-2 rounded text-sm ${quizAnswers.employed === 'no' ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>No</button></div></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Household income?</label>
                    <select onChange={(e) => handleQuizAnswer('income', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm">
                      <option value="">Select...</option>
                      <option value="under25">Under $25,000</option>
                      <option value="25to50">$25,000 - $50,000</option>
                      <option value="50to75">$50,000 - $75,000</option>
                      <option value="75to100">$75,000 - $100,000</option>
                      <option value="100to150">$100,000 - $150,000</option>
                      <option value="150plus">$150,000+</option>
                    </select></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Chronic health conditions?</label>
                    <div className="flex gap-3"><button onClick={() => handleQuizAnswer('conditions', 'yes')} className={`px-4 py-2 rounded text-sm ${quizAnswers.conditions === 'yes' ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>Yes</button>
                    <button onClick={() => handleQuizAnswer('conditions', 'no')} className={`px-4 py-2 rounded text-sm ${quizAnswers.conditions === 'no' ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>No</button></div></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Regular medications?</label>
                    <select onChange={(e) => handleQuizAnswer('medications', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm">
                      <option value="">Select...</option>
                      <option value="0">None</option>
                      <option value="1">1-2</option>
                      <option value="3">3-5</option>
                      <option value="6">6+</option>
                    </select></div>
                    <button onClick={calculateMedicareResults} className="w-full px-6 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 text-sm">Generate Report</button>
                  </>
                )}

                {showQuiz === 'individual' && (
                  <>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-gray-700 mb-4">
                      <strong>📋 Your contact info helps us follow up with personalized recommendations</strong>
                    </div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                    <input type="text" placeholder="Your name" onChange={(e) => handleQuizAnswer('name', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <input type="email" placeholder="Your email" onChange={(e) => handleQuizAnswer('email', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                    <input type="tel" placeholder="(619) XXX-XXXX" onChange={(e) => handleQuizAnswer('phone', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Household income?</label>
                    <select onChange={(e) => handleQuizAnswer('ind_income', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm">
                      <option value="">Select...</option>
                      <option value="under25">Under $25,000</option>
                      <option value="25to50">$25,000 - $50,000</option>
                      <option value="50to75">$50,000 - $75,000</option>
                      <option value="75to100">$75,000 - $100,000</option>
                      <option value="100to150">$100,000 - $150,000</option>
                      <option value="150plus">$150,000+</option>
                    </select></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Household size?</label>
                    <select onChange={(e) => handleQuizAnswer('ind_household', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm">
                      <option value="">Select...</option>
                      <option value="1">1 (just me)</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5+</option>
                    </select></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Currently employed?</label>
                    <div className="flex gap-3"><button onClick={() => handleQuizAnswer('ind_employed', 'yes')} className={`px-4 py-2 rounded text-sm ${quizAnswers.ind_employed === 'yes' ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>Yes</button>
                    <button onClick={() => handleQuizAnswer('ind_employed', 'no')} className={`px-4 py-2 rounded text-sm ${quizAnswers.ind_employed === 'no' ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>No</button></div></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Pre-existing conditions?</label>
                    <div className="flex gap-3"><button onClick={() => handleQuizAnswer('ind_preexisting', 'yes')} className={`px-4 py-2 rounded text-sm ${quizAnswers.ind_preexisting === 'yes' ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>Yes</button>
                    <button onClick={() => handleQuizAnswer('ind_preexisting', 'no')} className={`px-4 py-2 rounded text-sm ${quizAnswers.ind_preexisting === 'no' ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>No</button></div></div>
                    <button onClick={calculateIndividualResults} className="w-full px-6 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 text-sm">See Subsidy Eligibility</button>
                  </>
                )}

                {showQuiz === 'group' && (
                  <>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-gray-700 mb-4">
                      <strong>📋 Your contact info helps us follow up with personalized recommendations</strong>
                    </div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                    <input type="text" placeholder="Your name" onChange={(e) => handleQuizAnswer('name', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <input type="email" placeholder="Your email" onChange={(e) => handleQuizAnswer('email', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                    <input type="tel" placeholder="(619) XXX-XXXX" onChange={(e) => handleQuizAnswer('phone', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Company name</label>
                    <input type="text" placeholder="Your company" onChange={(e) => handleQuizAnswer('company', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Number of employees?</label>
                    <input type="number" placeholder="25" onChange={(e) => handleQuizAnswer('group_employees', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Average employee salary?</label>
                    <input type="number" placeholder="50000" onChange={(e) => handleQuizAnswer('group_salary', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-900 mb-2">Budget per employee/month?</label>
                    <input type="number" placeholder="350" onChange={(e) => handleQuizAnswer('group_budget', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" /></div>
                    <button onClick={calculateGroupResults} className="w-full px-6 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 text-sm">Calculate Tax Credits</button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded border border-gray-300">
                  <p className="text-sm font-semibold text-gray-900 mb-2">📞 Contact Info</p>
                  <p className="text-xs text-gray-700"><strong>Name:</strong> {quizAnswers.name || '(not provided)'}</p>
                  <p className="text-xs text-gray-700"><strong>Email:</strong> {quizAnswers.email || '(not provided)'}</p>
                  <p className="text-xs text-gray-700"><strong>Phone:</strong> {quizAnswers.phone || '(not provided)'}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded text-xs text-gray-700">{quizResults.details}</div>
                {quizResults.recommendations.map((r, i) => (
                  <div key={i} className="bg-blue-50 border border-blue-200 p-4 rounded">
                    <p className="font-semibold text-gray-900 text-sm">{r}</p>
                    <p className="text-xs text-gray-600 mt-1">{quizResults.estimatedCosts[i]}</p>
                  </div>
                ))}
                <div className="flex gap-2 pt-4">
                  <button onClick={generatePDF} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-bold text-sm">Download PDF</button>
                  <button onClick={() => setQuizResults(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm">Start Over</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 px-6 mt-12">
        <div className="max-w-5xl mx-auto text-center text-xs text-gray-400">
          <p className="mb-2">Linda Karp Insurance • San Diego, CA • (619) 439-2110 • info@lindakarp.com</p>
          <p>© 2026 Linda Karp Insurance Services</p>
        </div>
      </footer>
    </div>
  )
}
