import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const formData = await request.json();
    console.log('Received form data:', formData);
    
    // Validate required fields
    if (!formData.driverProfile?.name || !formData.driverProfile?.email) {
      return NextResponse.json(
        { error: 'Driver name and email are required' },
        { status: 400 }
      );
    }

    // Prepare data for database insertion
    const assessmentData = {
      // Driver Profile
      driver_name: formData.driverProfile.name,
      age: parseInt(formData.driverProfile.age) || null,
      email: formData.driverProfile.email,
      phone: formData.driverProfile.phone || null,
      years_driving: parseInt(formData.driverProfile.experience) || null,
      route_type: formData.driverProfile.routeType || null,
      
      // Equipment & Setup
      truck_type: formData.equipmentSetup?.truckType || null,
      has_sleeper: formData.equipmentSetup?.hasSleeper || null,
      equipment_available: formData.equipmentSetup?.availableEquipment || [],
      workspace_comfort_rating: parseInt(formData.equipmentSetup?.workspaceComfort) || null,
      
      // Current Health
      health_rating: parseInt(formData.currentHealth?.overallHealth) || null,
      energy_level: parseInt(formData.currentHealth?.energyLevel) || null,
      health_concerns: formData.currentHealth?.healthConcerns || [],
      current_medications: formData.currentHealth?.medications || null,
      recent_health_changes: formData.currentHealth?.recentChanges || null,
      
      // Lifestyle Factors
      sleep_quality: parseInt(formData.lifestyleFactors?.sleepQuality) || null,
      average_sleep_hours: parseFloat(formData.lifestyleFactors?.sleepHours) || null,
      stress_level: parseInt(formData.lifestyleFactors?.stressLevel) || null,
      exercise_frequency: formData.lifestyleFactors?.exerciseFrequency || null,
      diet_quality: parseInt(formData.lifestyleFactors?.dietQuality) || null,
      hydration_level: parseInt(formData.lifestyleFactors?.hydrationLevel) || null,
      
      // Health Goals
      primary_goals: formData.healthGoals?.primaryGoals || [],
      commitment_level: parseInt(formData.healthGoals?.commitmentLevel) || null,
      biggest_challenges: formData.healthGoals?.challenges || null,
      previous_attempts: formData.healthGoals?.previousAttempts || null,
      support_system: formData.healthGoals?.supportSystem || null,
      
      // Store complete form data as backup
      assessment_data: formData,
      status: 'submitted'
    };

    console.log('Prepared assessment data:', assessmentData);

    // Insert data into Supabase
    const { data, error: dbError } = await supabase
      .from('driver_assessments')
      .insert([assessmentData])
      .select('id')
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save assessment data', details: dbError.message },
        { status: 500 }
      );
    }

    console.log('Data saved successfully:', data);

    // Send notification email to Kevin
    try {
      await resend.emails.send({
        from: 'Driver Health Assessment <noreply@letstruck.com>',
        to: [process.env.NOTIFICATION_EMAIL],
        subject: `New Health Assessment - ${formData.driverProfile.name}`,
        html: createNotificationEmail(formData, data.id),
      });
      console.log('Notification email sent successfully');
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to driver
    try {
      await resend.emails.send({
        from: 'Kevin Rutherford, FNTP <noreply@letstruck.com>',
        to: [formData.driverProfile.email],
        subject: 'Health Assessment Received - Next Steps',
        html: createConfirmationEmail(formData.driverProfile.name),
      });
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      assessmentId: data.id
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Email template for Kevin (notification)
function createNotificationEmail(formData, assessmentId) {
  const profile = formData.driverProfile || {};
  const health = formData.currentHealth || {};
  const goals = formData.healthGoals || {};
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Health Assessment</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; max-width: 600px; margin: 0 auto; }
        .section { margin-bottom: 25px; padding: 15px; border-left: 4px solid #2563eb; background: #f8fafc; }
        .section h3 { margin-top: 0; color: #2563eb; }
        .priority { background: #fef3c7; border-left-color: #f59e0b; }
        .priority h3 { color: #f59e0b; }
        ul { margin: 0; padding-left: 20px; }
        .footer { background: #f1f5f9; padding: 15px; text-align: center; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚛 New Driver Health Assessment</h1>
        <p>Assessment ID: ${assessmentId}</p>
      </div>
      
      <div class="content">
        <div class="section priority">
          <h3>📋 Driver Profile</h3>
          <p><strong>Name:</strong> ${profile.name || 'Not provided'}</p>
          <p><strong>Email:</strong> ${profile.email || 'Not provided'}</p>
          <p><strong>Phone:</strong> ${profile.phone || 'Not provided'}</p>
          <p><strong>Age:</strong> ${profile.age || 'Not provided'}</p>
          <p><strong>Years Driving:</strong> ${profile.experience || 'Not provided'}</p>
          <p><strong>Route Type:</strong> ${profile.routeType || 'Not provided'}</p>
        </div>

        <div class="section">
          <h3>🏥 Current Health Status</h3>
          <p><strong>Overall Health Rating:</strong> ${health.overallHealth || 'Not rated'}/10</p>
          <p><strong>Energy Level:</strong> ${health.energyLevel || 'Not rated'}/10</p>
          ${health.healthConcerns && health.healthConcerns.length > 0 ? `
            <p><strong>Health Concerns:</strong></p>
            <ul>${health.healthConcerns.map(concern => `<li>${concern}</li>`).join('')}</ul>
          ` : ''}
          ${health.medications ? `<p><strong>Current Medications:</strong> ${health.medications}</p>` : ''}
        </div>

        <div class="section">
          <h3>🎯 Health Goals</h3>
          ${goals.primaryGoals && goals.primaryGoals.length > 0 ? `
            <p><strong>Primary Goals:</strong></p>
            <ul>${goals.primaryGoals.map(goal => `<li>${goal}</li>`).join('')}</ul>
          ` : ''}
          <p><strong>Commitment Level:</strong> ${goals.commitmentLevel || 'Not rated'}/10</p>
          ${goals.challenges ? `<p><strong>Biggest Challenges:</strong> ${goals.challenges}</p>` : ''}
        </div>
      </div>

      <div class="footer">
        <p>View full assessment details in your Supabase dashboard</p>
        <p>Submitted: ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;
}

// Email template for driver (confirmation)
function createConfirmationEmail(driverName) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Health Assessment Received</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; max-width: 600px; margin: 0 auto; }
        .section { margin-bottom: 25px; }
        .highlight { background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚛 Health Assessment Received!</h1>
        <p>Thank you for taking the first step toward better health</p>
      </div>
      
      <div class="content">
        <p>Hello ${driverName},</p>
        
        <div class="highlight">
          <p><strong>Great news!</strong> I've successfully received your comprehensive health assessment. This is an important first step in your journey toward better health and vitality on the road.</p>
        </div>

        <div class="section">
          <h3>🔍 What Happens Next?</h3>
          <p><strong>Within 24-48 hours,</strong> I'll review your assessment and create a personalized action plan based on:</p>
          <ul>
            <li>Your current health status and energy levels</li>
            <li>Your specific health goals and challenges</li>
            <li>Your lifestyle and work schedule constraints</li>
            <li>Evidence-based functional medicine approaches</li>
          </ul>
        </div>

        <div class="section">
          <h3>📞 Personal Follow-Up</h3>
          <p>I'll be reaching out personally to discuss:</p>
          <ul>
            <li><strong>Personalized recommendations</strong> for your specific situation</li>
            <li><strong>Natural solutions</strong> that work with your driving schedule</li>
            <li><strong>Root cause approaches</strong> to address underlying health issues</li>
            <li><strong>Practical implementation</strong> strategies you can start immediately</li>
          </ul>
        </div>

        <div class="highlight">
          <p><strong>Remember:</strong> Small, consistent changes lead to big improvements in energy, health, and quality of life. You've already taken the hardest step by completing this assessment!</p>
        </div>
      </div>

      <div class="footer">
        <p><strong>Kevin Rutherford, FNTP</strong><br>
        Functional Nutritional Therapy Practitioner<br>
        Specializing in Driver Health & Wellness</p>
        
        <p>📧 <a href="mailto:support@letstruck.com">support@letstruck.com</a><br>
        🌐 <a href="https://letstruck.com">letstruck.com</a></p>
        
        <p><em>Questions? Reply to this email - I personally read and respond to every message.</em></p>
      </div>
    </body>
    </html>
  `;
}
