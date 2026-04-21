import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type LoanStatus = 'Pending' | 'Active' | 'Overdue';
export type ItemType = 'book' | 'paper';

export type LoanItem = {
  id: string;
  type: ItemType;
  title: string;
  author: string;
  borrowDate: string; // YYYY-MM-DD
  returnDate: string; // YYYY-MM-DD
  status: LoanStatus;
  location: string;
  description: string;
  totalCopies: number;
  available: number;
  libraryName?: string;
  tag?: string;
  durationDays?: number;
};

type LoanContextValue = {
  loans: LoanItem[];
  message: string | null;
  addLoan: (loan: Omit<LoanItem, 'status'> & { status?: LoanStatus }) => void;
  clearMessage: () => void;
};

const LoanContext = createContext<LoanContextValue | null>(null);

const parseDateLocal = (value: string) => {
  const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/;
  if (isoDateOnly.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y!, (m ?? 1) - 1, d);
  }
  return new Date(value);
};

const computeStatus = (returnDate: string, explicit?: LoanStatus): LoanStatus => {
  if (explicit) return explicit;
  const due = parseDateLocal(returnDate);
  if (Number.isNaN(due.getTime())) return 'Active';

  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return due < todayMidnight ? 'Overdue' : 'Active';
};

const INITIAL_LOANS: LoanItem[] = [
  {
    id: '1',
    title: 'Data Structures and Algorithms',
    borrowDate: '2026-04-01',
    returnDate: '2026-04-10',
    status: 'Active',
    type: 'book',
    author: 'Thomas H. Cormen',
    available: 1,
    totalCopies: 4,
    location: 'Shelf C - Row 1',
    description: 'Classic reference on algorithm design, analysis, and core data structures.',
    libraryName: 'CSE Library',
    tag: 'Algorithms',
  },
  {
    id: '2',
    title: 'Introduction to Mechanics',
    borrowDate: '2026-03-15',
    returnDate: '2026-03-30',
    status: 'Overdue',
    type: 'book',
    author: 'Kleppner & Kolenkow',
    available: 0,
    totalCopies: 3,
    location: 'Shelf D - Row 2',
    description: 'Mechanics fundamentals with rigorous problem-based explanations.',
    libraryName: 'Science Library',
    tag: 'Physics',
  },
];

export function LoanProvider({ children }: { children: React.ReactNode }) {
  const [loans, setLoans] = useState<LoanItem[]>(INITIAL_LOANS);
  const [message, setMessage] = useState<string | null>(null);

  const clearMessage = useCallback(() => setMessage(null), []);

  const addLoan = useCallback((loan: Omit<LoanItem, 'status'> & { status?: LoanStatus }) => {
    const status = computeStatus(loan.returnDate, loan.status);
    const next: LoanItem = { ...loan, status };

    setLoans((prev) => {
      const without = prev.filter((l) => l.id !== loan.id);
      return [next, ...without];
    });

    setMessage('Request saved. You can track the return date in “My Books”.');
  }, []);

  const value = useMemo<LoanContextValue>(
    () => ({ loans, message, addLoan, clearMessage }),
    [addLoan, clearMessage, loans, message]
  );

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
}

export function useLoans() {
  const ctx = useContext(LoanContext);
  if (!ctx) {
    throw new Error('useLoans must be used within a LoanProvider');
  }
  return ctx;
}
