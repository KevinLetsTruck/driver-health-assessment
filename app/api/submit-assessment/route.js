import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const assessmentData = await request.json()
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('driver_assessments')
      .insert([{
        full_name: assessmentData.fullName,
        email: assessmentData.email,
        phone: assessmentData.phone,
        age: assessmentData.age,
        years_driving: assessmentData.yearsDriving,
        route_type: assessmentData.routeType,
        truck_type: assessmentData.truckType,
        sleeper_size: assessmentData.sleeperSize,
        equipment: assessmentData.equipment,
        overall_health: assessmentData.overallHealth,
        energy_level: assessmentData.energyLevel,
        health_concerns: assessmentData.healthConcerns,
        medications: assessmentData.medications,
        sleep_quality: assessmentData.sleepQuality,
        stress_level: assessmentData.stressLevel,
        exercise_frequency: assessmentData.exerciseFreq,
        sleep_hours: assessmentData.sleepHours,
        primary_goal: assessmentData.primaryGoal,
        commitment_level: assessmentData.commitmentLevel,
        additional_goals: assessmentData.additionalGoals,
        submitted_at: assessmentData.submittedAt,
        completed_sections: assessmentData.completedSections
      }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Send email notification
    try {
      await resend.emails.send({
        from: 'Driver Health Assessment <noreply@letstruck.com>',
        to: [process.env.NOTIFICATION_EMAIL],
        subject: `New Driver Health Assessment - ${assessmentData.fullName}`,
        html: `
          <h2>New Driver Health Assessment Submitted</h2>
          <p><strong>Driver:</strong> ${assessmentData.fullName}</p>
          <p><strong>Email:</strong> ${assessmentData.email}</p>
          <p><strong>Phone:</strong> ${assessmentData.phone || 'Not provided'}</p>
          <p><strong>Experience:</strong> ${assessmentData.yearsDriving}</p>
          <p><strong>Route Type:</strong> ${assessmentData.routeType}</p>
          <p><strong>Primary Goal:</strong> ${assessmentData.primaryGoal}</p>
          <p><strong>Commitment Level:</strong> ${assessmentData.commitmentLevel}</p>
          <p><strong>Submitted:</strong> ${new Date(assessmentData.submittedAt).toLocaleString()}</p>
          
          <h3>Next Steps:</h3>
          <ul>
            <li>Review complete assessment in Supabase dashboard</li>
            <li>Contact driver within 24-48 hours</li>
            <li>Schedule initial consultation</li>
          </ul>
        `
      })
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Assessment submitted successfully',
      id: data[0].id 
    })

  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit assessment' },
      { status: 500 }
    )
  }
}