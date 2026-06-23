"use client";

interface Task {
  id: string;
  name: string;
  dueDate?: string;
}

export function TaskCalendarView({ tasks }: { tasks: Task[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const tasksByDate = new Map<string, Task[]>();
  for (const task of tasks) {
    if (task.dueDate) {
      const key = task.dueDate.slice(0, 10);
      if (!tasksByDate.has(key)) tasksByDate.set(key, []);
      tasksByDate.get(key)!.push(task);
    }
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">
        {now.toLocaleDateString("es", { month: "long", year: "numeric" })}
      </h3>
      <div className="grid grid-cols-7 gap-1">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {blanks.map((i) => (
          <div key={`blank-${i}`} className="p-2" />
        ))}
        {days.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayTasks = tasksByDate.get(dateStr) || [];
          return (
            <div key={day} className="min-h-[60px] rounded border p-1">
              <span className="text-xs">{day}</span>
              {dayTasks.map((t) => (
                <div key={t.id} className="mt-0.5 truncate rounded bg-primary/10 px-1 text-xs">
                  {t.name}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
