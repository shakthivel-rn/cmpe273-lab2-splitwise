/* eslint-disable no-undef */
import React from 'react';
import { screen } from '@testing-library/react';
import AddExpenseForm from './AddExpenseForm';
import renderConnected from '../../test/renderConnected';

describe('You Owe Component', () => {
  const initialState = {
    // ... Add your initial testing state here
    id: '',
    name: '',
    userDetails: {},
    totalAmounts: {},
    youOwe: [],
    youAreOwed: [],
    settleUpUserNames: [],
    joinedGroups: [],
    invitedGroups: [],
    groupData: [],
    expenseDetails: [],
    comments: [],
    recentActivity: [],
    refreshBit: false,
    refreshBitYouOwe: false,
    refreshBitProfileImage: false,
  };

  beforeEach(() => {
    renderConnected(<AddExpenseForm />, { initialState });
  });

  it('renders the component', () => {
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.queryByText('Save:')).toBeNull();
  });
});
