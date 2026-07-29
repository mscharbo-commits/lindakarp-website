export async function POST(request) {
  try {
    const body = await request.json()
    const { quizType, answers, recommendations } = body

    let prompt = ''
    if (quizType === 'medicare') {
      prompt = `You are an insurance sales coach. Analyze this Medicare lead and provide a brief pitch strategy (3-4 sentences max) for Linda to follow up with them. Their info: Age: ${answers.age}, Employment: ${answers.employed}, Chronic conditions: ${answers.conditions}, Medications: ${answers.medications}. Their recommended plan: ${recommendations[0]}. Give specific talking points focused on their situation.`
    } else if (quizType === 'individual') {
      prompt = `You are an insurance sales coach. Analyze this Individual/Family plan lead and provide a brief pitch strategy (3-4 sentences max) for Linda to follow up with them. Their info: Household size: ${answers.ind_household}, Income: ${answers.ind_income}, Employment: ${answers.ind_employed}, Pre-existing: ${answers.ind_preexisting}. Recommended subsidy level: ${recommendations[0]}. Give specific talking points focused on their savings opportunity.`
    } else if (quizType === 'group') {
      prompt = `You are an insurance sales coach. Analyze this Group benefits lead and provide a brief pitch strategy (3-4 sentences max) for Linda to follow up with them. Their info: Company: ${answers.company || 'Not provided'}, Employees: ${answers.group_employees}, Salary: ${answers.group_salary}, Budget: ${answers.group_budget}. Tax credit available: ${recommendations[0]}. Give specific talking points focused on attracting/retaining talent and tax savings.`
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-1',
        max_tokens: 300,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    })

    if (!response.ok) {
      console.error('Anthropic API error:', response.status, await response.text())
      return Response.json({ error: 'Assessment generation failed' }, { status: response.status })
    }

    const data = await response.json()
    const assessmentText = data.content[0]?.type === 'text' ? data.content[0].text : 'Unable to generate assessment'

    return Response.json({ assessment: assessmentText })
  } catch (error) {
    console.error('API route error:', error)
    return Response.json({ error: 'Server error generating assessment' }, { status: 500 })
  }
}
