import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import Dashboard from '../Dashboard';
import useStore from '../../store/useStore';

describe('Dashboard Access Controls', () => {
  beforeEach(() => {
    // Reset state before tests
    useStore.setState({
      user: { name: 'Test User', phone: '0712345678' },
      plan: null, // Unpurchased by default
      balance: 1500,
      completedTaskIds: [],
      earnings: [],
    });
  });

  const renderDashboard = () => {
    return render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  };

  it('renders a blocking gateway and purchase modal when user lacks a plan', () => {
    renderDashboard();

    // The user should see the 'Purchase Account Tier' button in the dashboard
    const upgradeBtns = screen.queryAllByRole('button', { name: /Purchase Account Tier/i });
    expect(upgradeBtns.length).toBeGreaterThan(0);

    // The PlansModal overlay wrapper (isGateway=true) should be completely intercepting the view
    // It says "Select Your Account Tier" when rendered
    expect(screen.getByText('Select Your Account Tier')).toBeInTheDocument();
    expect(screen.getByText(/Purchase an account tier below to instantly unlock/i)).toBeInTheDocument();
  });

  it('removes the blocking gateway when user purchases a tier', () => {
    // Upgrade user
    useStore.getState().selectPlan('expert');
    
    renderDashboard();

    // Plans gateway shouldn't be active anymore
    expect(screen.queryByText('Select Your Account Tier')).not.toBeInTheDocument();
    
    // Instead the user should see their dashboard stats without lock messages
    expect(screen.getByText('Available Tasks')).toBeInTheDocument();
    expect(screen.queryByText(/Free accounts are limited to 3 tasks/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Expert Plan Active/i)).toBeInTheDocument();
  });
});
