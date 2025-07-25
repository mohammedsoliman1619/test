import { format, isToday, isTomorrow, isYesterday, isPast, isFuture, parseISO, formatDistanceToNow } from 'date-fns';

export function formatDate(date: string | Date, formatStr: string = 'PP'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function formatTime(date: string | Date, use24Hour: boolean = false): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, use24Hour ? 'HH:mm' : 'h:mm a');
}

export function formatDateTime(date: string | Date, dateFormat: string = 'PP', use24Hour: boolean = false): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const timeFormat = use24Hour ? 'HH:mm' : 'h:mm a';
  return format(dateObj, `${dateFormat} ${timeFormat}`);
}

export function getRelativeDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  } else if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  } else if (isYesterday(dateObj)) {
    return 'Yesterday';
  } else {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }
}

export function getDueDateColor(dueDate: string | Date): string {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  
  if (isPast(dateObj)) {
    return 'text-red-600 dark:text-red-400';
  } else if (isToday(dateObj)) {
    return 'text-orange-600 dark:text-orange-400';
  } else if (isTomorrow(dateObj)) {
    return 'text-yellow-600 dark:text-yellow-400';
  } else {
    return 'text-gray-500 dark:text-gray-400';
  }
}

export function isOverdue(dueDate: string | Date): boolean {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isPast(dateObj);
}

export function getDaysUntil(date: string | Date): number {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  const diffTime = dateObj.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getWeekNumber(date: string | Date): number {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const firstDayOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const pastDaysOfYear = (dateObj.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export function getDateRange(start: string | Date, end: string | Date): Date[] {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;
  const dates: Date[] = [];
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

export function parseNaturalLanguageDate(input: string): Date | null {
  const normalizedInput = input.toLowerCase().trim();
  
  // Handle specific cases
  if (normalizedInput === 'today') {
    return new Date();
  }
  
  if (normalizedInput === 'tomorrow') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  if (normalizedInput === 'yesterday') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }
  
  // Handle "next week", "next month", etc.
  if (normalizedInput.includes('next week')) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  }
  
  if (normalizedInput.includes('next month')) {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  }
  
  // Handle days of the week
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = daysOfWeek.findIndex(day => normalizedInput.includes(day));
  
  if (dayIndex !== -1) {
    const today = new Date();
    const todayIndex = today.getDay();
    const daysUntilTarget = (dayIndex - todayIndex + 7) % 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
    return targetDate;
  }
  
  // Try to parse as ISO date
  try {
    const parsed = parseISO(normalizedInput);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  } catch (error) {
    // Ignore parse errors
  }
  
  return null;
}
