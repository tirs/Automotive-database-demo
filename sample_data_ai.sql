-- Sample Data for AI & Automation Features
-- Run this after schema_ai.sql and sample_data_enhancements.sql

-- ============================================================================
-- NOTIFICATION RULES
-- ============================================================================

INSERT INTO notification_rule (id, name, description, rule_type, trigger_condition, notification_channels, priority, template_subject, template_body, is_active)
VALUES
    (uuid_generate_v4(), 'Service Due Reminder', 'Notify owners when service is due within 14 days', 'service_due', 
     '{"days_before": 14, "check_field": "next_service_due_date"}', 
     ARRAY['in_app', 'email'], 'medium',
     'Service Due Soon for Your Vehicle',
     'Your vehicle is due for service on {{due_date}}. Schedule your appointment today to keep your vehicle running smoothly.',
     true),
    
    (uuid_generate_v4(), 'Insurance Expiration Alert', 'Alert owners 30 days before insurance expires', 'insurance_expiring',
     '{"days_before": 30, "check_field": "end_date"}',
     ARRAY['in_app', 'email'], 'high',
     'Your Insurance Policy is Expiring Soon',
     'Your insurance policy expires on {{expiration_date}}. Renew now to maintain continuous coverage.',
     true),
    
    (uuid_generate_v4(), 'Inspection Due Notice', 'Notify owners when inspection is due within 30 days', 'inspection_due',
     '{"days_before": 30, "check_field": "expiration_date"}',
     ARRAY['in_app'], 'high',
     'Vehicle Inspection Due',
     'Your vehicle inspection expires on {{expiration_date}}. Schedule your inspection to stay compliant.',
     true),
    
    (uuid_generate_v4(), 'Warranty Expiration Notice', 'Notify owners 60 days before warranty expires', 'warranty_expiring',
     '{"days_before": 60, "check_field": "end_date"}',
     ARRAY['in_app', 'email'], 'medium',
     'Your Warranty is Expiring',
     'Your warranty coverage ends on {{expiration_date}}. Consider extended warranty options.',
     true),
    
    (uuid_generate_v4(), 'Safety Recall Alert', 'Immediate notification for safety recalls', 'recall_notice',
     '{"immediate": true, "severity": ["high", "critical"]}',
     ARRAY['in_app', 'email', 'sms'], 'urgent',
     'Important Safety Recall Notice',
     'Your vehicle has been affected by a safety recall. Please contact your dealer immediately.',
     true);

-- ============================================================================
-- SAMPLE NOTIFICATIONS
-- ============================================================================

-- Get some vehicle and owner IDs for notifications
DO $$
DECLARE
    v_vehicle_id UUID;
    v_owner_id UUID;
    v_vehicle_record RECORD;
BEGIN
    -- Loop through first 5 vehicles and create notifications
    FOR v_vehicle_record IN 
        SELECT v.id as vehicle_id, v.owner_id 
        FROM vehicle v 
        LIMIT 5
    LOOP
        -- Service due notification
        INSERT INTO notification (vehicle_id, owner_id, title, message, priority, notification_type, category, status, action_url, action_label)
        VALUES (
            v_vehicle_record.vehicle_id,
            v_vehicle_record.owner_id,
            'Service Due Soon',
            'Your vehicle is due for an oil change within the next 14 days.',
            'medium',
            'service_due',
            'maintenance',
            'unread',
            '/service-records',
            'Schedule Service'
        );
        
        -- AI prediction notification
        INSERT INTO notification (vehicle_id, owner_id, title, message, priority, notification_type, category, status, action_url, action_label)
        VALUES (
            v_vehicle_record.vehicle_id,
            v_vehicle_record.owner_id,
            'Maintenance Predicted',
            'AI analysis suggests brake inspection within 30 days based on mileage patterns.',
            'medium',
            'prediction_alert',
            'ai_insights',
            'unread',
            '/predictive-maintenance',
            'View Prediction'
        );
    END LOOP;
    
    -- Create some additional general notifications
    INSERT INTO notification (title, message, priority, notification_type, category, status)
    VALUES 
        ('Fleet Health Report Ready', 'Your weekly fleet health report is now available.', 'low', 'report_ready', 'reports', 'unread'),
        ('New AI Insights Available', '5 new AI-generated insights are ready for review.', 'medium', 'insights_ready', 'ai_insights', 'unread'),
        ('System Update Complete', 'The system has been updated with new predictive maintenance features.', 'low', 'system', 'general', 'read');
END $$;

-- ============================================================================
-- WORKFLOW TEMPLATES
-- ============================================================================

INSERT INTO workflow_template (id, name, description, category, trigger_type, trigger_config, steps, is_active)
VALUES
    (uuid_generate_v4(), 'Post-Service Follow-up', 
     'Send follow-up communication after service completion',
     'customer_engagement', 'event',
     '{"event": "service_record_created", "filter": {"service_type": ["repair", "maintenance"]}}',
     '[{"step_type": "wait", "config": {"hours": 24}, "name": "Wait 24 hours"}, {"step_type": "send_email", "config": {"template": "service_followup", "subject": "How was your recent service?"}, "name": "Send follow-up email"}, {"step_type": "create_notification", "config": {"type": "survey_sent", "priority": "low"}, "name": "Log notification"}]',
     true),
    
    (uuid_generate_v4(), 'Insurance Expiration Reminder Sequence',
     'Multi-step reminder sequence for expiring insurance',
     'compliance', 'schedule',
     '{"schedule": "daily", "condition": "insurance_expiring_in_30_days"}',
     '[{"step_type": "create_notification", "config": {"type": "insurance_expiring", "priority": "high"}, "name": "Create notification"}, {"step_type": "send_email", "config": {"template": "insurance_reminder"}, "name": "Send email reminder"}, {"step_type": "wait", "config": {"days": 7}}, {"step_type": "condition", "config": {"check": "policy_renewed", "if_true": "end"}}, {"step_type": "send_sms", "config": {"template": "urgent_insurance"}, "name": "Send SMS"}]',
     true),
    
    (uuid_generate_v4(), 'New Vehicle Onboarding',
     'Welcome sequence for new vehicles added to the system',
     'onboarding', 'event',
     '{"event": "vehicle_created"}',
     '[{"step_type": "decode_vin", "config": {}, "name": "Decode VIN"}, {"step_type": "check_recalls", "config": {}, "name": "Check recalls"}, {"step_type": "generate_valuation", "config": {}, "name": "Generate valuation"}, {"step_type": "create_notification", "config": {"type": "vehicle_onboarded"}, "name": "Notify owner"}]',
     true),
    
    (uuid_generate_v4(), 'Recall Alert Workflow',
     'Notify owners when a recall affects their vehicle',
     'safety', 'event',
     '{"event": "recall_matched"}',
     '[{"step_type": "create_notification", "config": {"type": "recall_notice", "priority": "urgent"}, "name": "Create urgent notification"}, {"step_type": "send_email", "config": {"template": "recall_alert"}, "name": "Send email"}, {"step_type": "send_sms", "config": {"template": "recall_sms"}, "name": "Send SMS"}, {"step_type": "schedule_followup", "config": {"days": 7}, "name": "Schedule follow-up"}]',
     true),
    
    (uuid_generate_v4(), 'Predictive Maintenance Alert',
     'Alert owners when AI predicts upcoming maintenance needs',
     'maintenance', 'condition',
     '{"condition": "prediction_confidence_high", "threshold": 0.85}',
     '[{"step_type": "create_notification", "config": {"type": "prediction_alert", "priority": "medium"}, "name": "Create prediction alert"}, {"step_type": "wait", "config": {"days": 3}}, {"step_type": "condition", "config": {"check": "service_scheduled", "if_true": "end"}}, {"step_type": "send_email", "config": {"template": "maintenance_reminder"}, "name": "Send reminder"}]',
     true);

-- ============================================================================
-- AI INSIGHTS (Sample Generated Insights)
-- ============================================================================

INSERT INTO ai_insight (insight_type, category, title, summary, details, severity, confidence_score, action_recommended, action_url, is_active, expires_at)
VALUES
    ('cost_trend', 'financial', 'Service Costs Trending Higher',
     'Average service costs have increased by 18% over the past 30 days compared to the previous period.',
     '{"increase_percentage": 18, "previous_avg": 285, "current_avg": 336, "period_days": 30}',
     'warning', 0.87,
     'Review service records for potential optimization opportunities',
     '/service-records', true, CURRENT_TIMESTAMP + INTERVAL '7 days'),
    
    ('maintenance_pattern', 'maintenance', 'High-Mileage Vehicles Need Attention',
     '6 vehicles have exceeded 100,000 miles and may require more frequent maintenance schedules.',
     '{"vehicle_count": 6, "mileage_threshold": 100000, "affected_models": ["Camry", "Accord", "F-150"]}',
     'info', 0.92,
     'Review maintenance intervals for high-mileage fleet vehicles',
     '/vehicles?mileage_gte=100000', true, CURRENT_TIMESTAMP + INTERVAL '14 days'),
    
    ('fleet_health', 'operations', 'Fleet Compliance Status',
     '94% of vehicles have current inspections and insurance. 2 vehicles require immediate attention.',
     '{"compliance_rate": 94, "non_compliant_count": 2, "inspection_issues": 1, "insurance_issues": 1}',
     'alert', 0.95,
     'Address compliance gaps for flagged vehicles',
     '/dashboard', true, CURRENT_TIMESTAMP + INTERVAL '3 days'),
    
    ('anomaly', 'financial', 'Unusual Service Costs Detected',
     '3 service records in the past 30 days show costs significantly above average for their service type.',
     '{"anomaly_count": 3, "avg_deviation": 2.4, "highest_deviation": 3.1}',
     'alert', 0.78,
     'Review flagged service records for accuracy',
     '/service-records', true, CURRENT_TIMESTAMP + INTERVAL '7 days'),
    
    ('recommendation', 'optimization', 'Preventive Maintenance Opportunity',
     'Switching 5 vehicles to preventive maintenance schedules could reduce repair costs by an estimated 22%.',
     '{"vehicle_count": 5, "estimated_savings_percent": 22, "current_repair_costs": 4500}',
     'info', 0.83,
     'Implement preventive maintenance program for identified vehicles',
     '/predictive-maintenance', true, CURRENT_TIMESTAMP + INTERVAL '30 days'),
    
    ('compliance', 'regulatory', 'Inspections Expiring Soon',
     '4 vehicle inspections expire within the next 30 days.',
     '{"expiring_count": 4, "days_range": 30, "earliest_expiration": "2024-02-15"}',
     'warning', 0.98,
     'Schedule inspection appointments for affected vehicles',
     '/inspections', true, CURRENT_TIMESTAMP + INTERVAL '7 days'),
    
    ('compliance', 'safety', 'Open Recalls Require Action',
     '2 vehicles have unaddressed safety recalls that require immediate attention.',
     '{"recall_count": 2, "critical_count": 1, "affected_components": ["airbag", "fuel pump"]}',
     'critical', 0.99,
     'Contact dealers immediately to schedule recall repairs',
     '/recalls', true, CURRENT_TIMESTAMP + INTERVAL '3 days');

-- ============================================================================
-- SAMPLE MAINTENANCE PREDICTIONS
-- ============================================================================

DO $$
DECLARE
    v_vehicle_record RECORD;
    v_predicted_date DATE;
    v_service_types TEXT[] := ARRAY['Oil Change', 'Brake Inspection', 'Tire Rotation', 'Transmission Service', 'Major Service'];
    v_risk_levels TEXT[] := ARRAY['low', 'medium', 'high'];
BEGIN
    FOR v_vehicle_record IN 
        SELECT id, mileage FROM vehicle LIMIT 10
    LOOP
        v_predicted_date := CURRENT_DATE + (random() * 60 + 7)::integer;
        
        INSERT INTO maintenance_prediction (
            vehicle_id, predicted_service_date, predicted_mileage, 
            recommended_service_type, confidence_score, risk_level,
            estimated_cost, prediction_reason, model_version
        ) VALUES (
            v_vehicle_record.id,
            v_predicted_date,
            v_vehicle_record.mileage + (random() * 3000 + 1000)::integer,
            v_service_types[1 + floor(random() * 5)::integer],
            0.75 + random() * 0.2,
            v_risk_levels[1 + floor(random() * 3)::integer],
            50 + random() * 450,
            'Based on current mileage patterns and service history analysis',
            'v1.0.0'
        );
    END LOOP;
END $$;

-- ============================================================================
-- VIN DECODE CACHE (Pre-populate with common VINs)
-- ============================================================================

INSERT INTO vin_decode_cache (vin, manufacturer, model, year, vehicle_type, fuel_type, transmission)
VALUES
    ('1HGBH41JXMN109186', 'Honda', 'Accord', 2021, 'Sedan', 'Gasoline', 'Automatic'),
    ('4T1BF1FK5EU123456', 'Toyota', 'Camry', 2020, 'Sedan', 'Gasoline', 'Automatic'),
    ('5YJ3E1EA7LF654321', 'Tesla', 'Model 3', 2022, 'Sedan', 'Electric', '1-Speed Direct'),
    ('WBAPH5C55BA987654', 'BMW', '3 Series', 2019, 'Sedan', 'Gasoline', 'Automatic'),
    ('1FA6P8CF5J5246810', 'Ford', 'Mustang', 2018, 'Coupe', 'Gasoline', 'Manual'),
    ('1G1YY22G965109876', 'Chevrolet', 'Corvette', 2021, 'Sports Car', 'Gasoline', 'Manual'),
    ('5UXWX9C5XL0123456', 'BMW', 'X3', 2020, 'SUV', 'Gasoline', 'Automatic'),
    ('JTDKN3DU5A0123456', 'Toyota', 'Prius', 2019, 'Hatchback', 'Hybrid', 'CVT');

-- ============================================================================
-- VEHICLE VALUATIONS (Historical valuations)
-- ============================================================================

DO $$
DECLARE
    v_vehicle_record RECORD;
    v_base_value DECIMAL;
BEGIN
    FOR v_vehicle_record IN 
        SELECT id, year, purchase_price FROM vehicle WHERE purchase_price IS NOT NULL LIMIT 8
    LOOP
        v_base_value := COALESCE(v_vehicle_record.purchase_price, 25000);
        
        -- Current valuation
        INSERT INTO vehicle_valuation (
            vehicle_id, valuation_date, estimated_value, value_low, value_high,
            valuation_source, confidence_level, market_condition, depreciation_factors
        ) VALUES (
            v_vehicle_record.id,
            CURRENT_DATE,
            v_base_value * (0.7 + random() * 0.2),
            v_base_value * (0.65 + random() * 0.15),
            v_base_value * (0.8 + random() * 0.15),
            'ai_model',
            'high',
            'normal',
            '{"age_depreciation": -15, "mileage_adjustment": -5, "condition": 0}'::jsonb
        );
        
        -- 6-month ago valuation
        INSERT INTO vehicle_valuation (
            vehicle_id, valuation_date, estimated_value, value_low, value_high,
            valuation_source, confidence_level, market_condition
        ) VALUES (
            v_vehicle_record.id,
            CURRENT_DATE - INTERVAL '6 months',
            v_base_value * (0.75 + random() * 0.2),
            v_base_value * (0.70 + random() * 0.15),
            v_base_value * (0.85 + random() * 0.15),
            'ai_model',
            'medium',
            'normal'
        );
    END LOOP;
END $$;

-- ============================================================================
-- RECALL SYNC LOG
-- ============================================================================

INSERT INTO recall_sync_log (sync_type, vehicles_checked, recalls_found, new_matches, status, duration_seconds, sync_details)
VALUES
    ('full', 25, 8, 3, 'completed', 45, '{"source": "NHTSA", "api_calls": 25}'),
    ('incremental', 5, 1, 1, 'completed', 12, '{"source": "NHTSA", "api_calls": 5}'),
    ('vehicle_check', 1, 2, 2, 'completed', 3, '{"vin": "1HGBH41JXMN109186", "recalls_matched": 2}');

-- ============================================================================
-- SAMPLE COST ANOMALIES
-- ============================================================================

DO $$
DECLARE
    v_service_record RECORD;
BEGIN
    FOR v_service_record IN 
        SELECT sr.id as service_id, sr.vehicle_id, sr.total_cost, sr.service_type
        FROM service_record sr
        WHERE sr.total_cost > 500
        LIMIT 3
    LOOP
        INSERT INTO cost_anomaly (
            service_record_id, vehicle_id, anomaly_type, anomaly_score,
            expected_cost, actual_cost, deviation_percentage, explanation, severity, status
        ) VALUES (
            v_service_record.service_id,
            v_service_record.vehicle_id,
            'high_cost',
            -0.65,
            v_service_record.total_cost * 0.6,
            v_service_record.total_cost,
            66.7,
            format('Service cost of $%s is significantly higher than expected $%s for %s service type',
                   v_service_record.total_cost::text,
                   (v_service_record.total_cost * 0.6)::text,
                   v_service_record.service_type),
            'warning',
            'open'
        );
    END LOOP;
END $$;

-- ============================================================================
-- NATURAL LANGUAGE QUERY LOG (Sample queries)
-- ============================================================================

INSERT INTO nl_query_log (original_query, parsed_query, entities_detected, filters_applied, result_count, execution_time_ms, was_successful)
VALUES
    ('Show all Toyota vehicles', 
     '{"entity": "vehicle", "filters": [{"field": "manufacturer", "operator": "eq", "value": "Toyota"}]}',
     ARRAY['vehicle'], 
     '{"manufacturer": "Toyota"}',
     5, 45, true),
    
    ('Find vehicles with over 100000 miles',
     '{"entity": "vehicle", "filters": [{"field": "mileage", "operator": "gt", "value": 100000}]}',
     ARRAY['vehicle'],
     '{"mileage_gt": 100000}',
     3, 38, true),
    
    ('List overdue inspections',
     '{"entity": "inspection", "filters": [{"field": "expiration_date", "operator": "lt", "value": "2024-01-15"}]}',
     ARRAY['inspection'],
     '{"expiration_date_lt": "2024-01-15"}',
     2, 52, true),
    
    ('How many vehicles have open recalls',
     '{"entity": "vehicle_recall_status", "intent": "count", "filters": [{"field": "status", "operator": "neq", "value": "completed"}]}',
     ARRAY['vehicle_recall_status', 'recall'],
     '{"status_neq": "completed"}',
     4, 67, true);

COMMIT;

