/**
 * Shop Page Tests - Restaurant detail & menu
 *
 * Tests: Shop info display, menu items grid, add to cart
 * Mocks: Axios for shop data, React Router params
 */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Shop from '../Shop';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../redux/userSlice';
import ownerReducer from '../../redux/ownerSlice';
import axios from 'axios';

vi.mock('axios');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ shopId: 'shop-123' }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../hooks/useGetCity', () => ({
  default: () => ({ getCity: vi.fn() }),
}));

vi.mock('react-icons/fa6', () => {
  const Icon = () => <div data-testid="icon" />;
  return {
    FaStore: Icon,
    FaLocationDot: Icon,
    FaStar: Icon,
    FaClock: Icon,
    FaArrowLeft: Icon,
    FaUtensils: Icon,
    FaMotorcycle: Icon,
    FaPlus: Icon,
  };
});

vi.mock('react-icons/io', () => ({
  IoIosSearch: () => <div data-testid="search-icon" />,
}));

vi.mock('react-icons/fi', () => ({
  FiShoppingCart: () => <div data-testid="cart-icon" />,
}));

vi.mock('react-icons/rx', () => ({
  RxCross2: () => <div data-testid="close-icon" />,
}));

vi.mock('react-icons/tb', () => ({
  TbReceipt2: () => <div data-testid="receipt-icon" />,
}));

vi.mock('../../components/FoodCard', () => ({
  default: ({ data }) => <div data-testid="food-card">{data.name}</div>,
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      owner: ownerReducer,
    },
    preloadedState: {
      user: {
        userData: { fullName: 'Test User', role: 'user' },
        currentCity: 'Test City',
        cartItems: [],
        searchItems: [],
        myOrders: [],
        totalAmount: 0,
        socket: null,
      },
      owner: {
        myShopData: null,
        myOrders: [],
      },
    },
  });
};

describe('Shop Component', () => {
  const mockShopData = {
    shop: {
      name: 'Pizza Hut',
      rating: 4.5,
      deliveryTime: 30,
      address: 'Downtown',
      image: 'http://test.com/img.jpg',
      cuisine: 'Italian, Pizza',
    },
    items: [
      { _id: '1', name: 'Margherita' },
      { _id: '2', name: 'Pepperoni' },
    ],
  };

  it('renders shop details and menu items', async () => {
    axios.get.mockResolvedValueOnce({ data: mockShopData });
    const store = createMockStore();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Shop />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Pizza Hut')).toBeInTheDocument();
      expect(screen.getByText('Margherita')).toBeInTheDocument();
      expect(screen.getByText('Pepperoni')).toBeInTheDocument();
      expect(screen.getByText('30 mins')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });
  });

  it('renders no items state correctly', async () => {
    axios.get.mockResolvedValueOnce({
      data: { ...mockShopData, items: [] },
    });
    const store = createMockStore();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Shop />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText('No Items Available')).toBeInTheDocument();
    });
  });
});
