"use client";
import { Video, Calendar, ExternalLink } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  status: string;
  meetUrl?: string;
  projectId?: string;
}

export function MeetingCard({ meeting, onProcess }: { meeting: Meeting; onProcess?: () => void }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-muted-foreground" />
          <h4 className="font-medium">{meeting.title}</h4>
        </div>
        <span className="rounded bg-muted px-2 py-0.5 text-xs">{meeting.status}</span>
      </div>
      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(meeting.scheduledAt).toLocaleString("es")}
        </span>
        <span>{meeting.duration} min</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {meeting.meetUrl && (
          <a href={meeting.meetUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
            <ExternalLink className="h-3 w-3" /> Unirse
          </a>
        )}
        {meeting.status === "COMPLETED" && onProcess && (
          <button onClick={onProcess} className="text-xs text-primary hover:underline">
            Procesar resumen
          </button>
        )}
      </div>
    </div>
  );
}
