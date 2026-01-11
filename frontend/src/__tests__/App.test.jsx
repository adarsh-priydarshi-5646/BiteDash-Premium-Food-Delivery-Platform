/**
 * App Component Tests - Root component integration tests
 *
 * Tests: Routing, auth state, loading states, role-based rendering
 * Mocks: All custom hooks, Redux store, React Router
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../hooks/useGetCurrentUser');
vi.mock('../hooks/useGetMyShop');
vi.mock('../hooks/useGetShopByCity');
vi.mock('../hooks/useGetItemsByCity');
vi.mock('../hooks/useGetMyOrders');
vi.mock('../hooks/useUpdateLocation');
vi.mock('../hooks/useGetCity', () => ({
  default: () => ({ getCity: vi.fn() }),
}));

vi.mock('socket.io-client', () => ({
  io: () => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  }),
}));

const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector) =>
      selector({
        user: {
          userData: null,
          authLoading: false,
        },
      }),
  };
});

vi.mock('react-icons/fa', () => {
  const Icon = (props) => <span {...props} data-testid="icon" />;
  return {
    FaSearch: Icon,
    FaMapMarkerAlt: Icon,
    FaCaretDown: Icon,
    FaChevronRight: Icon,
    FaChevronDown: Icon,
    FaMobileAlt: Icon,
    FaEnvelope: Icon,
    FaUtensils: Icon,
    FaStore: Icon,
    FaLink: Icon,
    FaCity: Icon,
    FaBars: Icon,
    FaTimes: Icon,
    FaGithub: Icon,
    FaLinkedin: Icon,
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
    FaBoxOpen: Icon,
    FaTachometerAlt: Icon,
    FaUserShield: Icon,
    FaCreditCard: Icon,
    FaBell: Icon,
    FaFilter: Icon,
    FaStar: Icon,
    FaHeart: Icon,
    FaExternalLinkAlt: Icon,
    FaAws: Icon,
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

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      whileHover,
      whileInView,
      initial,
      animate,
      transition,
      variants,
      viewport,
      ...props
    }) => <div {...props}>{children}</div>,
    h1: ({ children, initial, animate, transition, ...props }) => (
      <h1 {...props}>{children}</h1>
    ),
    p: ({ children, initial, animate, transition, ...props }) => (
      <p {...props}>{children}</p>
    ),
    span: ({
      children,
      initial,
      animate,
      transition,
      whileInView,
      ...props
    }) => <span {...props}>{children}</span>,
    button: ({
      children,
      initial,
      animate,
      transition,
      whileHover,
      whileTap,
      ...props
    }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('App Component', () => {
  it('renders Landing Page when not authenticated', async () => {
    const { findByRole } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    const heading = await findByRole('heading', { name: 'BiteDash', level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
