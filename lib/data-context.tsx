'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Program {
  id: number;
  title: string;
  description: string;
  impact: string;
  status: 'active' | 'planning' | 'completed';
}

export interface Donation {
  id: number;
  donor: string;
  amount: number;
  date: string;
  purpose: string;
}

interface DataContextType {
  programs: Program[];
  donations: Donation[];
  addProgram: (program: Omit<Program, 'id'>) => void;
  updateProgram: (id: number, program: Partial<Program>) => void;
  deleteProgram: (id: number) => void;
  addDonation: (donation: Omit<Donation, 'id'>) => void;
  getTotalDonations: () => number;
  getTotalImpact: () => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialPrograms: Program[] = [
  {
    id: 1,
    title: 'Education Initiatives',
    description: 'Building schools and providing scholarships to ensure every child has access to quality education.',
    impact: '5,000+ students',
    status: 'active',
  },
  {
    id: 2,
    title: 'Nutrition Program',
    description: 'Providing nutritious meals and health education to communities facing food insecurity.',
    impact: '12,000+ people',
    status: 'active',
  },
  {
    id: 3,
    title: 'Teacher Training',
    description: 'Training and empowering local educators to improve teaching standards and student outcomes.',
    impact: '200+ teachers',
    status: 'planning',
  },
  {
    id: 4,
    title: 'Community Health',
    description: 'Establishing clinics and health awareness programs to improve access to healthcare.',
    impact: '3,000+ people',
    status: 'active',
  },
];

const initialDonations: Donation[] = [
  { id: 1, donor: 'John Smith', amount: 5000, date: '2024-03-10', purpose: 'Education Program' },
  { id: 2, donor: 'Jane Doe', amount: 10000, date: '2024-03-08', purpose: 'Nutrition Initiative' },
  { id: 3, donor: 'ABC Corporation', amount: 25000, date: '2024-03-05', purpose: 'General Fund' },
  { id: 4, donor: 'Community Fund', amount: 15000, date: '2024-03-01', purpose: 'Healthcare Program' },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [donations, setDonations] = useState<Donation[]>(initialDonations);

  const addProgram = (program: Omit<Program, 'id'>) => {
    const newProgram: Program = {
      ...program,
      id: Math.max(...programs.map(p => p.id), 0) + 1,
    };
    setPrograms([...programs, newProgram]);
  };

  const updateProgram = (id: number, updates: Partial<Program>) => {
    setPrograms(programs.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProgram = (id: number) => {
    setPrograms(programs.filter(p => p.id !== id));
  };

  const addDonation = (donation: Omit<Donation, 'id'>) => {
    const newDonation: Donation = {
      ...donation,
      id: Math.max(...donations.map(d => d.id), 0) + 1,
    };
    setDonations([...donations, newDonation]);
  };

  const getTotalDonations = () => {
    return donations.reduce((sum, d) => sum + d.amount, 0);
  };

  const getTotalImpact = () => {
    return parseInt(programs.reduce((sum, p) => sum + parseInt(p.impact.split('+')[0].replace(/,/g, '')) || 0, 0).toString());
  };

  return (
    <DataContext.Provider
      value={{
        programs,
        donations,
        addProgram,
        updateProgram,
        deleteProgram,
        addDonation,
        getTotalDonations,
        getTotalImpact,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
