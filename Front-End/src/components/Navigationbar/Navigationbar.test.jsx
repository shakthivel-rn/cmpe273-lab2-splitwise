/* eslint-disable no-undef */
import React from 'react';
import { screen } from '@testing-library/react';
import Navigationbar from './Navigationbar';
import renderConnected from '../../test/renderConnected';

describe('Navigation Bar Component', () => {
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
    renderConnected(<Navigationbar />, { initialState });
  });

  it('renders the component', () => {
    expect(screen.getByText('Splitwise')).toBeInTheDocument();
    expect(screen.queryByText('Splitwise:')).toBeNull();
  });
});
