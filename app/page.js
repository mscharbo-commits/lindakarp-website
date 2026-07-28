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
MEDICARE COVERAGE ANALYSIS
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
    element.setAttribute('download', 'medicare-analysis.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const calculateMedicareResults = () => {
    const age = parseInt(quizAnswers.age) || 0
    const employed = quizAnswers.employed === 'yes'
    const income = parseInt(quizAnswers.income) || 0
    const conditions = quizAnswers.conditions === 'yes'
    const medications = parseInt(quizAnswers.medications) || 0
    const doctorPreference = quizAnswers.doctorPreference

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
      details: `Age: ${age} | Employment: ${employed ? 'Working' : 'Retired'} | Income: $${income}k | Chronic Conditions: ${conditions ? 'Yes' : 'No'} | # of Medications: ${medications} | Doctor Preference: ${doctorPreference}`
    })
  }

  const calculateIndividualResults = () => {
    const income = parseInt(quizAnswers.ind_income) || 0
    const householdSize = parseInt(quizAnswers.ind_household) || 1
    const employed = quizAnswers.ind_employed === 'yes'
    const hasPreexisting = quizAnswers.ind_preexisting === 'yes'

    let options = []
    let subsidyAmount = 0

    const fpl = householdSize * 14580
    const incomePercent = (income / fpl) * 100

    if (incomePercent <= 150) {
      options.push('MAXIMUM subsidy eligibility - Likely covers most or all premium')
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
      details: `Annual Income: $${income}k | Household Size: ${householdSize} | Currently Employed: ${employed ? 'Yes' : 'No'} | Pre-existing Conditions: ${hasPreexisting ? 'Yes' : 'No'}`
    })
  }

  const calculateGroupResults = () => {
    const employees = parseInt(quizAnswers.group_employees) || 0
    const avgSalary = parseInt(quizAnswers.group_salary) || 50000
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
    options.push(`Compliance: FICA, ERISA, & ACA requirements met with proper documentation`)

    setQuizResults({
      recommendations: options,
      estimatedCosts: [`Tax Credit: $${Math.round(taxCredit)}/month`, `Total Premium Range: $${Math.round(budget * employees)}-${Math.round(budget * employees * 1.2)}/month`],
      eligible: employees >= 2,
      details: `Employees: ${employees} | Average Salary: $${avgSalary}k | Budget/Employee/Month: $${budget}`
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#003366]">Linda Karp Insurance</h1>
          <button className="px-6 py-2 bg-[#27ae60] text-white rounded-lg font-medium hover:bg-[#229954] text-sm">Contact Us</button>
        </div>
      </header>

      {activeMain === 'home' && (
        <div>
          {/* Hero */}
          <section className="bg-white border-b border-gray-200 py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Health Insurance Guidance Made Simple</h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">Over 28 years helping Californians navigate Medicare, individual plans, and group coverage. Get personalized recommendations based on your unique situation.</p>
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => setActiveMain('medicare')} className="px-5 py-2 bg-[#27ae60] text-white rounded-lg font-medium hover:bg-[#229954] text-sm">Explore Medicare</button>
                    <button onClick={() => setActiveMain('individual')} className="px-5 py-2 border-2 border-[#0066cc] text-[#0066cc] rounded-lg font-medium hover:bg-blue-50 text-sm">Individual Plans</button>
                    <button onClick={() => setActiveMain('group')} className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 text-sm">Group Plans</button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-2">🏥</div>
                    <p className="text-gray-700 font-medium">Healthcare Guidance</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Overview */}
          <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-3xl font-bold text-center mb-8 text-gray-900">Our Services</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
                  <div className="text-4xl mb-3">👵</div>
                  <h4 className="text-xl font-bold mb-2 text-gray-900">Medicare</h4>
                  <p className="text-sm text-gray-700 mb-4">Navigate Supplement, Advantage, and Part D plans with expert guidance.</p>
                  <button onClick={() => setActiveMain('medicare')} className="text-[#27ae60] font-medium text-sm hover:underline">Learn more →</button>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
                  <div className="text-4xl mb-3">👨‍👩‍👧</div>
                  <h4 className="text-xl font-bold mb-2 text-gray-900">Individual & Family</h4>
                  <p className="text-sm text-gray-700 mb-4">Find affordable coverage through CoveredCA with subsidy optimization.</p>
                  <button onClick={() => setActiveMain('individual')} className="text-[#0066cc] font-medium text-sm hover:underline">Learn more →</button>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
                  <div className="text-4xl mb-3">🏢</div>
                  <h4 className="text-xl font-bold mb-2 text-gray-900">Group Business</h4>
                  <p className="text-sm text-gray-700 mb-4">Comprehensive plans for small businesses with SHOP tax credits.</p>
                  <button onClick={() => setActiveMain('group')} className="text-[#16a34a] font-medium text-sm hover:underline">Learn more →</button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-[#003366] to-[#0066cc] text-white py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-3">Ready to Find Your Best Plan?</h3>
              <p className="mb-6 text-blue-100">Take our quick assessment to see personalized recommendations.</p>
              <button className="px-6 py-3 bg-[#27ae60] text-white rounded-lg font-bold hover:bg-[#229954]">Start Assessment</button>
            </div>
          </section>
        </div>
      )}

      {activeMain === 'medicare' && (
        <div>
          {/* Medicare Tabs */}
          <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto py-3">
              {['coverage', 'penalties', 'enrollment', 'costs'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveMedicare(tab)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                    activeMedicare === tab 
                      ? 'bg-[#27ae60] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'coverage' && 'Coverage Options'}
                  {tab === 'penalties' && 'Penalties & Enrollment'}
                  {tab === 'enrollment' && 'Enrollment Periods'}
                  {tab === 'costs' && 'Cost Estimates'}
                </button>
              ))}
            </div>
          </div>

          <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              {activeMedicare === 'coverage' && (
                <div className="space-y-8">
                  <div className="bg-white rounded-lg p-8 border border-gray-200">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Medicare Coverage Options</h3>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                          <h4 className="text-lg font-bold mb-3 text-gray-900">Original Medicare (Part A & B)</h4>
                          <p className="text-sm text-gray-700 mb-3">Government insurance - you choose any doctor accepting Medicare</p>
                          <ul className="text-sm space-y-1 text-gray-700">
                            <li>✓ Part A: Hospital & skilled nursing</li>
                            <li>✓ Part B: Doctor visits & outpatient</li>
                            <li>• You pay deductibles & copayments</li>
                            <li>• No prescription drug coverage</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 rounded-lg h-40 flex items-center justify-center">
                          <div className="text-4xl">🏥</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="bg-green-50 rounded-lg h-40 flex items-center justify-center">
                          <div className="text-4xl">💊</div>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold mb-3 text-gray-900">Medicare Supplement (Medigap)</h4>
                          <p className="text-sm text-gray-700 mb-3">Private insurance that covers gaps in Original Medicare</p>
                          <ul className="text-sm space-y-1 text-gray-700">
                            <li>✓ Covers deductibles & copays</li>
                            <li>✓ See any Medicare doctor</li>
                            <li>✓ Plans A through N available</li>
                            <li>• Does not include prescriptions</li>
                          </ul>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                          <h4 className="text-lg font-bold mb-3 text-gray-900">Medicare Advantage (Part C)</h4>
                          <p className="text-sm text-gray-700 mb-3">All-in-one alternative with built-in prescription coverage</p>
                          <ul className="text-sm space-y-1 text-gray-700">
                            <li>✓ Prescriptions included</li>
                            <li>✓ Often $0 monthly premium</li>
                            <li>✓ Extra benefits (dental, vision)</li>
                            <li>• Limited network doctors</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 rounded-lg h-40 flex items-center justify-center">
                          <div className="text-4xl">🎯</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeMedicare === 'penalties' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-red-900">⚠️ Critical: Late Enrollment Penalties</h3>
                  <p className="text-sm text-red-800 mb-6">Missing enrollment deadlines can cost you thousands in lifetime penalties</p>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-bold text-gray-900">Part B Penalty</p>
                      <p className="text-sm text-gray-700">+10% per year late × number of years = <strong>permanent increase</strong></p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-bold text-gray-900">Part D Penalty</p>
                      <p className="text-sm text-gray-700">+1% per month late × number of months = <strong>permanent increase</strong></p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="font-bold text-gray-900">Only exceptions:</p>
                      <p className="text-sm text-gray-700">Still working with employer coverage, or losing employer coverage (Qualifying Life Event)</p>
                    </div>
                  </div>
                </div>
              )}

              {activeMedicare === 'enrollment' && (
                <div className="bg-white rounded-lg p-8 border border-gray-200">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Medicare Enrollment Periods</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="font-bold text-gray-900">Initial Enrollment Period (IEP)</p>
                      <p className="text-sm text-gray-700 mt-1">7 months: 3 months before, month of, 3 months after 65th birthday</p>
                      <p className="text-xs text-gray-600 mt-2">📌 Your only chance to enroll without penalties</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <p className="font-bold text-gray-900">Annual Enrollment Period (AEP)</p>
                      <p className="text-sm text-gray-700 mt-1">October 15 - December 7 (every year)</p>
                      <p className="text-xs text-gray-600 mt-2">📌 Switch plans once per year</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <p className="font-bold text-gray-900">Special Enrollment Period (SEP)</p>
                      <p className="text-sm text-gray-700 mt-1">Triggered by qualifying events (lost coverage, moved, etc.)</p>
                      <p className="text-xs text-gray-600 mt-2">📌 Additional 60-day window to enroll</p>
                    </div>
                  </div>
                </div>
              )}

              {activeMedicare === 'costs' && (
                <div className="bg-white rounded-lg p-8 border border-gray-200">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">2024 Medicare Costs at a Glance</h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                        <p className="font-bold text-gray-900 text-sm">Part A Deductible</p>
                        <p className="text-2xl font-bold text-[#0066cc] mt-2">$1,556/year</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                        <p className="font-bold text-gray-900 text-sm">Part B Deductible</p>
                        <p className="text-2xl font-bold text-[#27ae60] mt-2">$240/year</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                        <p className="font-bold text-gray-900 text-sm">Medigap Plan G</p>
                        <p className="text-2xl font-bold text-purple-600 mt-2">$120-280/mo</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                        <p className="font-bold text-gray-900 text-sm">Part D (Rx)</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-2">$25-75/mo</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button 
                  onClick={() => setShowQuiz('medicare')}
                  className="w-full px-8 py-4 bg-[#27ae60] text-white rounded-lg font-bold hover:bg-[#229954] text-lg"
                >
                  Take Medicare Assessment → Get Personalized Recommendations
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeMain === 'individual' && (
        <div>
          {/* Individual Tabs */}
          <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto py-3">
              {['overview', 'subsidies', 'marketplace'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveIndividual(tab)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                    activeIndividual === tab 
                      ? 'bg-[#0066cc] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'subsidies' && 'Subsidies & Credits'}
                  {tab === 'marketplace' && 'Coverage Options'}
                </button>
              ))}
            </div>
          </div>

          <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              {activeIndividual === 'overview' && (
                <div className="bg-white rounded-lg p-8 border border-gray-200">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Individual & Family Coverage</h3>
                  <p className="text-gray-700 mb-6">Health insurance for individuals and families outside employer plans. Coverage through CoveredCA marketplace with potential government subsidies.</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Key Benefits</h4>
                      <ul className="text-sm space-y-2 text-gray-700">
                        <li>✓ No exclusions for pre-existing conditions</li>
                        <li>✓ Essential health benefits covered</li>
                        <li>✓ Tax credits if you qualify</li>
                        <li>✓ Open enrollment period annually</li>
                        <li>✓ Life event qualifying periods</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 flex items-center justify-center h-full">
                      <div className="text-5xl">👨‍👩‍👧‍👦</div>
                    </div>
                  </div>
                </div>
              )}

              {activeIndividual === 'subsidies' && (
                <div className="space-y-6">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8">
                    <h3 className="text-2xl font-bold mb-4 text-green-900">💰 Tax Credits & Subsidies</h3>
                    <p className="text-sm text-gray-700 mb-6">Government help reducing your monthly premium based on household income</p>
                    
                    <div className="bg-white p-6 rounded-lg mb-6">
                      <p className="font-bold text-gray-900 mb-3">2024 Income Limits for Maximum Subsidies</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-bold">Individual</p>
                          <p className="text-gray-700">$35,000</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-bold">Family of 2</p>
                          <p className="text-gray-700">$47,000</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-bold">Family of 3</p>
                          <p className="text-gray-700">$59,000</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-bold">Family of 4</p>
                          <p className="text-gray-700">$73,000</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <p className="font-bold text-gray-900">⚠️ Important</p>
                      <p className="text-sm text-gray-700 mt-2">Report income changes within 30 days - Discrepancies can result in repaying subsidies</p>
                    </div>
                  </div>
                </div>
              )}

              {activeIndividual === 'marketplace' && (
                <div className="bg-white rounded-lg p-8 border border-gray-200">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">CoveredCA Metal Plans</h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                        <p className="font-bold text-blue-900">Bronze Plans</p>
                        <p className="text-sm text-gray-700 mt-2">60% coverage, lowest premium, highest deductible</p>
                        <p className="text-xs text-gray-600 mt-1">Best for: Healthy individuals</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
                        <p className="font-bold text-gray-900">Silver Plans</p>
                        <p className="text-sm text-gray-700 mt-2">70% coverage, moderate costs, cost-sharing reductions available</p>
                        <p className="text-xs text-gray-600 mt-1">Best for: Budget conscious with subsidies</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                        <p className="font-bold text-yellow-900">Gold Plans</p>
                        <p className="text-sm text-gray-700 mt-2">80% coverage, higher premium, lower deductible</p>
                        <p className="text-xs text-gray-600 mt-1">Best for: Frequent medical needs</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                        <p className="font-bold text-purple-900">Platinum Plans</p>
                        <p className="text-sm text-gray-700 mt-2">90% coverage, highest premium, lowest deductible</p>
                        <p className="text-xs text-gray-600 mt-1">Best for: Maximum coverage wanted</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button 
                  onClick={() => setShowQuiz('individual')}
                  className="w-full px-8 py-4 bg-[#0066cc] text-white rounded-lg font-bold hover:bg-[#003366] text-lg"
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
          {/* Group Tabs */}
          <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto py-3">
              {['overview', 'shop', 'costs'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveGroup(tab)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                    activeGroup === tab 
                      ? 'bg-[#16a34a] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'shop' && 'SHOP Marketplace'}
                  {tab === 'costs' && 'Costs & Tax Credits'}
                </button>
              ))}
            </div>
          </div>

          <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              {activeGroup === 'overview' && (
                <div className="bg-white rounded-lg p-8 border border-gray-200">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Group Health Plans for Businesses</h3>
                  <p className="text-gray-700 mb-6">Comprehensive health insurance solutions for employers with 2-50+ employees.</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Why Group Coverage?</h4>
                      <ul className="text-sm space-y-2 text-gray-700">
                        <li>✓ Attract and retain talent</li>
                        <li>✓ Tax deductible for employers</li>
                        <li>✓ Lower per-employee costs</li>
                        <li>✓ Potential government tax credits</li>
                        <li>✓ Streamlined administration</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 flex items-center justify-center">
                      <div className="text-5xl">🏢</div>
                    </div>
                  </div>
                </div>
              )}

              {activeGroup === 'shop' && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-blue-900">SHOP Marketplace</h3>
                  <p className="text-sm text-gray-700 mb-6">Federal marketplace for small businesses (2-50 employees) to compare and enroll in coverage</p>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-bold text-gray-900">Employer Tax Credit</p>
                      <p className="text-sm text-gray-700 mt-2">Up to <strong>50% of premiums paid</strong> (for-profit) or 35% (non-profit)</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-bold text-gray-900">Guaranteed Issue</p>
                      <p className="text-sm text-gray-700 mt-2">No medical underwriting - all businesses approved regardless of employee health</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-bold text-gray-900">Employee Choice</p>
                      <p className="text-sm text-gray-700 mt-2">Employees choose their own plan within your contribution level</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-bold text-gray-900">Automatic Enrollment</p>
                      <p className="text-sm text-gray-700 mt-2">Auto-enroll employees in lowest-cost plan (can opt out)</p>
                    </div>
                  </div>
                </div>
              )}

              {activeGroup === 'costs' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-8 border border-gray-200">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Group Plan Costs & Tax Credits</h3>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg mb-6">
                      <p className="font-bold text-green-900 mb-3">Typical Monthly Costs (per employee)</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-bold">Bronze Plan</p>
                          <p className="text-2xl font-bold text-green-600">$350-450</p>
                        </div>
                        <div>
                          <p className="font-bold">Silver Plan</p>
                          <p className="text-2xl font-bold text-green-600">$450-600</p>
                        </div>
                        <div>
                          <p className="font-bold">Gold Plan</p>
                          <p className="text-2xl font-bold text-green-600">$600-800</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                      <p className="font-bold text-gray-900 mb-3">Employer vs Employee Cost Split</p>
                      <p className="text-sm text-gray-700 mb-3">Typical arrangement:</p>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Employer: 50-75% of premium (tax-deductible)</li>
                        <li>• Employee: 25-50% via payroll deduction</li>
                        <li>• Admin fees: $10-30/employee/month</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button 
                  onClick={() => setShowQuiz('group')}
                  className="w-full px-8 py-4 bg-[#16a34a] text-white rounded-lg font-bold hover:bg-green-700 text-lg"
                >
                  Calculate Your Tax Credits & Costs
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
              <h3 className="text-2xl font-bold text-gray-900">
                {showQuiz === 'medicare' && 'Medicare Coverage Assessment'}
                {showQuiz === 'individual' && 'Individual Plan Assessment'}
                {showQuiz === 'group' && 'Group Plan Assessment'}
              </h3>
              <button onClick={() => { setShowQuiz(null); setQuizResults(null); }} className="text-2xl text-gray-500">×</button>
            </div>

            {!quizResults ? (
              <div className="space-y-5">
                {showQuiz === 'medicare' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">What is your current age?</label>
                      <input type="number" placeholder="65" onChange={(e) => handleQuizAnswer('age', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">Are you currently employed?</label>
                      <div className="flex gap-3">
                        <button onClick={() => handleQuizAnswer('employed', 'yes')} className={`px-4 py-2 rounded text-sm font-medium ${quizAnswers.employed === 'yes' ? 'bg-[#27ae60] text-white' : 'border border-gray-300 text-gray-700'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('employed', 'no')} className={`px-4 py-2 rounded text-sm font-medium ${quizAnswers.employed === 'no' ? 'bg-[#27ae60] text-white' : 'border border-gray-300 text-gray-700'}`}>No</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">Annual income: $</label>
                      <input type="number" placeholder="30000" onChange={(e) => handleQuizAnswer('income', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">Do you have chronic health conditions? (diabetes, heart disease, etc.)</label>
                      <div className="flex gap-3">
                        <button onClick={() => handleQuizAnswer('conditions', 'yes')} className={`px-4 py-2 rounded text-sm font-medium ${quizAnswers.conditions === 'yes' ? 'bg-[#27ae60] text-white' : 'border border-gray-300 text-gray-700'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('conditions', 'no')} className={`px-4 py-2 rounded text-sm font-medium ${quizAnswers.conditions === 'no' ? 'bg-[#27ae60] text-white' : 'border border-gray-300 text-gray-700'}`}>No</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">How many medications do you take regularly?</label>
                      <select onChange={(e) => handleQuizAnswer('medications', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="">Select...</option>
                        <option value="0">None</option>
                        <option value="1">1-2</option>
                        <option value="3">3-5</option>
                        <option value="6">6+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">Doctor preference?</label>
                      <select onChange={(e) => handleQuizAnswer('doctorPreference', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="">Select...</option>
                        <option value="any">See any doctor</option>
                        <option value="network">Network is fine</option>
                        <option value="specific">Must see specific doctors</option>
                      </select>
                    </div>
                    <button onClick={calculateMedicareResults} className="w-full px-6 py-3 bg-[#27ae60] text-white rounded-lg font-bold hover:bg-[#229954] text-sm">Generate My Report</button>
                  </>
                )}

                {showQuiz === 'individual' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">Annual household income: $</label>
                      <input type="number" placeholder="45000" onChange={(e) => handleQuizAnswer('ind_income', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">Household size:</label>
                      <select onChange={(e) => handleQuizAnswer('ind_household', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="">Select...</option>
                        <option value="1">1 (just me)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">Are you currently employed?</label>
                      <div className="flex gap-3">
                        <button onClick={() => handleQuizAnswer('ind_employed', 'yes')} className={`px-4 py-2 rounded text-sm font-medium ${quizAnswers.ind_employed === 'yes' ? 'bg-[#0066cc] text-white' : 'border border-gray-300 text-gray-700'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('ind_employed', 'no')} className={`px-4 py-2 rounded text-sm font-medium ${quizAnswers.ind_employed === 'no' ? 'bg-[#0066cc] text-white' : 'border border-gray-300 text-gray-700'}`}>No</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">Do you have pre-existing conditions?</label>
                      <div className="flex gap-3">
                        <button onClick={() => handleQuizAnswer('ind_preexisting', 'yes')} className={`px-4 py-2 rounded text-sm font-medium ${quizAnswers.ind_preexisting === 'yes' ? 'bg-[#0066cc] text-white' : 'border border-gray-300 text-gray-700'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('ind_preexisting', 'no')} className={`px-4 py-2 rounded text-sm font-medium ${quizAnswers.ind_preexisting === 'no' ? 'bg-[#0066cc] text-white' : 'border border-gray-300 text-gray-700'}`}>No</button>
                      </div>
                    </div>
                    <button onClick={calculateIndividualResults} className="w-full px-6 py-3 bg-[#0066cc] text-white rounded-lg font-bold hover:bg-[#003366] text-sm">See My Subsidy Eligibility</button>
                  </>
                )}

                {showQuiz === 'group' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">Number of employees:</label>
                      <input type="number" placeholder="25" onChange={(e) => handleQuizAnswer('group_employees', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">Average employee salary: $</label>
                      <input type="number" placeholder="50000" onChange={(e) => handleQuizAnswer('group_salary', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-900">Your proposed budget per employee/month: $</label>
                      <input type="number" placeholder="350" onChange={(e) => handleQuizAnswer('group_budget', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <button onClick={calculateGroupResults} className="w-full px-6 py-3 bg-[#16a34a] text-white rounded-lg font-bold hover:bg-green-700 text-sm">Calculate Tax Credits</button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm font-bold text-gray-900 mb-2">Your Profile:</p>
                  <p className="text-xs text-gray-700">{quizResults.details}</p>
                </div>

                <div className="space-y-3">
                  {quizResults.recommendations.map((rec, i) => (
                    <div key={i} className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <p className="text-sm font-bold text-gray-900">{rec}</p>
                      <p className="text-xs text-gray-600 mt-1">{quizResults.estimatedCosts[i]}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={generatePDF} className="flex-1 px-6 py-3 bg-[#27ae60] text-white rounded-lg font-bold hover:bg-[#229954] text-sm">⬇️ Download PDF Report</button>
                  <button className="flex-1 px-6 py-3 bg-[#0066cc] text-white rounded-lg font-bold hover:bg-[#003366] text-sm">📧 Email to Linda</button>
                </div>

                <button onClick={() => setQuizResults(null)} className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 text-sm">← Start Over</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#003366] text-white py-12 px-4 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-3">Linda Karp Insurance</h4>
              <p className="text-sm text-gray-300">28+ years of health insurance expertise</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Services</h4>
              <ul className="text-sm space-y-1 text-gray-300">
                <li><button onClick={() => setActiveMain('medicare')} className="hover:text-white">Medicare</button></li>
                <li><button onClick={() => setActiveMain('individual')} className="hover:text-white">Individual Plans</button></li>
                <li><button onClick={() => setActiveMain('group')} className="hover:text-white">Group Plans</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Contact</h4>
              <p className="text-sm text-gray-300">(XXX) XXX-XXXX</p>
              <p className="text-sm text-gray-300">info@lindakarp.com</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Ready to Start?</h4>
              <button className="text-sm bg-[#27ae60] px-4 py-2 rounded hover:bg-[#229954]">Schedule Consultation</button>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Linda Karp Insurance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
