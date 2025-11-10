import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import './Components.css';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized.');
      }

      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      const allEvents = [];

      // Service due dates
      const { data: services } = await supabase
        .from('service_record')
        .select(`
          *,
          vehicle:vehicle_id (vin)
        `)
        .gte('next_service_due_date', monthStart.toISOString().split('T')[0])
        .lte('next_service_due_date', monthEnd.toISOString().split('T')[0]);

      if (services) {
        services.forEach(s => {
          allEvents.push({
            id: `service-${s.id}`,
            date: s.next_service_due_date,
            type: 'service',
            title: 'Service Due',
            description: `Vehicle: ${s.vehicle?.vin || 'N/A'}`,
            color: '#4CAF50'
          });
        });
      }

      // Warranty expirations
      const { data: warranties } = await supabase
        .from('warranty')
        .select(`
          *,
          vehicle:vehicle_id (vin)
        `)
        .gte('end_date', monthStart.toISOString().split('T')[0])
        .lte('end_date', monthEnd.toISOString().split('T')[0]);

      if (warranties) {
        warranties.forEach(w => {
          allEvents.push({
            id: `warranty-${w.id}`,
            date: w.end_date,
            type: 'warranty',
            title: 'Warranty Expires',
            description: `Vehicle: ${w.vehicle?.vin || 'N/A'}`,
            color: '#FF9800'
          });
        });
      }

      // Insurance expirations
      const { data: insurance } = await supabase
        .from('insurance_policy')
        .select(`
          *,
          vehicle:vehicle_id (vin)
        `)
        .gte('end_date', monthStart.toISOString().split('T')[0])
        .lte('end_date', monthEnd.toISOString().split('T')[0]);

      if (insurance) {
        insurance.forEach(i => {
          allEvents.push({
            id: `insurance-${i.id}`,
            date: i.end_date,
            type: 'insurance',
            title: 'Insurance Expires',
            description: `Vehicle: ${i.vehicle?.vin || 'N/A'}`,
            color: '#F44336'
          });
        });
      }

      // Inspection expirations
      const { data: inspections } = await supabase
        .from('inspection')
        .select(`
          *,
          vehicle:vehicle_id (vin)
        `)
        .gte('expiration_date', monthStart.toISOString().split('T')[0])
        .lte('expiration_date', monthEnd.toISOString().split('T')[0]);

      if (inspections) {
        inspections.forEach(insp => {
          allEvents.push({
            id: `inspection-${insp.id}`,
            date: insp.expiration_date,
            type: 'inspection',
            title: 'Inspection Expires',
            description: `Vehicle: ${insp.vehicle?.vin || 'N/A'}`,
            color: '#2196F3'
          });
        });
      }

      setEvents(allEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date) => {
    return events.filter(e => isSameDay(new Date(e.date), date));
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading calendar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Calendar View</h1>
        <p>View appointments, due dates, and expirations</p>
      </div>

      <div className="glass-container">
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={previousMonth}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            ← Previous
          </button>
          <h2 style={{ margin: 0 }}>{format(currentDate, 'MMMM yyyy')}</h2>
          <button
            onClick={nextMonth}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Next →
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          marginBottom: '24px'
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{
              padding: '12px',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '14px',
              opacity: 0.7
            }}>
              {day}
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px'
        }}>
          {daysInMonth.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(day)}
                style={{
                  minHeight: '100px',
                  padding: '8px',
                  background: isSelected
                    ? 'rgba(255, 255, 255, 0.15)'
                    : isToday
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isToday
                    ? '2px solid rgba(255, 255, 255, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = isToday ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)';
                }}
              >
                <div style={{
                  fontWeight: isToday ? '700' : '500',
                  marginBottom: '4px',
                  fontSize: '14px'
                }}>
                  {format(day, 'd')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      style={{
                        fontSize: '10px',
                        padding: '2px 4px',
                        background: event.color,
                        borderRadius: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div style={{ fontSize: '10px', opacity: 0.7 }}>
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>
              Events on {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            {getEventsForDate(selectedDate).length === 0 ? (
              <div style={{ opacity: 0.7 }}>No events scheduled</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {getEventsForDate(selectedDate).map(event => (
                  <div
                    key={event.id}
                    style={{
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '6px',
                      borderLeft: `4px solid ${event.color}`
                    }}
                  >
                    <strong>{event.title}</strong>
                    <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
                      {event.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Calendar;

