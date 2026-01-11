/**
 * SignIn Page Tests - User authentication
 *
 * Tests: Form validation, login submission, error handling, Google OAuth
 * Mocks: Axios for API calls, React Router navigation
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignIn from '../SignIn';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../hooks/useGetCity', () => ({
  default: () => ({
    getCity: vi
      .fn()
      .mockResolvedValue({ city: 'Test City', address: 'Test Address' }),
  }),
}));

const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  return {
    ...(await vi.importActual('react-redux')),
    useDispatch: () => mockDispatch,
  };
});

vi.mock('react-icons/fa', () => {
  const Icon = (props) => <span {...props} data-testid="icon" />;
  return {
    FaRegEye: Icon,
    FaRegEyeSlash: Icon,
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
    FaMapMarkerAlt: Icon,
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
vi.mock('react-icons/fc', () => {
  const Icon = (props) => <span {...props} data-testid="google-icon" />;
  return { FcGoogle: Icon };
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

describe('SignIn Component', () => {
  it('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );
    const toggleBtn = screen.getByText('Show');
    fireEvent.click(toggleBtn);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute(
      'type',
      'text',
    );

    fireEvent.click(screen.getByText('Hide'));
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute(
      'type',
      'password',
    );
  });

  it('handles form submission successfully', async () => {
    axios.post.mockResolvedValueOnce({ data: { user: 'test' } });

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    const loginBtn = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/signin'),
        { email: 'test@example.com', password: 'password123' },
        expect.any(Object),
      );
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('displays error on failed login', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
