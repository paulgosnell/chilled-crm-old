import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getDeals, getTasks } from '@/lib/api';
import { Deal } from '@/types/deal';
import { Task } from '@/types/task';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'deal' | 'task';
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchEventsData = async () => {
      const [deals, tasks] = await Promise.all([getDeals(), getTasks()]);
      const dealEvents = deals.map((deal: Deal) => ({
        id: deal.id,
        title: `Deal: ${deal.name}`,
        start: new Date(deal.close_date),
        end: new Date(deal.close_date),
        type: 'deal' as const,
      }));
      const taskEvents = tasks.map((task: Task) => ({
        id: task.id,
        title: `Task: ${task.title}`,
        start: new Date(task.due_date),
        end: new Date(task.due_date),
        type: 'task' as const,
      }));
      setEvents([...dealEvents, ...taskEvents]);
    };

    fetchEventsData();
  }, []);

  const eventStyleGetter = (event: CalendarEvent) => {
    let style = {
      backgroundColor: event.type === 'deal' ? '#4CAF50' : '#2196F3',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };

  return (
    <div className="h-[400px]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default Calendar;