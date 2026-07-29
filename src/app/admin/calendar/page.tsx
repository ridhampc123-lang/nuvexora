"use client";

import React, { useState } from "react";
import { useAdminMeetingsQuery, useAdminTasksQuery } from "@/hooks/use-api-queries";
import { Calendar as CalendarIcon, Clock, Video, CheckSquare, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const { data: meetings = [], isLoading: loadingMeetings } = useAdminMeetingsQuery();
  const { data: tasks = [], isLoading: loadingTasks } = useAdminTasksQuery();

  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDayEvents = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    
    const dayMeetings = meetings.filter((m: any) => m.meetingDate && new Date(m.meetingDate).toISOString().split('T')[0] === dateStr);
    const dayTasks = tasks.filter((t: any) => t.dueDate && new Date(t.dueDate).toISOString().split('T')[0] === dateStr);

    return { dayMeetings, dayTasks };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Calendar</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View scheduled meetings and task deadlines.</p>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="font-bold text-slate-900 dark:text-white min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 auto-rows-fr">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20"></div>
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            const { dayMeetings, dayTasks } = getDayEvents(day);

            return (
              <div key={`day-${day}`} className={`min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-slate-800/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30 ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                <div className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-700 dark:text-slate-300'}`}>
                  {day}
                </div>
                
                <div className="space-y-1.5">
                  {dayMeetings.map((m: any) => (
                    <div key={m._id} className="flex flex-col gap-0.5 p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                      <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-700 dark:text-indigo-400 truncate">
                        <Video className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{m.title}</span>
                      </div>
                      <div className="text-[8px] text-indigo-600/80 dark:text-indigo-400/80 truncate">{m.timeSlot}</div>
                    </div>
                  ))}
                  
                  {dayTasks.map((t: any) => (
                    <div key={t._id} className="flex items-center gap-1 p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 truncate">
                      <CheckSquare className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
