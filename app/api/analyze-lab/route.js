import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import formidable from 'formidable'
import fs from 'fs'
import pdf from 'pdf-parse'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Configure formidable for file parsing
export const config = {
  api: {
    bodyParser: false,
  },
}

// Lab reference ranges for common tests
const labReferenceRanges = {
  // Complete Blood Count
  'WBC': { min: 4.5, max: 11.0, unit: 'K/uL', name: 'White Blood Cells' },
  'RBC': { min: 4.5, max: 5.9, unit: 'M/uL', name: 'Red Blood Cells' },
  'Hemoglobin': { min: 13.5, max: 17.5, unit: 'g/dL', name: 'Hemoglobin' },
  'Hematocrit': { min: 41, max: 53, unit: '%', name: 'Hematocrit' },
  'Platelets': { min: 150, max: 400, unit: 'K/uL', name: 'Platelets' },
  
  // Metabolic Panel
  'Glucose': { min: 70, max: 99, unit: 'mg/dL', name: 'Fasting Glucose' },
  'BUN': { min: 7, max: 20, unit: 'mg/dL', name: 'Blood Urea Nitrogen' },
  'Creatinine': { min: 0.7, max: 1.3, unit: 'mg/dL', name: 'Creatinine' },
  'eGFR': { min: 60, max: null, unit: 'mL/min', name: 'Estimated GFR' },
  
  // Lipid Panel
  'Total Cholesterol': { min: 0, max: 200, unit: 'mg/dL', name: 'Total Cholesterol' },
  'LDL': { min: 0, max: 100, unit: 'mg/dL', name: 'LDL Cholesterol' },
  'HDL': { min: 40, max: null, unit: 'mg/dL', name: 'HDL Cholesterol' },
  'Triglycerides': { min: 0, max: 150, unit: 'mg/dL', name: 'Triglycerides' },
  
  // Thyroid
  'TSH': { min: 0.4, max: 4.0, unit: 'mIU/L', name: 'Thyroid Stimulating Hormone' },
  'Free T4': { min: 0.9, max: 1.7, unit: 'ng/dL', name: 'Free Thyroxine' },
  'Free T3': { min: 2.3, max: 4.2, unit: 'pg/mL', name: 'Free Triiodothyronine' },
  
  // Inflammatory Markers
  'CRP': { min: 0, max: 3.0, unit: 'mg/L', name: 'C-Reactive Protein' },
  'ESR': { min: 0, max: 20, unit: 'mm/hr', name: 'Erythrocyte Sedimentation Rate' },
  
  // Vitamins
  'Vitamin D': { min: 30, max: 100, unit: 'ng/mL', name: 'Vitamin D (25-OH)' },
  'Vitamin B12': { min: 200, max: 900, unit: 'pg/mL', name: 'Vitamin B12' },
  'Folate': { min: 3.0, max: null, unit: 'ng/mL', name: 'Folate' },
}

async function parseLabPDF(buffer) {
  try {
    const data = await pdf(buffer)
    return data.text
  } catch (error) {
    console.error('Error parsing PDF:', error)
    throw new Error('Failed to parse PDF')
  }
}

async function analyzeLabResults(labText, clientInfo = {}) {
  const systemPrompt = `You are an expert functional medicine practitioner analyzing lab results for truck drivers. 
Your analysis should focus on:
1. Identifying values outside optimal ranges (not just reference ranges)
2. Patterns that indicate metabolic, inflammatory, or hormonal imbalances
3. Specific concerns for truck drivers (sedentary lifestyle, irregular sleep, poor diet access)
4. Practical, actionable recommendations

Provide your analysis in the following JSON format:
{
  "summary": "Brief overview of overall health status",
  "flaggedValues": [
    {
      "marker": "Marker name",
      "value": "Actual value",
      "unit": "Unit",
      "status": "high/low/optimal",
      "concern": "Why this is concerning",
      "optimalRange": "Optimal range for this marker"
    }
  ],
  "patterns": [
    {
      "pattern": "Pattern name",
      "description": "What this pattern indicates",
      "markers": ["List of markers involved"]
    }
  ],
  "recommendations": {
    "immediate": ["Actions to take immediately"],
    "shortTerm": ["1-4 week recommendations"],
    "longTerm": ["1-3 month recommendations"]
  },
  "supplements": [
    {
      "name": "Supplement name",
      "dosage": "Recommended dosage",
      "timing": "When to take",
      "reason": "Why this is recommended"
    }
  ],
  "followUp": {
    "tests": ["Additional tests to consider"],
    "timeline": "When to retest"
  }
}`

  const userPrompt = `Analyze these lab results for a truck driver:

${labText}

Client Information:
- Occupation: Professional truck driver
- Age: ${clientInfo.age || 'Not specified'}
- Main concerns: ${clientInfo.concerns || 'General health optimization'}

Please provide a comprehensive functional medicine analysis.`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    })

    const analysis = JSON.parse(response.choices[0].message.content)
    return analysis
  } catch (error) {
    console.error('OpenAI analysis error:', error)
    throw new Error('Failed to analyze lab results')
  }
}

export async function POST(request) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Parse the form data
    const form = formidable({})
    const [fields, files] = await form.parse(request)
    
    const file = files.labFile?.[0]
    const clientId = fields.clientId?.[0]
    const testType = fields.testType?.[0] || 'Comprehensive Metabolic Panel'
    const testDate = fields.testDate?.[0] || new Date().toISOString()

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Read and parse the PDF
    const buffer = await fs.promises.readFile(file.filepath)
    const labText = await parseLabPDF(buffer)

    // Get client information from Supabase
    const supabase = createServerSupabaseClient()
    let clientInfo = {}
    
    if (clientId) {
      const { data: client } = await supabase
        .from('clients')
        .select('age, health_concerns')
        .eq('id', clientId)
        .single()
      
      if (client) {
        clientInfo = {
          age: client.age,
          concerns: client.health_concerns
        }
      }
    }

    // Analyze with AI
    const analysis = await analyzeLabResults(labText, clientInfo)

    // Save to database
    const { data: labResult, error: dbError } = await supabase
      .from('lab_results')
      .insert({
        client_id: clientId,
        test_date: testDate,
        test_type: testType,
        results: { raw_text: labText },
        ai_analysis: JSON.stringify(analysis),
        flagged_values: analysis.flaggedValues,
        status: 'ai_analyzed'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save analysis' },
        { status: 500 }
      )
    }

    // Clean up temp file
    await fs.promises.unlink(file.filepath)

    return NextResponse.json({
      success: true,
      labResultId: labResult.id,
      analysis: analysis
    })

  } catch (error) {
    console.error('Lab analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze lab results' },
      { status: 500 }
    )
  }
} 