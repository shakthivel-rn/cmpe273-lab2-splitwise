/* eslint-disable no-undef */
import React from 'react';
import { screen } from '@testing-library/react';
import MyGroups from './MyGroups';
import renderConnected from '../../test/renderConnected';

describe('My Groups Component', () => {
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
    renderConnected(<MyGroups />, { initialState });
  });

  it('renders the component', () => {
    expect(screen.getByText('Group Invites')).toBeInTheDocument();
    expect(screen.queryByText('Group Invites:')).toBeNull();
  });
});
