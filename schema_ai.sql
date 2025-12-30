-- Automotive Database AI & Automation Schema
-- Additional tables for AI predictions, notifications, workflows, and automation
-- Run this after schema.sql and schema_enhancements.sql

-- ============================================================================
-- MAINTENANCE PREDICTIONS (AI/ML)
-- ============================================================================

CREATE TABLE maintenance_prediction (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    predicted_service_date DATE NOT NULL,
    predicted_mileage INTEGER,
    recommended_service_type VARCHAR(100) NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    estimated_cost DECIMAL(10,2),
    prediction_reason TEXT,
    model_version VARCHAR(50) DEFAULT 'v1.0',
    prediction_features JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    dismissed BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_maintenance_prediction_vehicle ON maintenance_prediction(vehicle_id);
CREATE INDEX idx_maintenance_prediction_date ON maintenance_prediction(predicted_service_date);
CREATE INDEX idx_maintenance_prediction_risk ON maintenance_prediction(risk_level);
CREATE INDEX idx_maintenance_prediction_acknowledged ON maintenance_prediction(acknowledged);

-- ============================================================================
-- COST ANOMALY DETECTION
-- ============================================================================

CREATE TABLE cost_anomaly (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_record_id UUID NOT NULL REFERENCES service_record(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    anomaly_type VARCHAR(50) NOT NULL, -- high_cost, unusual_parts, labor_excessive, price_spike
    anomaly_score DECIMAL(5,2),
    expected_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    deviation_percentage DECIMAL(5,2),
    explanation TEXT,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'resolved', 'false_positive')),
    reviewed_by VARCHAR(200),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cost_anomaly_service ON cost_anomaly(service_record_id);
CREATE INDEX idx_cost_anomaly_vehicle ON cost_anomaly(vehicle_id);
CREATE INDEX idx_cost_anomaly_status ON cost_anomaly(status);
CREATE INDEX idx_cost_anomaly_severity ON cost_anomaly(severity);

-- ============================================================================
-- VEHICLE VALUATION HISTORY (AI-Powered)
-- ============================================================================

CREATE TABLE vehicle_valuation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    valuation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    estimated_value DECIMAL(12,2) NOT NULL,
    value_low DECIMAL(12,2),
    value_high DECIMAL(12,2),
    valuation_source VARCHAR(100) DEFAULT 'ai_model', -- ai_model, kbb, edmunds, manual
    confidence_level VARCHAR(20) DEFAULT 'medium',
    market_condition VARCHAR(50), -- strong, normal, weak
    depreciation_factors JSONB,
    comparable_sales JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicle_valuation_vehicle ON vehicle_valuation(vehicle_id);
CREATE INDEX idx_vehicle_valuation_date ON vehicle_valuation(valuation_date);

-- ============================================================================
-- NOTIFICATION SYSTEM
-- ============================================================================

CREATE TABLE notification_rule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN (
        'service_due', 'insurance_expiring', 'inspection_due', 
        'warranty_expiring', 'recall_notice', 'payment_due',
        'document_expiring', 'custom'
    )),
    trigger_condition JSONB NOT NULL,
    notification_channels VARCHAR(50)[] DEFAULT ARRAY['in_app'],
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    template_subject VARCHAR(500),
    template_body TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id UUID REFERENCES notification_rule(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES vehicle(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES owner(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    notification_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    channel VARCHAR(50) DEFAULT 'in_app',
    status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'dismissed', 'actioned')),
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_owner ON notification(owner_id);
CREATE INDEX idx_notification_vehicle ON notification(vehicle_id);
CREATE INDEX idx_notification_status ON notification(status);
CREATE INDEX idx_notification_type ON notification(notification_type);
CREATE INDEX idx_notification_priority ON notification(priority);
CREATE INDEX idx_notification_created ON notification(created_at DESC);

-- ============================================================================
-- WORKFLOW AUTOMATION
-- ============================================================================

CREATE TABLE workflow_template (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('event', 'schedule', 'manual', 'condition')),
    trigger_config JSONB NOT NULL,
    steps JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workflow_instance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES workflow_template(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicle(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES owner(id) ON DELETE SET NULL,
    trigger_data JSONB,
    current_step INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'running' CHECK (status IN ('pending', 'running', 'paused', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    execution_log JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX idx_workflow_instance_template ON workflow_instance(template_id);
CREATE INDEX idx_workflow_instance_status ON workflow_instance(status);
CREATE INDEX idx_workflow_instance_vehicle ON workflow_instance(vehicle_id);

CREATE TABLE workflow_step_execution (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instance_id UUID NOT NULL REFERENCES workflow_instance(id) ON DELETE CASCADE,
    step_index INTEGER NOT NULL,
    step_name VARCHAR(200),
    step_type VARCHAR(50) NOT NULL,
    step_config JSONB,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
    input_data JSONB,
    output_data JSONB,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    error_message TEXT
);

CREATE INDEX idx_workflow_step_instance ON workflow_step_execution(instance_id);
CREATE INDEX idx_workflow_step_status ON workflow_step_execution(status);

-- ============================================================================
-- AI INSIGHTS & ANALYTICS
-- ============================================================================

CREATE TABLE ai_insight (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    insight_type VARCHAR(50) NOT NULL, -- cost_trend, maintenance_pattern, fleet_health, anomaly, recommendation
    category VARCHAR(50) DEFAULT 'general',
    title VARCHAR(300) NOT NULL,
    summary TEXT NOT NULL,
    details JSONB,
    affected_vehicles UUID[],
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'alert', 'critical')),
    confidence_score DECIMAL(3,2),
    action_recommended TEXT,
    action_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(200),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_insight_type ON ai_insight(insight_type);
CREATE INDEX idx_ai_insight_severity ON ai_insight(severity);
CREATE INDEX idx_ai_insight_active ON ai_insight(is_active);
CREATE INDEX idx_ai_insight_created ON ai_insight(created_at DESC);

-- ============================================================================
-- NATURAL LANGUAGE QUERY LOG
-- ============================================================================

CREATE TABLE nl_query_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_query TEXT NOT NULL,
    parsed_query JSONB,
    entities_detected VARCHAR(100)[],
    filters_applied JSONB,
    result_count INTEGER,
    execution_time_ms INTEGER,
    was_successful BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    user_feedback VARCHAR(20), -- helpful, not_helpful, incorrect
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_nl_query_created ON nl_query_log(created_at DESC);

-- ============================================================================
-- VIN DECODE CACHE
-- ============================================================================

CREATE TABLE vin_decode_cache (
    vin VARCHAR(17) PRIMARY KEY,
    manufacturer VARCHAR(200),
    model VARCHAR(200),
    year INTEGER,
    vehicle_type VARCHAR(100),
    body_class VARCHAR(100),
    engine_size VARCHAR(50),
    fuel_type VARCHAR(50),
    transmission VARCHAR(100),
    drive_type VARCHAR(50),
    doors INTEGER,
    plant_city VARCHAR(100),
    plant_country VARCHAR(100),
    raw_response JSONB,
    decoded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '90 days'
);

CREATE INDEX idx_vin_cache_expires ON vin_decode_cache(expires_at);

-- ============================================================================
-- DOCUMENT PROCESSING QUEUE
-- ============================================================================

CREATE TABLE document_processing_job (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES vehicle_document(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicle(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL, -- ocr_extract, classify, validate
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    priority INTEGER DEFAULT 5,
    input_file_url VARCHAR(500),
    extracted_data JSONB,
    confidence_scores JSONB,
    processing_notes TEXT,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_doc_job_status ON document_processing_job(status);
CREATE INDEX idx_doc_job_priority ON document_processing_job(priority DESC);

-- ============================================================================
-- RECALL SYNC STATUS
-- ============================================================================

CREATE TABLE recall_sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sync_type VARCHAR(50) NOT NULL, -- full, incremental, vehicle_check
    vehicles_checked INTEGER DEFAULT 0,
    recalls_found INTEGER DEFAULT 0,
    new_matches INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed',
    duration_seconds INTEGER,
    error_message TEXT,
    sync_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_notification_rule_updated_at BEFORE UPDATE ON notification_rule
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_template_updated_at BEFORE UPDATE ON workflow_template
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS FOR AUTOMATION
-- ============================================================================

-- Function to generate service due notifications
CREATE OR REPLACE FUNCTION generate_service_notifications()
RETURNS INTEGER AS $$
DECLARE
    notification_count INTEGER := 0;
    r RECORD;
BEGIN
    -- Check for vehicles with overdue service based on next_service_due_date
    FOR r IN 
        SELECT DISTINCT ON (v.id)
            v.id as vehicle_id,
            v.owner_id,
            sr.next_service_due_date,
            sr.next_service_due_mileage,
            v.mileage as current_mileage
        FROM vehicle v
        JOIN service_record sr ON sr.vehicle_id = v.id
        WHERE sr.next_service_due_date IS NOT NULL
        AND sr.next_service_due_date <= CURRENT_DATE + INTERVAL '14 days'
        AND NOT EXISTS (
            SELECT 1 FROM notification n
            WHERE n.vehicle_id = v.id
            AND n.notification_type = 'service_due'
            AND n.created_at > CURRENT_DATE - INTERVAL '7 days'
        )
        ORDER BY v.id, sr.service_date DESC
    LOOP
        INSERT INTO notification (
            vehicle_id, owner_id, title, message, priority, 
            notification_type, category, action_url, action_label
        ) VALUES (
            r.vehicle_id,
            r.owner_id,
            'Service Due Soon',
            format('Vehicle service is due on %s or at %s miles.', 
                   r.next_service_due_date, r.next_service_due_mileage),
            CASE 
                WHEN r.next_service_due_date <= CURRENT_DATE THEN 'urgent'
                WHEN r.next_service_due_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'high'
                ELSE 'medium'
            END,
            'service_due',
            'maintenance',
            '/service-records?vehicle_id=' || r.vehicle_id,
            'Schedule Service'
        );
        notification_count := notification_count + 1;
    END LOOP;
    
    RETURN notification_count;
END;
$$ LANGUAGE plpgsql;

-- Function to check for expiring documents
CREATE OR REPLACE FUNCTION generate_expiration_notifications()
RETURNS INTEGER AS $$
DECLARE
    notification_count INTEGER := 0;
    r RECORD;
BEGIN
    -- Insurance expiring
    FOR r IN 
        SELECT ip.id, ip.vehicle_id, v.owner_id, ip.end_date, ip.insurance_company
        FROM insurance_policy ip
        JOIN vehicle v ON v.id = ip.vehicle_id
        WHERE ip.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
        AND NOT EXISTS (
            SELECT 1 FROM notification n
            WHERE n.metadata->>'insurance_policy_id' = ip.id::text
            AND n.created_at > CURRENT_DATE - INTERVAL '7 days'
        )
    LOOP
        INSERT INTO notification (
            vehicle_id, owner_id, title, message, priority,
            notification_type, category, action_url, action_label, metadata
        ) VALUES (
            r.vehicle_id,
            r.owner_id,
            'Insurance Expiring Soon',
            format('Your %s insurance policy expires on %s.', r.insurance_company, r.end_date),
            CASE WHEN r.end_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'urgent' ELSE 'high' END,
            'insurance_expiring',
            'insurance',
            '/insurance',
            'Renew Policy',
            jsonb_build_object('insurance_policy_id', r.id)
        );
        notification_count := notification_count + 1;
    END LOOP;
    
    -- Inspections expiring
    FOR r IN
        SELECT i.id, i.vehicle_id, v.owner_id, i.expiration_date, i.inspection_type
        FROM inspection i
        JOIN vehicle v ON v.id = i.vehicle_id
        WHERE i.expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
        AND NOT EXISTS (
            SELECT 1 FROM notification n
            WHERE n.metadata->>'inspection_id' = i.id::text
            AND n.created_at > CURRENT_DATE - INTERVAL '7 days'
        )
    LOOP
        INSERT INTO notification (
            vehicle_id, owner_id, title, message, priority,
            notification_type, category, action_url, action_label, metadata
        ) VALUES (
            r.vehicle_id,
            r.owner_id,
            'Inspection Expiring',
            format('Your %s inspection expires on %s.', r.inspection_type, r.expiration_date),
            CASE WHEN r.expiration_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'urgent' ELSE 'high' END,
            'inspection_expiring',
            'compliance',
            '/inspections',
            'Schedule Inspection',
            jsonb_build_object('inspection_id', r.id)
        );
        notification_count := notification_count + 1;
    END LOOP;
    
    -- Warranties expiring
    FOR r IN
        SELECT w.id, w.vehicle_id, v.owner_id, w.end_date, w.warranty_type
        FROM warranty w
        JOIN vehicle v ON v.id = w.vehicle_id
        WHERE w.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '60 days'
        AND NOT EXISTS (
            SELECT 1 FROM notification n
            WHERE n.metadata->>'warranty_id' = w.id::text
            AND n.created_at > CURRENT_DATE - INTERVAL '14 days'
        )
    LOOP
        INSERT INTO notification (
            vehicle_id, owner_id, title, message, priority,
            notification_type, category, action_url, action_label, metadata
        ) VALUES (
            r.vehicle_id,
            r.owner_id,
            'Warranty Expiring',
            format('Your %s warranty expires on %s. Consider extending coverage.', r.warranty_type, r.end_date),
            'medium',
            'warranty_expiring',
            'warranty',
            '/warranties',
            'View Options',
            jsonb_build_object('warranty_id', r.id)
        );
        notification_count := notification_count + 1;
    END LOOP;
    
    RETURN notification_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE maintenance_prediction IS 'AI-generated maintenance predictions for vehicles';
COMMENT ON TABLE cost_anomaly IS 'Detected anomalies in service costs for fraud/error detection';
COMMENT ON TABLE vehicle_valuation IS 'AI-powered vehicle value estimates over time';
COMMENT ON TABLE notification_rule IS 'Configurable rules for automatic notification generation';
COMMENT ON TABLE notification IS 'System notifications for users about important events';
COMMENT ON TABLE workflow_template IS 'Reusable workflow automation templates';
COMMENT ON TABLE workflow_instance IS 'Running instances of workflow automations';
COMMENT ON TABLE ai_insight IS 'AI-generated insights and recommendations';
COMMENT ON TABLE nl_query_log IS 'Log of natural language search queries for improvement';
COMMENT ON TABLE vin_decode_cache IS 'Cache of decoded VIN information';
COMMENT ON TABLE document_processing_job IS 'Queue for document OCR and processing jobs';
COMMENT ON TABLE recall_sync_log IS 'Log of recall database synchronization runs';

