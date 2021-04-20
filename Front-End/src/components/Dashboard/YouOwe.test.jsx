/* eslint-disable no-undef */
import React from 'react';
import { screen } from '@testing-library/react';
import YouOwe from './YouOwe';
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
    renderConnected(<YouOwe />, { initialState });
  });

  it('renders the component', () => {
    expect(screen.getByText(/You Owe/)).toBeInTheDocument();
    expect(screen.queryByText('You Owe:')).toBeNull();
    expect(screen.getByText('You do not owe anything')).toBeInTheDocument();
  });
});
