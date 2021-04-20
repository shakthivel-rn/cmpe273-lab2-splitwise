/* eslint-disable no-undef */
import React from 'react';
import { screen } from '@testing-library/react';
import YouAreOwed from './YouAreOwed';
import renderConnected from '../../test/renderConnected';

describe('You Are Owed Component', () => {
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
    renderConnected(<YouAreOwed />, { initialState });
  });

  it('renders the component', () => {
    expect(screen.getByText(/You Are Owed/)).toBeInTheDocument();
    expect(screen.queryByText('You Are Owed:')).toBeNull();
    expect(screen.getByText('You are not owed anything')).toBeInTheDocument();
  });
});
