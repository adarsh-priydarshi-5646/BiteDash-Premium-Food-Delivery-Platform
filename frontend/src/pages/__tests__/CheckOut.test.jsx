/**
 * CheckOut Page Tests - Order placement flow
 *
 * Tests: Address selection, payment method, order submission
 * Mocks: Axios for API, Redux store with cart & user data
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckOut from '../CheckOut';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

vi.mock('axios');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  return {
    ...(await vi.importActual('react-redux')),
    useDispatch: () => mockDispatch,
    useSelector: vi.fn(),
  };
});

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: () => <div data-testid="marker" />,
  useMap: () => ({ setView: vi.fn() }),
}));

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({}),
}));

vi.mock('../../hooks/useGetCity', () => ({
  default: () => ({
    getCity: vi
      .fn()
      .mockResolvedValue({ city: 'Test City', address: 'Test Address' }),
  }),
}));

vi.mock('../../components/AddressAutocomplete', () => ({
  default: ({ onSelect, initialValue }) => (
    <input
      data-testid="address-autocomplete"
      value={initialValue}
      onChange={(e) => onSelect({ address: e.target.value, lat: 12, lon: 77 })}
      placeholder="Search for a building, street or area..."
    />
  ),
}));

vi.mock('react-icons/io', () => ({
  IoIosArrowRoundBack: () => <div>Icon</div>,
}));
vi.mock('react-icons/io5', () => ({
  IoSearchOutline: () => <div>Icon</div>,
  IoLocationSharp: () => <div>Icon</div>,
}));
vi.mock('react-icons/tb', () => ({ TbCurrentLocation: () => <div>Icon</div> }));
vi.mock('react-icons/md', () => ({
  MdDeliveryDining: () => <div>Icon</div>,
  MdOutlineAddLocationAlt: () => <div>Icon</div>,
}));
vi.mock('react-icons/fa', () => {
  const Icon = (props) => <span {...props} data-testid="icon" />;
  return {
    FaCreditCard: Icon,
    FaReceipt: Icon,
    FaCheckCircle: Icon,
    FaPlus: Icon,
    FaFacebook: Icon,
    FaTwitter: Icon,
    FaInstagram: Icon,
    FaLinkedin: Icon,
    FaEnvelope: Icon,
    FaPhone: Icon,
    FaMapMarkerAlt: Icon,
    FaBars: Icon,
    FaTimes: Icon,
    FaGithub: Icon,
    FaCode: Icon,
    FaCloud: Icon,
    FaTools: Icon,
    FaRocket: Icon,
    FaShieldAlt: Icon,
    FaCogs: Icon,
    FaChartLine: Icon,
    FaUsers: Icon,
    FaGlobe: Icon,
    FaMobile: Icon,
    FaDatabase: Icon,
    FaServer: Icon,
    FaPlug: Icon,
    FaBolt: Icon,
    FaClipboardList: Icon,
    FaLock: Icon,
    FaSave: Icon,
    FaBuilding: Icon,
    FaCube: Icon,
    FaBan: Icon,
    FaLayerGroup: Icon,
    FaNetworkWired: Icon,
    FaMemory: Icon,
    FaPaintBrush: Icon,
    FaExchangeAlt: Icon,
    FaFileCode: Icon,
    FaBook: Icon,
    FaLightbulb: Icon,
    FaWrench: Icon,
    FaBoxOpen: Icon,
    FaTachometerAlt: Icon,
    FaUserShield: Icon,
    FaBell: Icon,
    FaSearch: Icon,
    FaFilter: Icon,
    FaStar: Icon,
    FaHeart: Icon,
    FaExternalLinkAlt: Icon,
    FaAws: Icon,
    FaChevronRight: Icon,
  };
});
vi.mock('react-icons/fa6', () => {
  const Icon = (props) => <span {...props} data-testid="icon" />;
  return { FaMobileScreenButton: Icon };
});
vi.mock('react-icons/si', () => {
  const Icon = (props) => <span {...props} data-testid="si-icon" />;
  return {
    SiReact: Icon,
    SiNodedotjs: Icon,
    SiMongodb: Icon,
    SiExpress: Icon,
    SiRedux: Icon,
    SiSocketdotio: Icon,
    SiTailwindcss: Icon,
    SiFirebase: Icon,
    SiStripe: Icon,
    SiGit: Icon,
    SiVercel: Icon,
    SiRender: Icon,
    SiVite: Icon,
    SiJsonwebtokens: Icon,
    SiPython: Icon,
    SiJavascript: Icon,
    SiTypescript: Icon,
    SiDocker: Icon,
    SiKubernetes: Icon,
    SiGooglecloud: Icon,
    SiTensorflow: Icon,
    SiPytorch: Icon,
    SiNumpy: Icon,
    SiPandas: Icon,
    SiJenkins: Icon,
    SiGithubactions: Icon,
    SiLinux: Icon,
    SiNginx: Icon,
    SiRedis: Icon,
    SiPostgresql: Icon,
    SiMysql: Icon,
    SiGraphql: Icon,
    SiNextdotjs: Icon,
    SiJest: Icon,
    SiFigma: Icon,
    SiPostman: Icon,
  };
});
vi.mock('react-icons/vsc', () => {
  const Icon = (props) => <span {...props} data-testid="vsc-icon" />;
  return { VscCode: Icon };
});

describe('CheckOut Component', () => {
  const defaultState = {
    map: { location: { lat: 12, lon: 77 }, address: '' },
    user: {
      cartItems: [{ name: 'Pizza', price: 200, quantity: 1 }],
      totalAmount: 200,
      userData: { fullName: 'Test User', location: { coordinates: [77, 12] } },
    },
    owner: { myShopData: null },
  };

  it('renders checkout form and summary', () => {
    useSelector.mockReturnValue(defaultState.user);
    useSelector.mockImplementation((selector) => {
      const state = defaultState;
      return selector(state);
    });

    render(
      <BrowserRouter>
        <CheckOut />
      </BrowserRouter>,
    );

    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search for a building, street or area...'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Place Order')).toBeInTheDocument(); // Default COD
  });

  it('toggles payment method', () => {
    useSelector.mockImplementation((selector) => selector(defaultState));

    render(
      <BrowserRouter>
        <CheckOut />
      </BrowserRouter>,
    );

    const cardBtn = screen.getByText('Cards / Wallet / UPI');
    fireEvent.click(cardBtn);

    expect(screen.getByText('Pay & Place Order')).toBeInTheDocument();
  });

  it('handles order placement (COD)', async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        ...defaultState,
        map: { location: { lat: 12, lon: 77 }, address: 'Test Address' },
      }),
    );

    axios.post.mockResolvedValueOnce({ data: { _id: 'order-123' } });

    render(
      <BrowserRouter>
        <CheckOut />
      </BrowserRouter>,
    );

    fireEvent.change(
      screen.getByPlaceholderText('Search for a building, street or area...'),
      {
        target: { value: 'Test Address' },
      },
    );

    const placeOrderBtn = screen.getByText('Place Order');
    fireEvent.click(placeOrderBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/place-order'),
        expect.objectContaining({ paymentMethod: 'cod' }),
        expect.anything(),
      );
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});
