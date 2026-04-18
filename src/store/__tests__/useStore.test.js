import { describe, it, expect, beforeEach } from 'vitest';
import useStore from '../useStore';

describe('useStore Business Logic', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.setState({
      user: { name: 'Test User', phone: '0712345678' },
      balance: 0,
      completedTaskIds: [],
      unlockedTaskIds: [],
      plan: null,
      tasksCompletedToday: 0,
      accuracyRate: 85,
      earnings: [],
    });
  });

  describe('Initial State & Generators', () => {
    it('initializes with accurate default state and empty plan', () => {
      const state = useStore.getState();
      expect(state.plan).toBeNull();
      expect(state.balance).toBe(0);
      expect(state.completedTaskIds).toEqual([]);
    });

    it('deterministically generates tasks with correct bounds', () => {
      const state = useStore.getState();
      const tasks = state.tasks;
      
      expect(tasks.length).toBeGreaterThan(0);
      
      tasks.forEach(task => {
        // Rewards should be strictly bounded between 400 and 600
        expect(task.reward).toBeGreaterThanOrEqual(400);
        expect(task.reward).toBeLessThanOrEqual(600);
        
        // Only task.id === 1 should be free
        if (task.id === 1) {
          expect(task.isPremium).toBe(false);
        } else {
          expect(task.isPremium).toBe(true);
          // Premium tasks should have an unlockFee strictly between 100 and 150
          expect(task.unlockFee).toBeGreaterThanOrEqual(100);
          expect(task.unlockFee).toBeLessThanOrEqual(150);
        }
      });
    });
  });

  describe('Account Purchasing Operations', () => {
    it('sets the plan accurately upon selection', () => {
      let state = useStore.getState();
      expect(state.plan).toBeNull();

      state.selectPlan('expert');
      
      state = useStore.getState();
      expect(state.plan).toBe('expert');
    });

    it('enforces daily task limits based on purchased plan', () => {
      const state = useStore.getState();
      
      // No plan gives baseline limit, e.g., 3
      expect(state.getDailyLimit()).toBe(3);

      state.selectPlan('average'); // Average / Pro tier has 15 limit
      expect(state.getDailyLimit()).toBe(15);
      
      state.selectPlan('elite'); // Elite has 40 limit
      expect(state.getDailyLimit()).toBe(40);
    });
  });

  describe('Task Mechanics', () => {
    it('unlocks individual premium tasks successfully', () => {
      const state = useStore.getState();
      expect(state.unlockedTaskIds).toEqual([]);

      state.unlockTask(5);
      expect(useStore.getState().unlockedTaskIds).toContain(5);

      state.unlockTask(2);
      expect(useStore.getState().unlockedTaskIds).toContain(5);
      expect(useStore.getState().unlockedTaskIds).toContain(2);
    });

    it('completes tasks, adjusting balance, earnings, and limits safely', () => {
      let state = useStore.getState();
      const firstTask = state.tasks[0];
      
      expect(state.tasksCompletedToday).toBe(0);
      expect(state.balance).toBe(0);
      expect(state.accuracyRate).toBe(85);
      
      state.completeTask(firstTask.id);
      
      state = useStore.getState();
      expect(state.completedTaskIds).toContain(firstTask.id);
      expect(state.tasksCompletedToday).toBe(1);
      expect(state.balance).toBe(firstTask.reward);
      expect(state.accuracyRate).toBe(85.5);
      
      expect(state.earnings.length).toBe(1);
      expect(state.earnings[0].amount).toBe(firstTask.reward);
      expect(state.earnings[0].description).toBe(firstTask.title);
    });
  });
});
