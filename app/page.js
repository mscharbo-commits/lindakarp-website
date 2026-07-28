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
    const content = `
ASSESSMENT REPORT
Generated: ${new Date().toLocaleDateString()}

PROFILE:
${quizResults.details}

RECOMMENDATIONS:
${quizResults.recommendations.map((r, i) => `- ${r}\n  Estimated Cost: ${quizResults.estimatedCosts[i]}`).join('\n')}

NEXT STEPS:
Schedule a consultation with Linda Karp to implement these recommendations.
Phone: (XXX) XXX-XXXX
Email: info@lindakarp.com
    `

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
    const employed = quizAnswers.employed === 'yes'
    const income = incomeRanges[quizAnswers.income]?.value || 0
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
        estimatedCosts.push('$120-250/month')
      }
      
      if (medications > 0) {
        recommendations.push('Part D Prescription Drug - Match to your specific medications')
        estimatedCosts.push('$25-75/month')
      }

      recommendations.push('Review Enrollment Deadlines - Avoid lifetime penalties')
      estimatedCosts.push('Critical: Act within 7 months of 65th birthday')
    }

    setQuizResults({
      recommendations,
      estimatedCosts,
      eligible: age >= 65,
      details: `Age: ${age} | Employment: ${employed ? 'Working' : 'Retired'} | Income: ${quizAnswers.income ? incomeRanges[quizAnswers.income].label : 'Not specified'} | Chronic Conditions: ${conditions ? 'Yes' : 'No'} | # of Medications: ${medications}`
    })
  }

  const calculateIndividualResults = () => {
    const income = incomeRanges[quizAnswers.ind_income]?.value || 0
    const householdSize = parseInt(quizAnswers.ind_household) || 1
    const employed = quizAnswers.ind_employed === 'yes'

    let options = []
    let subsidyAmount = 0

    const fpl = householdSize * 14580
    const incomePercent = (income / fpl) * 100

    if (incomePercent <= 150) {
      options.push('Strong subsidy eligibility - Likely covers most or all premium')
      subsidyAmount = 'Likely $400-600/month'
    } else if (incomePercent <= 200) {
      options.push('Substantial subsidies available')
      subsidyAmount = 'Likely $200-400/month'
    } else if (incomePercent <= 400) {
      options.push('Moderate subsidies may apply')
      subsidyAmount = 'Likely $50-200/month'
    } else {
      options.push('Limited/no subsidies - Consider private plans')
      subsidyAmount = 'Full price: $300-700/month'
    }

    setQuizResults({
      recommendations: options,
      estimatedCosts: [subsidyAmount],
      eligible: true,
      details: `Annual Income: ${quizAnswers.ind_income ? incomeRanges[quizAnswers.ind_income].label : 'Not specified'} | Household Size: ${householdSize} | Currently Employed: ${employed ? 'Yes' : 'No'}`
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

    setQuizResults({
      recommendations: options,
      estimatedCosts: [`Tax Credit: $${Math.round(taxCredit)}/month`],
      eligible: employees >= 2,
      details: `Employees: ${employees} | Budget/Employee/Month: $${budget}`
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <button onClick={() => setActiveMain('home')} className="text-xl font-light text-[#003366] hover:opacity-80">Linda Karp Insurance</button>
          <div className="flex gap-4">
            <button onClick={() => setActiveMain('medicare')} className="text-sm text-gray-600 hover:text-gray-900 font-light">Medicare</button>
            <button onClick={() => setActiveMain('individual')} className="text-sm text-gray-600 hover:text-gray-900 font-light">Individual</button>
            <button onClick={() => setActiveMain('group')} className="text-sm text-gray-600 hover:text-gray-900 font-light">Group</button>
            <button className="text-sm px-4 py-1.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 font-light">Contact</button>
          </div>
        </div>
      </header>

      {activeMain === 'home' && (
        <div>
          {/* Hero - Warm & Inviting */}
          <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-24 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="text-sm text-gray-500 font-light tracking-wide mb-4">HEALTH INSURANCE GUIDANCE</p>
                  <h1 className="text-5xl font-light text-gray-900 mb-6 leading-relaxed">Finding peace of mind in your healthcare choices</h1>
                  <p className="text-gray-600 font-light mb-8 leading-relaxed text-lg">With over 28 years helping Californians navigate their health insurance options, I understand that the right coverage isn't just about price—it's about peace of mind.</p>
                  <div className="flex gap-4">
                    <button onClick={() => setActiveMain('medicare')} className="text-sm px-6 py-3 border border-gray-400 text-gray-700 rounded hover:bg-gray-50 font-light">Explore Medicare</button>
                    <button onClick={() => setActiveMain('individual')} className="text-sm px-6 py-3 bg-[#003366] text-white rounded hover:bg-[#002240] font-light">Find Your Plan</button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-100/30 to-green-100/30 rounded-2xl h-96 flex items-center justify-center border border-blue-100/50">
                  <div className="text-center">
                    <div className="text-8xl mb-4 opacity-40">❤️</div>
                    <p className="text-gray-500 font-light">Your health matters</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Linda */}
          <section className="py-20 px-4 border-t border-gray-100">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl h-80 flex items-center justify-center border border-amber-100/50">
                <div className="text-center">
                  <div className="text-7xl mb-4 opacity-50">👋</div>
                  <p className="text-gray-500 font-light text-sm">Trusted guidance since 1996</p>
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-light text-gray-900 mb-6">About Linda</h2>
                <p className="text-gray-600 font-light mb-6 leading-relaxed">After decades in health insurance, I've seen how confusing coverage options can be. My mission is simple: help you find the right plan for your life, not the one with the biggest commission.</p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="text-green-600 font-light text-lg">✓</div>
                    <p className="text-gray-600 font-light">Honest, personalized recommendations</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-green-600 font-light text-lg">✓</div>
                    <p className="text-gray-600 font-light">Expert guidance on Medicare, individual, and group plans</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-green-600 font-light text-lg">✓</div>
                    <p className="text-gray-600 font-light">Support every step of the way</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Three Paths */}
          <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-light text-gray-900 text-center mb-4">What We Help With</h2>
              <p className="text-center text-gray-600 font-light mb-16">Whether you're turning 65, looking for individual coverage, or managing group benefits—we're here to guide you.</p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-8 border border-gray-200 hover:border-gray-300 transition">
                  <div className="text-5xl mb-6 opacity-60">🏥</div>
                  <h3 className="text-xl font-light text-gray-900 mb-4">Medicare Planning</h3>
                  <p className="text-sm text-gray-600 font-light mb-6 leading-relaxed">Navigate Medigap, Medicare Advantage, and Part D coverage options with expert guidance tailored to your health and budget.</p>
                  <button onClick={() => setActiveMain('medicare')} className="text-sm text-[#003366] hover:text-[#002240] font-light">Learn more →</button>
                </div>

                <div className="bg-white rounded-lg p-8 border border-gray-200 hover:border-gray-300 transition">
                  <div className="text-5xl mb-6 opacity-60">👨‍👩‍👧‍👦</div>
                  <h3 className="text-xl font-light text-gray-900 mb-4">Individual & Family Plans</h3>
                  <p className="text-sm text-gray-600 font-light mb-6 leading-relaxed">Find affordable CoveredCA coverage with clear guidance on subsidies, tax credits, and plan options that fit your family.</p>
                  <button onClick={() => setActiveMain('individual')} className="text-sm text-[#003366] hover:text-[#002240] font-light">Learn more →</button>
                </div>

                <div className="bg-white rounded-lg p-8 border border-gray-200 hover:border-gray-300 transition">
                  <div className="text-5xl mb-6 opacity-60">🏢</div>
                  <h3 className="text-xl font-light text-gray-900 mb-4">Group Business Coverage</h3>
                  <p className="text-sm text-gray-600 font-light mb-6 leading-relaxed">Comprehensive plans for small businesses, with clarity on SHOP marketplace benefits, tax credits, and employee options.</p>
                  <button onClick={() => setActiveMain('group')} className="text-sm text-[#003366] hover:text-[#002240] font-light">Learn more →</button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-light text-gray-900 mb-4">Ready for a conversation?</h2>
              <p className="text-gray-600 font-light mb-8">Get personalized guidance based on your unique situation. No high-pressure sales, just honest advice.</p>
              <button className="px-8 py-3 bg-[#003366] text-white rounded hover:bg-[#002240] font-light">Schedule a consultation</button>
            </div>
          </section>
        </div>
      )}

      {activeMain === 'medicare' && (
        <div>
          {/* Medicare Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-6xl mx-auto px-4 flex gap-6 py-4">
              {['coverage', 'penalties', 'enrollment', 'costs'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveMedicare(tab)}
                  className={`text-sm font-light pb-2 border-b-2 transition ${
                    activeMedicare === tab 
                      ? 'border-[#003366] text-[#003366]' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'coverage' && 'Coverage Options'}
                  {tab === 'penalties' && 'Important Details'}
                  {tab === 'enrollment' && 'Enrollment Periods'}
                  {tab === 'costs' && '2024 Costs'}
                </button>
              ))}
            </div>
          </div>

          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              {activeMedicare === 'coverage' && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-light text-gray-900 mb-12">Medicare Coverage Options</h2>
                    
                    <div className="space-y-12">
                      <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                          <h3 className="text-2xl font-light text-gray-900 mb-4">Original Medicare</h3>
                          <p className="text-gray-600 font-light mb-6">Government insurance that lets you choose any doctor accepting Medicare. It's the foundation coverage.</p>
                          <ul className="text-sm space-y-3 text-gray-600 font-light">
                            <li className="flex gap-3"><span className="text-gray-400">•</span> Hospital coverage (Part A)</li>
                            <li className="flex gap-3"><span className="text-gray-400">•</span> Doctor & outpatient coverage (Part B)</li>
                            <li className="flex gap-3"><span className="text-gray-400">•</span> You manage deductibles & copayments</li>
                            <li className="flex gap-3"><span className="text-gray-400">•</span> No prescription drug coverage included</li>
                          </ul>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-2xl h-64 flex items-center justify-center border border-blue-100/50">
                          <div className="text-7xl opacity-50">🏥</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-2xl h-64 flex items-center justify-center border border-green-100/50">
                          <div className="text-7xl opacity-50">💊</div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-light text-gray-900 mb-4">Medicare Supplement (Medigap)</h3>
                          <p className="text-gray-600 font-light mb-6">Private insurance that fills the gaps in Original Medicare, covering what the government plan doesn't.</p>
                          <ul className="text-sm space-y-3 text-gray-600 font-light">
                            <li className="flex gap-3"><span className="text-gray-400">•</span> Covers deductibles & copayments</li>
                            <li className="flex gap-3"><span className="text-gray-400">•</span> Keep any doctor accepting Medicare</li>
                            <li className="flex gap-3"><span className="text-gray-400">•</span> Plans A through N to choose from</li>
                            <li className="flex gap-3"><span className="text-gray-400">•</span> Doesn't include prescriptions</li>
                          </ul>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                          <h3 className="text-2xl font-light text-gray-900 mb-4">Medicare Advantage (Part C)</h3>
                          <p className="text-gray-600 font-light mb-6">An all-in-one alternative to Original Medicare, typically including prescription coverage and extra benefits.</p>
                          <ul className="text-sm space-y-3 text-gray-600 font-light">
                            <li className="flex gap-3"><span className="text-gray-400">•</span> Prescription drugs included</li>
                            <li className="flex gap-3"><span className="text-gray-400">•</span> Often $0 monthly premium</li>
                            <li className="flex gap-3"><span className="text-gray-400">•</span> Extra benefits (dental, vision, fitness)</li>
                            <li className="flex gap-3"><span className="text-gray-400">•</span> Limited to network doctors</li>
                          </ul>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-2xl h-64 flex items-center justify-center border border-purple-100/50">
                          <div className="text-7xl opacity-50">🎯</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeMedicare === 'penalties' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Late Enrollment Penalties</h2>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-8">
                    <p className="text-gray-600 font-light mb-8">Missing enrollment deadlines can add permanent costs to your coverage. Here's what you need to know:</p>
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded">
                        <p className="font-light text-gray-900 mb-2">Part B Penalty</p>
                        <p className="text-sm text-gray-600 font-light">+10% of the premium for each year you delayed. This penalty stays with you forever.</p>
                      </div>
                      <div className="bg-white p-6 rounded">
                        <p className="font-light text-gray-900 mb-2">Part D Penalty</p>
                        <p className="text-sm text-gray-600 font-light">+1% per month you didn't have coverage. This also sticks with you for life.</p>
                      </div>
                      <div className="bg-white p-6 rounded border-l-4 border-green-500">
                        <p className="font-light text-gray-900 mb-2">The exceptions that matter</p>
                        <p className="text-sm text-gray-600 font-light">If you were covered through an employer or had a qualifying life event, you may have more time.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeMedicare === 'enrollment' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">When You Can Enroll</h2>
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
                      <p className="font-light text-gray-900 mb-3 text-lg">Initial Enrollment Period</p>
                      <p className="text-sm text-gray-600 font-light mb-4">7 months: 3 months before, during, and 3 months after your 65th birthday</p>
                      <p className="text-xs text-gray-500 font-light">Your critical window—act here to avoid penalties</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-8 border border-green-200">
                      <p className="font-light text-gray-900 mb-3 text-lg">Annual Enrollment Period</p>
                      <p className="text-sm text-gray-600 font-light mb-4">October 15 - December 7 each year</p>
                      <p className="text-xs text-gray-500 font-light">Your chance to switch plans once yearly</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-8 border border-purple-200">
                      <p className="font-light text-gray-900 mb-3 text-lg">Special Enrollment Period</p>
                      <p className="text-sm text-gray-600 font-light mb-4">Triggered by life events (moving, losing coverage, etc.)</p>
                      <p className="text-xs text-gray-500 font-light">Additional 60-day window if qualified</p>
                    </div>
                  </div>
                </div>
              )}

              {activeMedicare === 'costs' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">What Coverage Costs</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-lg p-6 border border-blue-100">
                      <p className="text-xs text-gray-500 font-light uppercase tracking-wide mb-3">Part A Deductible</p>
                      <p className="text-2xl font-light text-gray-900">$1,556</p>
                      <p className="text-xs text-gray-500 font-light mt-2">per year</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-lg p-6 border border-green-100">
                      <p className="text-xs text-gray-500 font-light uppercase tracking-wide mb-3">Part B Deductible</p>
                      <p className="text-2xl font-light text-gray-900">$240</p>
                      <p className="text-xs text-gray-500 font-light mt-2">per year</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-lg p-6 border border-purple-100">
                      <p className="text-xs text-gray-500 font-light uppercase tracking-wide mb-3">Medigap Plan G</p>
                      <p className="text-2xl font-light text-gray-900">$120-280</p>
                      <p className="text-xs text-gray-500 font-light mt-2">per month</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-lg p-6 border border-amber-100">
                      <p className="text-xs text-gray-500 font-light uppercase tracking-wide mb-3">Part D Rx</p>
                      <p className="text-2xl font-light text-gray-900">$25-75</p>
                      <p className="text-xs text-gray-500 font-light mt-2">per month</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-16">
                <button 
                  onClick={() => setShowQuiz('medicare')}
                  className="w-full px-8 py-4 bg-[#003366] text-white rounded hover:bg-[#002240] font-light"
                >
                  Get personalized Medicare recommendations
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeMain === 'individual' && (
        <div>
          {/* Individual Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-6xl mx-auto px-4 flex gap-6 py-4">
              {['overview', 'subsidies', 'marketplace'].map(tab => (
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
                  {tab === 'subsidies' && 'Subsidies & Tax Credits'}
                  {tab === 'marketplace' && 'Plan Types'}
                </button>
              ))}
            </div>
          </div>

          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              {activeIndividual === 'overview' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Individual & Family Coverage</h2>
                  <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
                    <div>
                      <p className="text-gray-600 font-light mb-8 leading-relaxed">Health insurance for individuals and families who don't have employer coverage. Through California's CoveredCA marketplace, you'll find affordable options with potential government help based on your income.</p>
                      <h3 className="text-lg font-light text-gray-900 mb-4">Why CoveredCA?</h3>
                      <ul className="text-sm space-y-3 text-gray-600 font-light">
                        <li className="flex gap-3"><span className="text-gray-400">•</span> No exclusions for pre-existing conditions</li>
                        <li className="flex gap-3"><span className="text-gray-400">•</span> Potential tax credits to lower your premium</li>
                        <li className="flex gap-3"><span className="text-gray-400">•</span> Essential health benefits covered</li>
                        <li className="flex gap-3"><span className="text-gray-400">•</span> Special enrollment periods for life changes</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-2xl h-80 flex items-center justify-center border border-blue-100/50">
                      <div className="text-8xl opacity-50">👨‍👩‍👧‍👦</div>
                    </div>
                  </div>
                </div>
              )}

              {activeIndividual === 'subsidies' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Tax Credits & Subsidies</h2>
                  <p className="text-gray-600 font-light mb-12 leading-relaxed">The government helps many Californians afford coverage through tax credits that reduce your monthly premium. The amount depends on your household income and size.</p>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-lg border border-green-200 p-12 mb-8">
                    <h3 className="text-lg font-light text-gray-900 mb-8">2024 Income Thresholds for Help</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 font-light uppercase tracking-wide mb-2">Individual</p>
                        <p className="text-3xl font-light text-gray-900">$35k</p>
                        <p className="text-xs text-gray-500 font-light mt-2">Maximum subsidy</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-light uppercase tracking-wide mb-2">Family of 3</p>
                        <p className="text-3xl font-light text-gray-900">$59k</p>
                        <p className="text-xs text-gray-500 font-light mt-2">Maximum subsidy</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-light uppercase tracking-wide mb-2">Family of 4</p>
                        <p className="text-3xl font-light text-gray-900">$73k</p>
                        <p className="text-xs text-gray-500 font-light mt-2">Maximum subsidy</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-8">
                    <p className="font-light text-gray-900 mb-3">A note on reporting</p>
                    <p className="text-sm text-gray-600 font-light">If your income changes during the year, update your information within 30 days. Discrepancies can result in having to repay subsidies.</p>
                  </div>
                </div>
              )}

              {activeIndividual === 'marketplace' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Understanding Plan Types</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-lg border border-blue-100 p-8">
                      <p className="font-light text-gray-900 text-lg mb-3">Bronze Plans</p>
                      <p className="text-sm text-gray-600 font-light mb-4">Lower monthly cost, higher deductible. Good if you're generally healthy.</p>
                      <p className="text-xs text-gray-500 font-light">60% of costs covered by plan</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-lg border border-gray-200 p-8">
                      <p className="font-light text-gray-900 text-lg mb-3">Silver Plans</p>
                      <p className="text-sm text-gray-600 font-light mb-4">Balanced cost and coverage. Popular choice with subsidies.</p>
                      <p className="text-xs text-gray-500 font-light">70% of costs covered by plan</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/30 rounded-lg border border-yellow-200 p-8">
                      <p className="font-light text-gray-900 text-lg mb-3">Gold Plans</p>
                      <p className="text-sm text-gray-600 font-light mb-4">Higher monthly cost, lower deductible. For regular medical needs.</p>
                      <p className="text-xs text-gray-500 font-light">80% of costs covered by plan</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-lg border border-purple-200 p-8">
                      <p className="font-light text-gray-900 text-lg mb-3">Platinum Plans</p>
                      <p className="text-sm text-gray-600 font-light mb-4">Highest monthly cost, lowest deductible. Maximum coverage.</p>
                      <p className="text-xs text-gray-500 font-light">90% of costs covered by plan</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-16">
                <button 
                  onClick={() => setShowQuiz('individual')}
                  className="w-full px-8 py-4 bg-[#003366] text-white rounded hover:bg-[#002240] font-light"
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
          {/* Group Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-6xl mx-auto px-4 flex gap-6 py-4">
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
                  {tab === 'costs' && 'Costs & Credits'}
                </button>
              ))}
            </div>
          </div>

          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              {activeGroup === 'overview' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Group Health Coverage for Businesses</h2>
                  <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
                    <div>
                      <p className="text-gray-600 font-light mb-8 leading-relaxed">Offering health coverage is one of the best ways to attract and keep talented employees. With the right guidance, group coverage can be more affordable than you think.</p>
                      <h3 className="text-lg font-light text-gray-900 mb-4">Why offer coverage?</h3>
                      <ul className="text-sm space-y-3 text-gray-600 font-light">
                        <li className="flex gap-3"><span className="text-gray-400">•</span> Attract and retain better talent</li>
                        <li className="flex gap-3"><span className="text-gray-400">•</span> Tax-deductible business expense</li>
                        <li className="flex gap-3"><span className="text-gray-400">•</span> Potential government tax credits</li>
                        <li className="flex gap-3"><span className="text-gray-400">•</span> Shows you value your team</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-2xl h-80 flex items-center justify-center border border-green-100/50">
                      <div className="text-8xl opacity-50">🏢</div>
                    </div>
                  </div>
                </div>
              )}

              {activeGroup === 'shop' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">SHOP Marketplace</h2>
                  <p className="text-gray-600 font-light mb-12 leading-relaxed">If you have 2-50 employees, the federal SHOP marketplace lets you compare plans and potentially access significant tax credits. It's designed specifically for small businesses.</p>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-8">
                      <p className="font-light text-gray-900 text-lg mb-3">Tax Credits Up to 50%</p>
                      <p className="text-sm text-gray-600 font-light">For-profit businesses can receive up to 50% of premiums paid. Non-profits up to 35%.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-8">
                      <p className="font-light text-gray-900 text-lg mb-3">No Medical Underwriting</p>
                      <p className="text-sm text-gray-600 font-light">All qualified small businesses are approved, regardless of employee health history.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-8">
                      <p className="font-light text-gray-900 text-lg mb-3">Employee Choice</p>
                      <p className="text-sm text-gray-600 font-light">Employees select their own plan within the level you set for employer contribution.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeGroup === 'costs' && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Typical Group Plan Costs</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-lg p-8 border border-blue-100">
                      <p className="text-xs text-gray-500 font-light uppercase tracking-wide mb-3">Bronze Plan</p>
                      <p className="text-3xl font-light text-gray-900">$350-450</p>
                      <p className="text-xs text-gray-500 font-light mt-2">per employee/month</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-lg p-8 border border-gray-200">
                      <p className="text-xs text-gray-500 font-light uppercase tracking-wide mb-3">Silver Plan</p>
                      <p className="text-3xl font-light text-gray-900">$450-600</p>
                      <p className="text-xs text-gray-500 font-light mt-2">per employee/month</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-lg p-8 border border-amber-100">
                      <p className="text-xs text-gray-500 font-light uppercase tracking-wide mb-3">Gold Plan</p>
                      <p className="text-3xl font-light text-gray-900">$600-800</p>
                      <p className="text-xs text-gray-500 font-light mt-2">per employee/month</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-lg border border-green-200 p-12">
                    <h3 className="font-light text-gray-900 text-lg mb-6">How the costs break down</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-gray-600 font-light">Employer typically contributes</p>
                        <p className="font-light text-gray-900">50-75% of premium</p>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-gray-600 font-light">Employee pays via payroll</p>
                        <p className="font-light text-gray-900">25-50% of premium</p>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-4 border-t border-green-200">
                        <p className="text-gray-600 font-light">Admin/broker fees</p>
                        <p className="font-light text-gray-900">$10-30 per employee/month</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-16">
                <button 
                  onClick={() => setShowQuiz('group')}
                  className="w-full px-8 py-4 bg-[#003366] text-white rounded hover:bg-[#002240] font-light"
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
              <h3 className="text-2xl font-light text-gray-900">
                {showQuiz === 'medicare' && 'Medicare Assessment'}
                {showQuiz === 'individual' && 'Individual Plan Assessment'}
                {showQuiz === 'group' && 'Group Plan Assessment'}
              </h3>
              <button onClick={() => { setShowQuiz(null); setQuizResults(null); }} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
            </div>

            {!quizResults ? (
              <div className="space-y-5">
                {showQuiz === 'medicare' && (
                  <>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">What is your current age?</label>
                      <input type="number" placeholder="65" onChange={(e) => handleQuizAnswer('age', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Are you currently employed?</label>
                      <div className="flex gap-3">
                        <button onClick={() => handleQuizAnswer('employed', 'yes')} className={`px-4 py-2 rounded text-sm font-light ${quizAnswers.employed === 'yes' ? 'bg-[#003366] text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('employed', 'no')} className={`px-4 py-2 rounded text-sm font-light ${quizAnswers.employed === 'no' ? 'bg-[#003366] text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>No</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Annual household income:</label>
                      <select onChange={(e) => handleQuizAnswer('income', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20">
                        <option value="">Select income range...</option>
                        <option value="under25">Under $25,000</option>
                        <option value="25to50">$25,000 - $50,000</option>
                        <option value="50to75">$50,000 - $75,000</option>
                        <option value="75to100">$75,000 - $100,000</option>
                        <option value="100to150">$100,000 - $150,000</option>
                        <option value="150plus">$150,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Do you have chronic health conditions?</label>
                      <div className="flex gap-3">
                        <button onClick={() => handleQuizAnswer('conditions', 'yes')} className={`px-4 py-2 rounded text-sm font-light ${quizAnswers.conditions === 'yes' ? 'bg-[#003366] text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('conditions', 'no')} className={`px-4 py-2 rounded text-sm font-light ${quizAnswers.conditions === 'no' ? 'bg-[#003366] text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>No</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">How many medications do you take regularly?</label>
                      <select onChange={(e) => handleQuizAnswer('medications', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20">
                        <option value="">Select...</option>
                        <option value="0">None</option>
                        <option value="1">1-2</option>
                        <option value="3">3-5</option>
                        <option value="6">6+</option>
                      </select>
                    </div>
                    <button onClick={calculateMedicareResults} className="w-full px-6 py-3 bg-[#003366] text-white rounded hover:bg-[#002240] font-light text-sm">Generate Report</button>
                  </>
                )}

                {showQuiz === 'individual' && (
                  <>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Annual household income:</label>
                      <select onChange={(e) => handleQuizAnswer('ind_income', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20">
                        <option value="">Select income range...</option>
                        <option value="under25">Under $25,000</option>
                        <option value="25to50">$25,000 - $50,000</option>
                        <option value="50to75">$50,000 - $75,000</option>
                        <option value="75to100">$75,000 - $100,000</option>
                        <option value="100to150">$100,000 - $150,000</option>
                        <option value="150plus">$150,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Household size:</label>
                      <select onChange={(e) => handleQuizAnswer('ind_household', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20">
                        <option value="">Select...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Are you currently employed?</label>
                      <div className="flex gap-3">
                        <button onClick={() => handleQuizAnswer('ind_employed', 'yes')} className={`px-4 py-2 rounded text-sm font-light ${quizAnswers.ind_employed === 'yes' ? 'bg-[#003366] text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('ind_employed', 'no')} className={`px-4 py-2 rounded text-sm font-light ${quizAnswers.ind_employed === 'no' ? 'bg-[#003366] text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>No</button>
                      </div>
                    </div>
                    <button onClick={calculateIndividualResults} className="w-full px-6 py-3 bg-[#003366] text-white rounded hover:bg-[#002240] font-light text-sm">See Your Eligibility</button>
                  </>
                )}

                {showQuiz === 'group' && (
                  <>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Number of employees:</label>
                      <input type="number" placeholder="25" onChange={(e) => handleQuizAnswer('group_employees', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Average employee salary: $</label>
                      <input type="number" placeholder="50000" onChange={(e) => handleQuizAnswer('group_salary', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 text-gray-900">Proposed budget per employee/month: $</label>
                      <input type="number" placeholder="350" onChange={(e) => handleQuizAnswer('group_budget', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20" />
                    </div>
                    <button onClick={calculateGroupResults} className="w-full px-6 py-3 bg-[#003366] text-white rounded hover:bg-[#002240] font-light text-sm">Calculate Credits</button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded">
                  <p className="text-xs font-light text-gray-600 mb-2">Your Profile</p>
                  <p className="text-sm text-gray-700 font-light">{quizResults.details}</p>
                </div>

                <div className="space-y-3">
                  {quizResults.recommendations.map((rec, i) => (
                    <div key={i} className="bg-green-50 border border-green-200 p-4 rounded">
                      <p className="text-sm font-light text-gray-900">{rec}</p>
                      <p className="text-xs text-gray-600 font-light mt-1">{quizResults.estimatedCosts[i]}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={generatePDF} className="flex-1 px-6 py-2 bg-[#003366] text-white rounded hover:bg-[#002240] font-light text-sm">Download Report</button>
                  <button className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-light text-sm">Email Report</button>
                </div>

                <button onClick={() => setQuizResults(null)} className="w-full px-6 py-2 border border-gray-200 text-gray-700 rounded hover:bg-gray-50 font-light text-sm">Start Over</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-light text-gray-900 mb-3">Linda Karp Insurance</h4>
              <p className="text-sm text-gray-600 font-light">28+ years helping Californians find peace of mind through better health coverage decisions.</p>
            </div>
            <div>
              <h4 className="font-light text-gray-900 mb-3">Services</h4>
              <ul className="text-sm space-y-2 text-gray-600 font-light">
                <li><button onClick={() => setActiveMain('medicare')} className="hover:text-gray-900">Medicare</button></li>
                <li><button onClick={() => setActiveMain('individual')} className="hover:text-gray-900">Individual Plans</button></li>
                <li><button onClick={() => setActiveMain('group')} className="hover:text-gray-900">Group Plans</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-light text-gray-900 mb-3">Contact</h4>
              <p className="text-sm text-gray-600 font-light">(XXX) XXX-XXXX</p>
              <p className="text-sm text-gray-600 font-light">info@lindakarp.com</p>
            </div>
            <div>
              <h4 className="font-light text-gray-900 mb-3">Ready to talk?</h4>
              <button className="text-sm px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-white font-light">Schedule a call</button>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-xs text-gray-500 font-light">&copy; 2024 Linda Karp Insurance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
