import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Make React globally available for tests
global.React = React;

// Mock window.URL.createObjectURL for export functionality
Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mocked-url'),
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: {},
  LinearScale: {},
  PointElement: {},
  LineElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
}));

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Line: ({ data, options }: any) => {
    return React.createElement('div', { 
      'data-testid': 'metrics-chart', 
      'data-chart-type': 'line' 
    }, [
      React.createElement('div', { 
        'data-testid': 'chart-data', 
        key: 'data' 
      }, JSON.stringify(data)),
      React.createElement('div', { 
        'data-testid': 'chart-options', 
        key: 'options' 
      }, JSON.stringify(options)),
    ]);
  },
}));

// Mock Convex types
vi.mock('@/convex/_generated/api', () => ({
  LPValidationSession: {},
  AutomationExecution: {},
  SystemAlert: {},
}));