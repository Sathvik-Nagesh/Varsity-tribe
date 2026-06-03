'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEventStore } from '@/stores/useEventStore';
import { 
  IconCalendarEvent, 
  IconMapPin, 
  IconUsers, 
  IconCheck,
  IconClock,
  IconVideo
} from '@tabler/icons-react';
import Link from 'next/link';
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/layout/Container";

export default function EventsPage() {
  const { events, toggleRsvp } = useEventStore();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'rsvpd'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const now = new Date();
  const filteredEvents = events.filter(e => {
    if (filter === 'upcoming') return new Date(e.date) >= now;
    if (filter === 'past') return new Date(e.date) < now;
    if (filter === 'rsvpd') return (e as any).isRsvpd || (e as any).isRsvped;
    return true;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <PageLayout>
      <Container>
        <div className="pb-8">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Events & Meetups</h1>
              <p className="text-slate-500">Discover and join events in the Varsity Tribe community.</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                {['all', 'upcoming', 'past', 'rsvpd'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      filter === f ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {f === 'rsvpd' ? 'My RSVPs' : f}
                  </button>
                ))}
              </div>

              <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                  title="List View"
                >
                  <IconCalendarEvent size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                  title="Calendar View"
                >
                  <IconMapPin size={20} />
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'list' ? (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents?.map((event: any) => (
                <motion.div key={event.id} variants={item} className="bg-white border border-slate-200 shadow-sm flex flex-col rounded-2xl overflow-hidden group">
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden flex items-center justify-center">
                    <IconCalendarEvent size={64} className="text-blue-200 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-white/90 shadow-sm px-3 py-1 rounded-lg text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      {event.type || 'Workshop'}
                    </div>
                    {event.isOnline && (
                      <div className="absolute top-4 right-4 bg-blue-600/90 shadow-sm px-2 py-1 rounded-lg text-xs font-medium text-white flex items-center">
                        <IconVideo size={14} className="mr-1" /> Online
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium mb-3">
                      <IconClock size={16} />
                      <span>{event.date || 'Oct 24, 2026 • 2:00 PM'}</span>
                    </div>
                    
                    <Link href={`/events/${event.id}`}>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-1">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <div className="flex -space-x-2">
                        {(event.speakers || []).slice(0, 3).map((speaker: any, i: number) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 z-10" style={{ zIndex: 10 - i }}>
                            {speaker.name?.charAt(0) || 'S'}
                          </div>
                        ))}
                        {event.speakers?.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-xs font-medium text-slate-400 z-0">
                            +{event.speakers.length - 3}
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => toggleRsvp(event.id)}
                        className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          event.isRsvpd 
                            ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                        }`}
                      >
                        {event.isRsvpd ? (
                          <>
                            <IconCheck size={16} className="mr-1.5" />
                            Attending
                          </>
                        ) : 'RSVP'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {(!filteredEvents || filteredEvents.length === 0) && (
                <div className="col-span-full py-20 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 shadow-sm">
                  No events found for this category.
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-center"
            >
              <div className="grid grid-cols-7 gap-4 mb-4 text-sm font-medium text-slate-500">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 text-slate-700 font-medium transition-colors cursor-pointer">
                    <span className={i === 15 ? "w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md" : ""}>
                      {(i % 31) + 1}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </Container>
    </PageLayout>
  );
}
