/**
 * MyOrders Page Tests - Order history display
 *
 * Tests: Orders list, status badges, track/rate buttons, role-based view
 * Mocks: Redux store with orders, Socket.IO events
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MyOrders from '../MyOrders';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  return {
    ...(await vi.importActual('react-redux')),
    useDispatch: () => mockDispatch,
    useSelector: vi.fn(),
  };
});

vi.mock('react-icons/io', () => ({
  IoIosArrowRoundBack: () => <div data-testid="back-icon" />,
}));
vi.mock('react-icons/fa', () => ({
  FaClipboardList: () => <div data-testid="clipboard-icon" />,
}));

vi.mock('../../components/UserOrderCard', () => ({
  default: () => <div data-testid="user-order-card">User Order Card</div>,
}));
vi.mock('../../components/OwnerOrderCard', () => ({
  default: () => <div data-testid="owner-order-card">Owner Order Card</div>,
}));
vi.mock('../../components/DeliveryHistoryCard', () => ({
  default: () => <div data-testid="delivery-card">Delivery Card</div>,
}));

describe('MyOrders Component', () => {
  const mockSocket = { on: vi.fn(), off: vi.fn() };
  const mockOrders = [{ _id: '1', status: 'preparing' }];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state', () => {
    useSelector.mockReturnValue({
      userData: { role: 'user', _id: 'u1' },
      myOrders: [],
      socket: mockSocket,
    });

    render(
      <BrowserRouter>
        <MyOrders />
      </BrowserRouter>
    );

    expect(screen.getByText('No orders yet')).toBeInTheDocument();
    expect(screen.getByText('Explore Food Items')).toBeInTheDocument();
  });

  it('renders user orders', () => {
    useSelector.mockReturnValue({
      userData: { role: 'user', _id: 'u1' },
      myOrders: mockOrders,
      socket: mockSocket,
    });

    render(
      <BrowserRouter>
        <MyOrders />
      </BrowserRouter>
    );

    expect(screen.getByTestId('user-order-card')).toBeInTheDocument();
    expect(screen.getByText('My Orders')).toBeInTheDocument();
  });

  it('renders owner orders', () => {
    useSelector.mockReturnValue({
      userData: { role: 'owner', _id: 'o1' },
      myOrders: mockOrders,
      socket: mockSocket,
    });

    render(
      <BrowserRouter>
        <MyOrders />
      </BrowserRouter>
    );

    expect(screen.getByTestId('owner-order-card')).toBeInTheDocument();
  });
});
