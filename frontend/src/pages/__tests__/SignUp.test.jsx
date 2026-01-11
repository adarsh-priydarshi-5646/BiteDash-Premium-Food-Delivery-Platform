/**
 * SignUp Page Tests - User registration
 *
 * Tests: Form validation, role selection, submit, Google OAuth
 * Mocks: Axios for API, React Router navigation
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignUp from '../SignUp';
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
  const Icon = (props) => <span {...props} data-testid="icon" />;
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

vi.mock('../../firebase', () => ({
  auth: {},
}));
vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn().mockResolvedValue({
    user: { displayName: 'Test User', email: 'test@gmail.com' },
  }),
}));

describe('SignUp Component', () => {
  it('renders signup form elements', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('validates mobile number for Google Auth', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    const googleBtn = screen.getByText('Continue with Google');
    fireEvent.click(googleBtn);

    expect(
      screen.getByText('Please enter your mobile number first'),
    ).toBeInTheDocument();
  });

  it('handles normal signup submission', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: '123' } });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Mobile Number'), {
      target: { value: '9876543210' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'pass123' },
    });

    fireEvent.click(screen.getByText('Create Account'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('changes role selection', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    const ownerBtn = screen.getByText('Owner');
    fireEvent.click(ownerBtn);
    expect(ownerBtn).toHaveClass('bg-[#E23744]');

    const userBtn = screen.getByText('User');
    expect(userBtn).not.toHaveClass('bg-[#E23744]');
  });
});
