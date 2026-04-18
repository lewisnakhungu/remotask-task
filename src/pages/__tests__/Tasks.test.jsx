import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Tasks from '../Tasks';
import useStore from '../../store/useStore';

// Mock the store
vi.mock('../../store/useStore', () => ({
  default: vi.fn(),
  TASKS_DATA: vi.importActual('../../store/useStore').then(m => m.TASKS_DATA),
}));

describe('Tasks Page Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all 40 tasks from TASKS_DATA', async () => {
    const tasksData = await (await vi.importActual('../../store/useStore')).TASKS_DATA;
    
    useStore.mockReturnValue({
      user: { name: 'John Doe' },
      balance: 1000,
      tasks: tasksData,
      completedTaskIds: [],
      unlockedTaskIds: tasksData.map(t => t.id),
      canDoMoreTasks: () => true,
      plan: 'elite',
      getDailyLimit: () => 40,
      tasksCompletedToday: 0,
    });

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    const taskCards = document.querySelectorAll('.task-card');
    expect(taskCards.length).toBe(tasksData.length);
    expect(tasksData.length).toBe(40);
  });

  it('should filter tasks by category', async () => {
    const tasksData = await (await vi.importActual('../../store/useStore')).TASKS_DATA;
    
    useStore.mockReturnValue({
      user: { name: 'John Doe' },
      balance: 1000,
      tasks: tasksData,
      completedTaskIds: [],
      unlockedTaskIds: tasksData.map(t => t.id),
      canDoMoreTasks: () => true,
      plan: 'elite',
      getDailyLimit: () => 40,
      tasksCompletedToday: 0,
    });

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    const sentimentBtn = screen.getByRole('button', { name: /sentiment/i });
    fireEvent.click(sentimentBtn);

    const sentimentTasksCount = tasksData.filter(t => t.category === 'Sentiment').length;
    await waitFor(() => {
      const taskLinks = screen.queryAllByRole('link', { name: /start →/i });
      expect(taskLinks.length).toBe(sentimentTasksCount);
    });
  });
});
