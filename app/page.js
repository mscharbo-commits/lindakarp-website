'use client'
import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('medicare')
  const [showQuiz, setShowQuiz] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResults, setQuizResults] = useState(null)

  const handleQuizAnswer = (question, answer) => {
    setQuizAnswers(prev => ({...prev, [question]: answer}))
  }

  const calculateMedicareResults = () => {
    const age = parseInt(quizAnswers.age) || 0
    const employed = quizAnswers.employed === 'yes'
    const income = parseInt(quizAnswers.income) || 0
    const conditions = quizAnswers.conditions === 'yes'
    const medications = quizAnswers.medications === 'yes'

    let recommendations = []
    let estimatedCosts = []

    if (age >= 65) {
      if (conditions || medications) {
        recommendations.push('Medicare Advantage (Part C) - Comprehensive coverage with prescription drugs included')
        estimatedCosts.push('$0-200/month depending on plan')
      } else {
        recommendations.push('Medicare Supplement (Medigap) - Most comprehensive original Medicare coverage')
        estimatedCosts.push('$100-250/month depending on plan')
      }
      
      if (medications) {
        recommendations.push('Part D Prescription Drug Coverage - Essential for medication management')
        estimatedCosts.push('$20-60/month depending on medications')
      }
    }

    setQuizResults({
      recommendations,
      estimatedCosts,
      eligible: age >= 65,
      details: `Based on your profile: ${age}yo, ${employed ? 'Still employed' : 'Retired'}, Income: $${income}k, ${conditions ? 'Has chronic conditions' : 'No chronic conditions'}, ${medications ? 'Takes multiple medications' : 'No medications'}`
    })
  }

  const calculateIndividualResults = () => {
    const income = parseInt(quizAnswers.ind_income) || 0
    const employees = 0
    const hasPreexisting = quizAnswers.ind_preexisting === 'yes'

    let options = []
    let costs = []

    if (income < 50000) {
      options.push('Explore CoveredCA subsidies - You may qualify for significant tax credits')
      costs.push('Could reduce premium to $0-100/month')
    }
    
    if (income >= 50000 && income < 150000) {
      options.push('CoveredCA marketplace plans with potential subsidies')
      costs.push('$300-600/month depending on plan tier')
    }

    if (income >= 150000) {
      options.push('Private insurance plans outside marketplace')
      costs.push('$400-800/month depending on coverage')
    }

    setQuizResults({
      recommendations: options,
      estimatedCosts: costs,
      eligible: true,
      details: `Income: $${income}k, Pre-existing conditions: ${hasPreexisting ? 'Yes' : 'No'}`
    })
  }

  const calculateGroupResults = () => {
    const employees = parseInt(quizAnswers.group_employees) || 0
    const budget = parseInt(quizAnswers.group_budget) || 0
    const industry = quizAnswers.group_industry || 'Other'

    let options = []
    let costs = []

    if (employees >= 2 && employees <= 50) {
      options.push('SHOP Marketplace plans - Tax credits available for small businesses')
      costs.push(`$250-500 per employee/month depending on plan`)
    }

    if (employees > 50) {
      options.push('Fully insured or self-insured group plans')
      costs.push(`Negotiated rates based on claims history`)
    }

    if (budget < 300) {
      options.push('High-deductible plans with HSAs - Lower premiums')
      costs.push('Reduced employer contribution needed')
    }

    setQuizResults({
      recommendations: options,
      estimatedCosts: costs,
      eligible: employees >= 2,
      details: `Employees: ${employees}, Budget: $${budget}/emp/month, Industry: ${industry}`
    })
  }

  const MedicareContent = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-8 border border-gray-200">
        <h3 className="text-3xl font-bold mb-6">Medicare Coverage Levels Explained</h3>
        
        <div className="space-y-8">
          <div className="border-l-4 border-[#0066cc] pl-6">
            <h4 className="text-2xl font-bold mb-3">Original Medicare (Part A & B)</h4>
            <p className="text-gray-700 mb-4">Federal government insurance for 65+ and certain disabilities</p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>✓ Part A: Hospital insurance (inpatient, skilled nursing, hospice)</li>
              <li>✓ Part B: Medical insurance (doctor visits, outpatient services, equipment)</li>
              <li>• You pay deductibles and copayments</li>
              <li>• No prescription drug coverage</li>
            </ul>
            <p className="text-sm text-gray-600"><strong>2024 Costs:</strong> Part A deductible $1,556/year, Part B deductible $240/year + 20% coinsurance</p>
          </div>

          <div className="border-l-4 border-[#27ae60] pl-6">
            <h4 className="text-2xl font-bold mb-3">Medicare Supplement (Medigap) - Plans A-N</h4>
            <p className="text-gray-700 mb-4">Private insurance that fills gaps in Original Medicare coverage</p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>✓ Covers deductibles, copayments, coinsurance</li>
              <li>✓ Works alongside Original Medicare</li>
              <li>✓ See any doctor who accepts Medicare</li>
              <li>✓ Travel coverage (Plan G)</li>
              <li>• Does NOT cover prescription drugs</li>
            </ul>
            <div className="mt-4 bg-blue-50 p-4 rounded">
              <p className="font-bold mb-2">Popular Plans:</p>
              <p className="text-sm mb-2"><strong>Plan F (Discontinued for new enrollees):</strong> Covers ALL Medicare costs - Most comprehensive</p>
              <p className="text-sm mb-2"><strong>Plan G:</strong> Like Plan F but higher Part B deductible - Best value currently</p>
              <p className="text-sm"><strong>Plan N:</strong> Lower premiums, small copays for doctor visits ($20) and ER ($50)</p>
            </div>
            <p className="text-sm text-gray-600 mt-4"><strong>Typical Costs:</strong> $100-300/month depending on plan and age</p>
          </div>

          <div className="border-l-4 border-[#e74c3c] pl-6">
            <h4 className="text-2xl font-bold mb-3">Medicare Advantage (Part C)</h4>
            <p className="text-gray-700 mb-4">All-in-one alternative to Original Medicare (managed by private insurers)</p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>✓ Prescription drug coverage included (Part D)</li>
              <li>✓ Often $0 monthly premium (covered by Medicare)</li>
              <li>✓ Extra benefits: dental, vision, hearing, fitness</li>
              <li>✓ Simplified - one insurance card</li>
              <li>• Restricted doctor networks (HMO/PPO)</li>
              <li>• Must use in-network providers (except emergencies)</li>
            </ul>
            <div className="mt-4 bg-blue-50 p-4 rounded">
              <p className="font-bold mb-2">Plan Types:</p>
              <p className="text-sm mb-2"><strong>HMO:</strong> Need primary care doctor, most restrictive, lowest costs</p>
              <p className="text-sm mb-2"><strong>PPO:</strong> More freedom with doctors, higher deductibles</p>
              <p className="text-sm"><strong>PFFS:</strong> Private Fee-For-Service, pay per visit, most flexibility</p>
            </div>
            <p className="text-sm text-gray-600 mt-4"><strong>Typical Costs:</strong> $0-100/month premium + copays for services</p>
          </div>

          <div className="border-l-4 border-[#f39c12] pl-6">
            <h4 className="text-2xl font-bold mb-3">Part D - Prescription Drug Coverage</h4>
            <p className="text-gray-700 mb-4">Required for anyone on Original Medicare or certain Medigap plans</p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>✓ Covers brand name and generic medications</li>
              <li>✓ Hundreds of plans available</li>
              <li>✓ Plans differ by formulary (drugs covered)</li>
              <li>• Deductible: $0-505 (2024)</li>
              <li>• Copayments: $10-75 depending on drug tier</li>
              <li>• "Donut hole" coverage gap still exists</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4"><strong>Typical Costs:</strong> $30-100/month depending on medications and plan</p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h4 className="font-bold text-lg mb-3">⚠️ Critical: Late Enrollment Penalties</h4>
            <p className="text-gray-700 mb-3">If you delay enrolling, you pay penalties FOR LIFE:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Part B Penalty:</strong> +10% for each year you delay (permanent)</li>
              <li>• <strong>Part D Penalty:</strong> +1% per month you don't have coverage (permanent)</li>
              <li>• <strong>Medigap Penalty:</strong> Possible denial of coverage in some states</li>
              <li>• Only exceptions: Still working with employer coverage, losing employer coverage</li>
            </ul>
            <p className="mt-4 text-sm"><strong>Enrollment Windows:</strong> Initial (3 months before 65th birthday), Annual (Oct 15-Dec 7), Special Enrollment (life events)</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setShowQuiz('medicare')}
        className="w-full px-8 py-4 bg-[#27ae60] text-white rounded-lg font-bold text-lg hover:bg-[#229954]"
      >
        Take Medicare Coverage Quiz → See What You Qualify For
      </button>
    </div>
  )

  const IndividualContent = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-8 border border-gray-200">
        <h3 className="text-3xl font-bold mb-6">Individual & Family Health Insurance</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-2xl font-bold mb-4">CoveredCA Marketplace (ACA)</h4>
            <p className="text-gray-700 mb-4">California's health insurance marketplace for individuals and families</p>
            <ul className="space-y-2 text-gray-700">
              <li>✓ 4 metal levels: Bronze, Silver, Gold, Platinum</li>
              <li>✓ Tax credits based on household income</li>
              <li>✓ Subsidies can reduce premiums to $0-100/month</li>
              <li>✓ Essential health benefits covered</li>
              <li>✓ No exclusions for pre-existing conditions</li>
            </ul>
            <div className="mt-4 bg-blue-50 p-4 rounded">
              <p className="font-bold mb-2">Income Thresholds for Subsidies (2024):</p>
              <p className="text-sm">Single: $35k-$60k for max subsidies | Family of 4: $73k-$125k</p>
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-bold mb-4">Private Insurance (Off-Exchange)</h4>
            <p className="text-gray-700 mb-4">Direct plans from insurers (not through CoveredCA)</p>
            <ul className="space-y-2 text-gray-700">
              <li>✓ May have different provider networks</li>
              <li>✓ Different plan designs than marketplace</li>
              <li>✗ NO tax credits or subsidies available</li>
              <li>✓ Good if income too high for subsidies</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h4 className="font-bold mb-3">💡 Key Facts About Subsidies</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Subsidies = you pay less, government pays insurer</li>
              <li>• Tax credits = money back at tax time</li>
              <li>• Report income changes immediately (can lose credits)</li>
              <li>• Silver plans have additional cost-sharing reductions</li>
              <li>• Married filing separately may qualify differently</li>
            </ul>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setShowQuiz('individual')}
        className="w-full px-8 py-4 bg-[#0066cc] text-white rounded-lg font-bold text-lg hover:bg-[#003366]"
      >
        Calculate Your Subsidies & Best Plan
      </button>
    </div>
  )

  const GroupContent = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-8 border border-gray-200">
        <h3 className="text-3xl font-bold mb-6">Group Health Plans for Businesses</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-2xl font-bold mb-4">SHOP Marketplace (Small Business)</h4>
            <p className="text-gray-700 mb-4">Federal marketplace for businesses with 2-50 employees</p>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Employer tax credit: Up to 50% of premiums</li>
              <li>✓ Employees choose plan within employer contribution</li>
              <li>✓ No medical underwriting (guaranteed issue)</li>
              <li>✓ Streamlined enrollment and administration</li>
              <li>✓ Average credit: $3,000-5,000 per employee</li>
            </ul>
            <div className="mt-4 bg-blue-50 p-4 rounded">
              <p className="text-sm"><strong>Tax Credit Calculation:</strong> Lesser of (1) 50% of premiums paid OR (2) $7,980 per employee (2024)</p>
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-bold mb-4">Fully Insured vs Self-Insured</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-[#0066cc] pl-4">
                <p className="font-bold mb-2">Fully Insured</p>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>✓ Insurer covers all claims</li>
                  <li>✓ Predictable monthly cost</li>
                  <li>✓ Less claims management burden</li>
                  <li>• Higher premiums</li>
                  <li>• Less control</li>
                </ul>
              </div>
              <div className="border-l-4 border-[#27ae60] pl-4">
                <p className="font-bold mb-2">Self-Insured</p>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>✓ Lower premiums if healthy employees</li>
                  <li>✓ More control over plan design</li>
                  <li>✓ Better ROI with healthy population</li>
                  <li>• Higher upfront risk</li>
                  <li>• Need stop-loss insurance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h4 className="font-bold mb-3">📊 Cost Analysis</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Employee Cost:</strong> Typically 20-50% of premium (employer pays rest)</li>
              <li><strong>Total Employer Cost:</strong> $400-800/employee/month typical</li>
              <li><strong>Administrative:</strong> $10-30/employee/month for brokerage/administration</li>
              <li><strong>Tax Benefits:</strong> Employer premiums are tax-deductible</li>
            </ul>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setShowQuiz('group')}
        className="w-full px-8 py-4 bg-[#16a34a] text-white rounded-lg font-bold text-lg hover:bg-green-700"
      >
        Calculate Group Plan Costs & Tax Credits
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Top Nav with Category Tabs */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('medicare')}
            className={`px-6 py-2 rounded-lg font-bold whitespace-nowrap transition ${
              activeTab === 'medicare' 
                ? 'bg-[#27ae60] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Medicare ⭐
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-6 py-2 rounded-lg font-bold whitespace-nowrap transition ${
              activeTab === 'individual' 
                ? 'bg-[#0066cc] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Individual/Family
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`px-6 py-2 rounded-lg font-bold whitespace-nowrap transition ${
              activeTab === 'group' 
                ? 'bg-[#16a34a] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Group Business
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#003366] to-[#0066cc] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Expert Health Insurance Guidance You Can Trust</h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8">28+ years helping Californians navigate complex coverage options with personalized solutions</p>
        </div>
      </section>

      {/* Active Tab Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'medicare' && <MedicareContent />}
          {activeTab === 'individual' && <IndividualContent />}
          {activeTab === 'group' && <GroupContent />}
        </div>
      </section>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold">
                {showQuiz === 'medicare' && 'Medicare Coverage Quiz'}
                {showQuiz === 'individual' && 'Individual Plan Calculator'}
                {showQuiz === 'group' && 'Group Plan Cost Analyzer'}
              </h3>
              <button onClick={() => { setShowQuiz(null); setQuizResults(null); }} className="text-3xl text-gray-500">×</button>
            </div>

            {!quizResults ? (
              <div className="space-y-6">
                {showQuiz === 'medicare' && (
                  <>
                    <div>
                      <label className="block font-bold mb-2">Age:</label>
                      <input type="number" placeholder="65" onChange={(e) => handleQuizAnswer('age', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">Currently employed?</label>
                      <div className="flex gap-4">
                        <button onClick={() => handleQuizAnswer('employed', 'yes')} className={`px-4 py-2 rounded ${quizAnswers.employed === 'yes' ? 'bg-[#27ae60] text-white' : 'border border-gray-300'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('employed', 'no')} className={`px-4 py-2 rounded ${quizAnswers.employed === 'no' ? 'bg-[#27ae60] text-white' : 'border border-gray-300'}`}>No</button>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold mb-2">Annual income: $</label>
                      <input type="number" placeholder="30000" onChange={(e) => handleQuizAnswer('income', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">Chronic health conditions?</label>
                      <div className="flex gap-4">
                        <button onClick={() => handleQuizAnswer('conditions', 'yes')} className={`px-4 py-2 rounded ${quizAnswers.conditions === 'yes' ? 'bg-[#27ae60] text-white' : 'border border-gray-300'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('conditions', 'no')} className={`px-4 py-2 rounded ${quizAnswers.conditions === 'no' ? 'bg-[#27ae60] text-white' : 'border border-gray-300'}`}>No</button>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold mb-2">Take multiple medications?</label>
                      <div className="flex gap-4">
                        <button onClick={() => handleQuizAnswer('medications', 'yes')} className={`px-4 py-2 rounded ${quizAnswers.medications === 'yes' ? 'bg-[#27ae60] text-white' : 'border border-gray-300'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('medications', 'no')} className={`px-4 py-2 rounded ${quizAnswers.medications === 'no' ? 'bg-[#27ae60] text-white' : 'border border-gray-300'}`}>No</button>
                      </div>
                    </div>
                    <button onClick={calculateMedicareResults} className="w-full px-6 py-3 bg-[#27ae60] text-white rounded-lg font-bold hover:bg-[#229954]">See Your Results</button>
                  </>
                )}

                {showQuiz === 'individual' && (
                  <>
                    <div>
                      <label className="block font-bold mb-2">Annual household income: $</label>
                      <input type="number" placeholder="45000" onChange={(e) => handleQuizAnswer('ind_income', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">Pre-existing conditions?</label>
                      <div className="flex gap-4">
                        <button onClick={() => handleQuizAnswer('ind_preexisting', 'yes')} className={`px-4 py-2 rounded ${quizAnswers.ind_preexisting === 'yes' ? 'bg-[#0066cc] text-white' : 'border border-gray-300'}`}>Yes</button>
                        <button onClick={() => handleQuizAnswer('ind_preexisting', 'no')} className={`px-4 py-2 rounded ${quizAnswers.ind_preexisting === 'no' ? 'bg-[#0066cc] text-white' : 'border border-gray-300'}`}>No</button>
                      </div>
                    </div>
                    <button onClick={calculateIndividualResults} className="w-full px-6 py-3 bg-[#0066cc] text-white rounded-lg font-bold hover:bg-[#003366]">Calculate Subsidies</button>
                  </>
                )}

                {showQuiz === 'group' && (
                  <>
                    <div>
                      <label className="block font-bold mb-2">Number of employees:</label>
                      <input type="number" placeholder="25" onChange={(e) => handleQuizAnswer('group_employees', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">Budget per employee/month: $</label>
                      <input type="number" placeholder="350" onChange={(e) => handleQuizAnswer('group_budget', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">Industry:</label>
                      <select onChange={(e) => handleQuizAnswer('group_industry', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option>Technology</option>
                        <option>Healthcare</option>
                        <option>Retail</option>
                        <option>Manufacturing</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <button onClick={calculateGroupResults} className="w-full px-6 py-3 bg-[#16a34a] text-white rounded-lg font-bold hover:bg-green-700">Calculate Costs & Credits</button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-3">Your Profile:</h4>
                  <p className="text-gray-700">{quizResults.details}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-lg mb-3">Recommended Coverage:</h4>
                    <div className="space-y-3">
                      {quizResults.recommendations.map((rec, i) => (
                        <div key={i} className="bg-blue-50 border border-blue-200 p-4 rounded">
                          <p className="font-bold text-gray-800">{rec}</p>
                          <p className="text-sm text-gray-600 mt-1">{quizResults.estimatedCosts[i]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                  <p className="text-sm text-gray-700"><strong>Next Step:</strong> Schedule a consultation with Linda to explore these options in detail and find the best plan for your situation.</p>
                </div>

                <button className="w-full px-6 py-3 bg-[#27ae60] text-white rounded-lg font-bold hover:bg-[#229954]">Schedule Free Consultation</button>
                <button onClick={() => setQuizResults(null)} className="w-full px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50">Retake Quiz</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#003366] to-[#0066cc] text-white text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Questions About Your Coverage?</h2>
          <p className="text-lg md:text-xl mb-8">Linda specializes in finding the right plan at the right price. Schedule a free consultation today.</p>
          <button className="px-8 py-4 bg-[#27ae60] text-white rounded-lg font-bold hover:bg-[#229954] text-lg">Book Your Free Consultation</button>
        </div>
      </section>
    </div>
  )
}
