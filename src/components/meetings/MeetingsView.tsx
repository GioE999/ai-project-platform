"use client";
import { MeetingCard } from "./MeetingCard";

interface Meeting {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  status: string;
  meetUrl?: string;
  projectId?: string;
}

export function MeetingsView({ meetings }: { meetings: Meeting[] }) {
  const upcoming = meetings.filter(m => new Date(m.scheduledAt) > new Date());
  const past = meetings.filter(m => new Date(m.scheduledAt) <= new Date());

  return (
    <div>
      <section>
        <h3 className="mb-3 text-lg font-semibold">Próximas</h3>
        <div className="space-y-3">
          {upcoming.length > 0 ? upcoming.map(m => <MeetingCard key={m.id} meeting={m} />) : (
            <p className="text-sm text-muted-foreground">No hay reuniones próximas</p>
          )}
        </div>
      </section>
      <section className="mt-8">
        <h3 className="mb-3 text-lg font-semibold">Pasadas</h3>
        <div className="space-y-3">
          {past.map(m => <MeetingCard key={m.id} meeting={m} />)}
        </div>
      </section>
    </div>
  );
}
