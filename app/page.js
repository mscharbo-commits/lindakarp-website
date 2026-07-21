'use client'
import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('medigap')
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#003366] to-[#0066cc] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Expert Health Insurance Guidance You Can Trust</h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl">28+ years helping individuals, groups, and seniors find the right coverage</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-[#27ae60] text-white rounded-lg font-medium hover:bg-[#229954]">Schedule Consultation</button>
            <a href="#services" className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-[#0066cc]">Learn More</a>
          </div>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div><p className="text-4xl font-bold">28+</p><p className="text-gray-200">Years</p></div>
            <div><p className="text-4xl font-bold">500+</p><p className="text-gray-200">Clients</p></div>
            <div><p className="text-4xl font-bold">3</p><p className="text-gray-200">Services</p></div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Our Services</h2>
          <p className="text-center text-gray-600 mb-12">Comprehensive insurance solutions tailored to your needs</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-200 p-8 rounded-lg hover:shadow-lg transition">
              <h3 className="text-2xl font-bold mb-4">Individual & Family Plans</h3>
              <p className="text-gray-600 mb-6">CoveredCA enrollment, private options, subsidy optimization, and ongoing support for your family's coverage needs.</p>
              <button onClick={() => setShowForm(true)} className="w-full px-6 py-3 bg-[#0066cc] text-white rounded-lg hover:bg-[#003366]">Get Quote</button>
            </div>
            <div className="border border-gray-200 p-8 rounded-lg hover:shadow-lg transition">
              <h3 className="text-2xl font-bold mb-4">Group Health Plans</h3>
              <p className="text-gray-600 mb-6">SHOP marketplace guidance, private plans, compliance support, and benefits analysis for your business.</p>
              <button onClick={() => setShowForm(true)} className="w-full px-6 py-3 bg-[#0066cc] text-white rounded-lg hover:bg-[#003366]">Explore</button>
            </div>
            <div className="border-2 border-[#27ae60] p-8 rounded-lg bg-green-50 hover:shadow-lg transition">
              <h3 className="text-2xl font-bold mb-4">Medicare Plans</h3>
              <p className="text-gray-600 mb-6">Expert guidance on Supplement, Advantage, and Part D plans. Navigate Medicare with confidence.</p>
              <button onClick={() => setShowForm(true)} className="w-full px-6 py-3 bg-[#27ae60] text-white rounded-lg hover:bg-[#229954]">Consult</button>
            </div>
          </div>
        </div>
      </section>

      {/* Medicare Tab Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Medicare Made Simple</h2>
          <p className="text-xl text-gray-600 mb-12">Understanding your options when turning 65 or already enrolled</p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setActiveTab('medigap')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'medigap' ? 'bg-[#0066cc] text-white' : 'bg-white border border-gray-300'}`}>Medicare Supplement</button>
            <button onClick={() => setActiveTab('advantage')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'advantage' ? 'bg-[#0066cc] text-white' : 'bg-white border border-gray-300'}`}>Medicare Advantage</button>
            <button onClick={() => setActiveTab('partd')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'partd' ? 'bg-[#0066cc] text-white' : 'bg-white border border-gray-300'}`}>Part D Rx</button>
            <button onClick={() => setActiveTab('enrollment')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'enrollment' ? 'bg-[#0066cc] text-white' : 'bg-white border border-gray-300'}`}>Enrollment</button>
          </div>

          <div className="bg-white rounded-lg p-8">
            {activeTab === 'medigap' && (
              <div>
                <h3 className="text-3xl font-bold mb-6">Medicare Supplement (Medigap)</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-700 mb-6">Medicare Supplement plans work alongside Original Medicare to cover costs that Medicare doesn't pay, like copayments and deductibles.</p>
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ Comprehensive coverage options</li>
                      <li>✓ Expert plan comparisons</li>
                      <li>✓ Cost optimization</li>
                      <li>✓ Enrollment guidance</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-lg mb-4">Why Choose Us?</h4>
                    <p className="text-gray-700 mb-4">Linda matches your healthcare needs with the most cost-effective plans. With 28+ years of experience, she navigates complex options to find your best fit.</p>
                    <button onClick={() => setShowForm(true)} className="w-full px-6 py-3 bg-[#27ae60] text-white rounded-lg hover:bg-[#229954]">Learn More</button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'advantage' && (
              <div>
                <h3 className="text-3xl font-bold mb-6">Medicare Advantage (Part C)</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-700 mb-6">Comprehensive alternatives to Original Medicare that include prescription drug coverage and extra benefits like dental and vision.</p>
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ All-in-one coverage</li>
                      <li>✓ Prescription drugs included</li>
                      <li>✓ Extra benefits</li>
                      <li>✓ Network management</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-lg mb-4">Why Choose Us?</h4>
                    <p className="text-gray-700 mb-4">Linda helps you navigate HMO, PPO, and PFFS options to find coverage that meets your healthcare preferences and budget.</p>
                    <button onClick={() => setShowForm(true)} className="w-full px-6 py-3 bg-[#27ae60] text-white rounded-lg hover:bg-[#229954]">Learn More</button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'partd' && (
              <div>
                <h3 className="text-3xl font-bold mb-6">Part D Prescription Drug Coverage</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-700 mb-6">Essential prescription drug coverage to manage medications affordably. Coverage includes deductibles, co-pays, and donut hole protection.</p>
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ Medication matching</li>
                      <li>✓ Cost comparisons</li>
                      <li>✓ Coverage optimization</li>
                      <li>✓ Annual reviews</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-lg mb-4">Why Choose Us?</h4>
                    <p className="text-gray-700 mb-4">We analyze your current medications to find plans that cover them at the lowest cost, saving you hundreds annually.</p>
                    <button onClick={() => setShowForm(true)} className="w-full px-6 py-3 bg-[#27ae60] text-white rounded-lg hover:bg-[#229954]">Learn More</button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'enrollment' && (
              <div>
                <h3 className="text-3xl font-bold mb-6">Medicare Enrollment Periods</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-700 mb-6">Understanding enrollment deadlines is crucial to avoid permanent penalties. Different periods apply for different situations.</p>
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ Initial Enrollment Period</li>
                      <li>✓ Annual Enrollment Period</li>
                      <li>✓ Special Enrollment Periods</li>
                      <li>✓ Penalty avoidance</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-lg mb-4">Why Choose Us?</h4>
                    <p className="text-gray-700 mb-4">We guide you through enrollment timelines and deadlines to ensure you never miss important dates or incur unnecessary penalties.</p>
                    <button onClick={() => setShowForm(true)} className="w-full px-6 py-3 bg-[#27ae60] text-white rounded-lg hover:bg-[#229954]">Learn More</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Why Choose Linda Karp?</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#27ae60] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">✓</div>
                <div><h3 className="font-bold text-lg">28+ Years Experience</h3><p className="text-gray-600">Deep expertise in health insurance</p></div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#27ae60] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">✓</div>
                <div><h3 className="font-bold text-lg">Personalized Guidance</h3><p className="text-gray-600">One-on-one consultations</p></div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#27ae60] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">✓</div>
                <div><h3 className="font-bold text-lg">Complete Service</h3><p className="text-gray-600">Support from enrollment to claims</p></div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#27ae60] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">✓</div>
                <div><h3 className="font-bold text-lg">No Hidden Costs</h3><p className="text-gray-600">Compensated by insurance carriers</p></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#003366] to-[#0066cc] text-white p-8 rounded-lg">
              <h3 className="text-3xl font-bold mb-8">Client Testimonial</h3>
              <p className="text-lg mb-6 italic">"Linda took the time to understand my needs and saved me hundreds of dollars monthly."</p>
              <p className="font-bold">— Sarah M., Medicare Beneficiary</p>
              <p className="text-sm text-gray-200 mt-6">Rated 4.9/5 by 200+ clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#003366] to-[#0066cc] text-white text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl mb-8">Schedule a free consultation with Linda today</p>
          <button onClick={() => setShowForm(true)} className="px-8 py-3 bg-[#27ae60] text-white rounded-lg font-medium hover:bg-[#229954] text-lg">Schedule Now</button>
        </div>
      </section>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Get Started</h3>
              <button onClick={() => setShowForm(false)} className="text-2xl text-gray-500">×</button>
            </div>
            <form className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              <input type="email" placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              <input type="tel" placeholder="Phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Individual/Family Plans</option>
                <option>Group Plans</option>
                <option>Medicare Plans</option>
              </select>
              <button type="submit" className="w-full px-6 py-3 bg-[#27ae60] text-white rounded-lg font-medium hover:bg-[#229954]">Request Consultation</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
