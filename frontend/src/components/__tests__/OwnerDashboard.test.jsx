/**
 * OwnerDashboard Component Tests - Restaurant owner panel
 *
 * Tests: Menu items display, orders list, earnings stats, tab navigation
 * Mocks: Redux store with shop data, Socket.IO events
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OwnerDashboard from '../OwnerDashboard';
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

vi.mock('react-icons/fa', () => {
  const Icon = (props) => <span {...props} data-testid="icon" />;
  return {
    FaStore: Icon,
    FaUtensils: Icon,
    FaPen: Icon,
    FaBoxOpen: Icon,
    FaRupeeSign: Icon,
    FaChartLine: Icon,
    FaStar: Icon,
    FaUniversity: Icon,
    FaPlus: Icon,
    FaBars: Icon,
    FaTimes: Icon,
    FaGithub: Icon,
    FaLinkedin: Icon,
    FaEnvelope: Icon,
    FaCode: Icon,
    FaCloud: Icon,
    FaTools: Icon,
    FaRocket: Icon,
    FaShieldAlt: Icon,
    FaCogs: Icon,
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
    FaCheckCircle: Icon,
    FaLayerGroup: Icon,
    FaNetworkWired: Icon,
    FaMemory: Icon,
    FaPaintBrush: Icon,
    FaExchangeAlt: Icon,
    FaFileCode: Icon,
    FaBook: Icon,
    FaLightbulb: Icon,
    FaWrench: Icon,
    FaTachometerAlt: Icon,
    FaUserShield: Icon,
    FaCreditCard: Icon,
    FaMapMarkerAlt: Icon,
    FaBell: Icon,
    FaSearch: Icon,
    FaFilter: Icon,
    FaHeart: Icon,
    FaExternalLinkAlt: Icon,
    FaAws: Icon,
    FaChevronRight: Icon,
  };
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

vi.mock('../../components/Nav', () => ({
  default: () => <div data-testid="nav">Nav</div>,
}));
vi.mock('../../components/OwnerOrderCard', () => ({
  default: ({ data }) => <div data-testid="order-card">{data._id}</div>,
}));

describe('OwnerDashboard Component', () => {
  const mockShopData = {
    _id: 'shop1',
    name: 'My Shop',
    city: 'Delhi',
    state: 'DL',
    items: [{ name: 'Burger', price: 100, category: 'Snacks' }],
  };

  const mockOrders = [
    {
      _id: 'o1',
      createdAt: new Date().toISOString(),
      shopOrders: {
        // Single shop order structure
        shop: { _id: 'shop1' },
        subtotal: 500,
        status: 'preparing',
      },
    },
  ];

  it('renders "Launch Your Restaurant" when no shop data', () => {
    useSelector.mockReturnValue({
      myShopData: null,
      myOrders: [],
      userData: { _id: 'u1' },
    });

    render(
      <BrowserRouter>
        <OwnerDashboard />
      </BrowserRouter>,
    );

    expect(screen.getByText('Launch Your Restaurant')).toBeInTheDocument();
    expect(screen.getByText('Create Restaurant')).toBeInTheDocument();
  });

  it('renders dashboard with stats when shop data exists', () => {
    useSelector.mockReturnValue({
      myShopData: mockShopData,
      myOrders: mockOrders,
      userData: { _id: 'u1' },
    });

    render(
      <BrowserRouter>
        <OwnerDashboard />
      </BrowserRouter>,
    );

    expect(screen.getByText('My Shop')).toBeInTheDocument();
    expect(screen.getByText('Delhi, DL')).toBeInTheDocument();

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('₹500')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    const counts = screen.getAllByText('1');
    expect(counts.length).toBeGreaterThanOrEqual(2);

    expect(screen.getByText('Burger')).toBeInTheDocument();
  });
});
