'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useEventStore } from '@/stores/useEventStore';
import { motion } from 'framer-motion';
import { 
  IconArrowLeft,
  IconCalendarEvent,
  IconClock,
  IconMapPin,
  IconUsers,
  IconCheck,
  IconShare,
  IconTicket
} from '@tabler/icons-react';
import Link from 'next/link';
import { PageLayout } from "@/components/layout/PageLayout";

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const getEvent = useEventStore((s: any) => s.getEvent);
  const toggleRsvp = useEventStore((s: any) => s.toggleRsvp);
  
  const event = getEvent ? getEvent(id) : null;

  if (!event) {
    return (
      <div className="py-12 px-4 max-w-4xl mx-auto">
        <Link href="/events" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors">
          <IconArrowLeft size={20} className="mr-2" />
          Back to Events
        </Link>
        <div className="glass-strong rounded-2xl p-12 text-center text-zinc-500">
          Event not found or loading...
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
        <div className="pb-12">
          {/* Banner */}
          <div className="h-[300px] md:h-[400px] w-full bg-gradient-to-r from-blue-900 to-indigo-900 relative">
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 max-w-[1200px] mx-auto px-4 flex flex-col justify-end pb-8">
              <Link href="/events" className="absolute top-8 left-4 inline-flex items-center text-zinc-300 hover:text-white bg-black/30 px-4 py-2 rounded-lg backdrop-blur-md transition-colors">
                <IconArrowLeft size={20} className="mr-2" />
                Back
              </Link>
              
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-blue-600 rounded-lg text-xs font-semibold text-white uppercase tracking-wider">
                  {event.type || 'Masterclass'}
                </span>
                {event.isOnline && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-semibold text-white uppercase tracking-wider">
                    Online
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-3xl leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-zinc-100 mb-4">About this event</h2>
                <div className="prose prose-invert max-w-none text-zinc-300 whitespace-pre-wrap">
                  {event.description || "Join us for an exciting event filled with learning and networking. Detailed description goes here."}
                </div>
              </motion.div>

              {/* Speakers */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-strong rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-zinc-100 mb-6">Speakers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(event.speakers || []).map((speaker: any, i: number) => (
                    <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex-shrink-0 flex items-center justify-center text-xl font-bold text-white">
                        {speaker.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-100">{speaker.name}</h4>
                        <p className="text-sm text-zinc-400">{speaker.role}</p>
                      </div>
                    </div>
                  ))}
                  {(!event.speakers || event.speakers.length === 0) && (
                    <div className="col-span-2 text-zinc-500 text-sm">Speakers to be announced.</div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-strong rounded-2xl p-6"
              >
                <div className="space-y-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/5 rounded-xl text-blue-400">
                      <IconCalendarEvent size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">{event.date || 'October 24, 2026'}</p>
                      <p className="text-sm text-zinc-400">Add to calendar</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/5 rounded-xl text-purple-400">
                      <IconClock size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">{event.time || '2:00 PM - 5:00 PM EST'}</p>
                      <p className="text-sm text-zinc-400">{event.duration || '3 hours'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/5 rounded-xl text-green-400">
                      <IconMapPin size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">{event.location || 'Online via Zoom'}</p>
                      <p className="text-sm text-zinc-400">Link provided upon registration</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/5 rounded-xl text-orange-400">
                      <IconUsers size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">{event.registeredCount || 0} Registered</p>
                      <p className="text-sm text-zinc-400">Capacity: {event.capacity || 'Unlimited'}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => toggleRsvp(event.id)}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                    event.isRsvpd 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                  }`}
                >
                  {event.isRsvpd ? (
                    <>
                      <IconCheck size={24} className="mr-2" />
                      You're Attending!
                    </>
                  ) : (
                    <>
                      <IconTicket size={24} className="mr-2" />
                      RSVP Now
                    </>
                  )}
                </button>

                <button className="w-full mt-4 py-3 rounded-xl font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center">
                  <IconShare size={20} className="mr-2" />
                  Share Event
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
}
