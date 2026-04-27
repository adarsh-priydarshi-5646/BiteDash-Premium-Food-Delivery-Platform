/**
 * Documentation Page - MDN-style technical documentation with developer profile
 *
 * Features: Markdown rendering, syntax highlighting, code copy buttons,
 * tabbed navigation (Technical/Tech Stack/Developer), sidebar navigation,
 * emoji to React icon conversion, responsive mobile menu
 * 
 * Libraries: marked (markdown parser), react-icons (icon library),
 * react-dom/server (SSR for icons), framer-motion (animations)
 * 
 * Sections: Introduction, Architecture, Frontend/Backend guides, API reference,
 * Real-time events, State management, Performance, Deployment, Developer profile
 * 
 * Features: Auto-generated table of contents, code syntax highlighting,
 * copy-to-clipboard for code blocks, live app link, GitHub integration
 */
import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import { FaChevronRight, FaBars, FaTimes, FaGithub, FaLinkedin, FaEnvelope, FaCode, FaCloud, FaTools, FaRocket, FaShieldAlt, FaCogs, FaChartLine, FaUsers, FaGlobe, FaMobile, FaDatabase, FaServer, FaPlug, FaBolt, FaClipboardList, FaLock, FaSave, FaBuilding, FaCube, FaBan, FaCheckCircle, FaLayerGroup, FaNetworkWired, FaMemory, FaPaintBrush, FaExchangeAlt, FaFileCode, FaBook, FaLightbulb, FaWrench, FaBoxOpen, FaTachometerAlt, FaUserShield, FaCreditCard, FaMapMarkerAlt, FaBell, FaSearch, FaFilter, FaStar, FaHeart, FaExternalLinkAlt } from "react-icons/fa";
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiRedux, SiSocketdotio, SiTailwindcss, SiFirebase, SiStripe, SiGit, SiVercel, SiRender, SiVite, SiJsonwebtokens, SiPython, SiJavascript, SiTypescript, SiDocker, SiKubernetes, SiGooglecloud, SiTensorflow, SiPytorch, SiNumpy, SiPandas, SiJenkins, SiGithubactions, SiLinux, SiNginx, SiRedis, SiPostgresql, SiMysql, SiGraphql, SiNextdotjs, SiJest, SiFigma, SiPostman } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { VscCode } from "react-icons/vsc";
import ReactDOMServer from "react-dom/server";

const emojiToIcon = {
  "🎯": <FaCheckCircle className="inline-icon" />,
  "📊": <FaChartLine className="inline-icon" />,
  "🔧": <FaWrench className="inline-icon" />,
  "💻": <FaCode className="inline-icon" />,
  "🖥️": <FaServer className="inline-icon" />,
  "🗄️": <FaDatabase className="inline-icon" />,
  "📡": <FaNetworkWired className="inline-icon" />,
  "🔄": <FaExchangeAlt className="inline-icon" />,
  "⚡": <FaBolt className="inline-icon" />,
  "🚀": <FaRocket className="inline-icon" />,
  "📋": <FaClipboardList className="inline-icon" />,
  "🔒": <FaLock className="inline-icon" />,
  "💾": <FaSave className="inline-icon" />,
  "⚙️": <FaCogs className="inline-icon" />,
  "🏗️": <FaBuilding className="inline-icon" />,
  "🔮": <FaLightbulb className="inline-icon" />,
  "❌": <FaBan className="inline-icon" />,
  "📈": <FaChartLine className="inline-icon" />,
  "🛠️": <FaTools className="inline-icon" />,
  "✅": <FaCheckCircle className="inline-icon text-green-500" />,
  "⭐": <FaStar className="inline-icon text-yellow-500" />,
  "❤️": <FaHeart className="inline-icon text-red-500" />,
  "🔐": <FaUserShield className="inline-icon" />,
  "💳": <FaCreditCard className="inline-icon" />,
  "📍": <FaMapMarkerAlt className="inline-icon" />,
  "🔔": <FaBell className="inline-icon" />,
  "🔍": <FaSearch className="inline-icon" />,
  "📦": <FaBoxOpen className="inline-icon" />,
  "📱": <FaMobile className="inline-icon" />,
  "🌐": <FaGlobe className="inline-icon" />,
  "👥": <FaUsers className="inline-icon" />,
  "🎨": <FaPaintBrush className="inline-icon" />,
  "📄": <FaFileCode className="inline-icon" />,
  "📚": <FaBook className="inline-icon" />,
  "💡": <FaLightbulb className="inline-icon" />,
  "🏷️": <FaLayerGroup className="inline-icon" />,
  "🐛": <FaWrench className="inline-icon" />,
};

const replaceEmojisWithIcons = (html) => {
  let result = html;
  Object.entries(emojiToIcon).forEach(([emoji, icon]) => {
    const iconHtml = ReactDOMServer.renderToStaticMarkup(icon);
    result = result.replace(new RegExp(emoji, "g"), iconHtml);
  });
  return result;
};

const styles = `.docs-content { color: #374151; font-size: 15px; line-height: 1.75; }
.docs-content > * + * { margin-top: 1.25rem; }
.docs-content h2 { font-size: 1.5rem; font-weight: 700; color: #111827; margin-top: 2.5rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; }
.docs-content h3 { font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-top: 2rem; margin-bottom: 0.75rem; }
.docs-content h4 { font-size: 1.1rem; font-weight: 700; color: #374151; margin-top: 1.5rem; margin-bottom: 0.5rem; }
.docs-content p { margin-bottom: 1rem; }
.docs-content a { color: #2563eb; }
.docs-content strong { font-weight: 700; color: #111827; }
.docs-content code { font-family: monospace; font-size: 0.875em; background: #f3f4f6; padding: 0.15rem 0.4rem; border-radius: 4px; color: #dc2626; }
.code-wrapper { margin: 1.5rem 0; border-radius: 8px; overflow: hidden; background: #1e1e1e; }
.code-header-inline { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #2d2d2d; }
.code-lang-inline { font-size: 12px; color: #888; text-transform: uppercase; }
.copy-btn-inline { padding: 4px 10px; font-size: 12px; color: #ccc; background: transparent; border: 1px solid #555; border-radius: 4px; cursor: pointer; }
.docs-content pre { background: #1e1e1e; color: #d4d4d4; padding: 1rem; overflow-x: auto; font-size: 13px; line-height: 1.6; margin: 0; }
.docs-content pre code { background: none; padding: 0; color: inherit; }
.code-keyword { color: #569cd6; }
.code-string { color: #ce9178; }
.code-comment { color: #6a9955; }
.code-number { color: #b5cea8; }
.docs-content ul, .docs-content ol { padding-left: 1.5rem; margin: 1rem 0; }
.docs-content ul { list-style-type: disc; }
.docs-content ol { list-style-type: decimal; }
.docs-content li { margin-bottom: 0.5rem; }
.docs-content blockquote { border-left: 4px solid #3b82f6; background: #eff6ff; padding: 1rem; margin: 1.5rem 0; }
.docs-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 14px; }
.docs-content th { text-align: left; padding: 0.75rem 1rem; font-weight: 700; border-bottom: 2px solid #e5e7eb; }
.docs-content td { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; }
.developer-section { max-width: 700px; }
.dev-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.dev-avatar { width: 80px; height: 80px; background: linear-gradient(135deg, #E23744, #ff6b6b); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: 700; }
.dev-header h2 { font-size: 1.75rem; font-weight: 700; color: #111827; margin: 0; }
.dev-title { color: #6b7280; margin: 0.25rem 0 0; }
.dev-bio { background: #f9fafb; padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
.skill-tag { background: #e0e7ff; color: #3730a3; padding: 0.35rem 0.75rem; border-radius: 9999px; font-size: 13px; }
.link-buttons { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
.dev-link { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 6px; font-size: 14px; text-decoration: none; }
.dev-link.github { background: #24292e; color: white; }
.dev-link.linkedin { background: #0077b5; color: white; }
.dev-link.email { background: #E23744; color: white; }
.dev-project { background: #fff; border: 1px solid #e5e7eb; padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem; }
.dev-project h4 { font-size: 0.95rem; font-weight: 600; margin: 1.25rem 0 0.75rem; color: #374151; }
.dev-project ul { margin: 0; padding-left: 1.25rem; }
.dev-project li { margin-bottom: 0.4rem; font-size: 14px; color: #4b5563; }
.dev-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.stat-card { background: #fff; border: 1px solid #e5e7eb; padding: 1rem; border-radius: 8px; text-align: center; }
.stat-number { display: block; font-size: 1.75rem; font-weight: 700; color: #E23744; }
.stat-label { font-size: 12px; color: #6b7280; }
.dev-section-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; font-weight: 700; color: #111827; margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; }
.dev-section-title svg { color: #E23744; }
.tech-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
.tech-item { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1rem 0.5rem; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; transition: all 0.2s; }
.tech-item:hover { border-color: #E23744; transform: translateY(-2px); }
.tech-item svg { font-size: 1.75rem; }
.tech-item span { font-size: 11px; font-weight: 500; color: #374151; text-align: center; }
.feature-list { display: grid; gap: 0.75rem; margin-bottom: 1.5rem; }
.feature-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem; background: #f9fafb; border-radius: 8px; }
.feature-item svg { color: #E23744; flex-shrink: 0; margin-top: 2px; }
.feature-item div { flex: 1; }
.feature-item strong { display: block; font-size: 14px; color: #111827; margin-bottom: 0.25rem; }
.feature-item p { font-size: 13px; color: #6b7280; margin: 0; }
.deployment-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.deploy-card { padding: 1rem; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; }
.deploy-card h5 { display: flex; align-items: center; gap: 0.5rem; font-size: 14px; font-weight: 600; margin: 0 0 0.5rem; }
.deploy-card p { font-size: 12px; color: #6b7280; margin: 0; }
.deploy-card a { color: #2563eb; font-size: 12px; word-break: break-all; }
@media (max-width: 640px) { .dev-stats { grid-template-columns: repeat(2, 1fr); } .deployment-cards { grid-template-columns: 1fr; } .tech-grid { grid-template-columns: repeat(3, 1fr); } }
.docs-content .badge-row, .docs-content div[align="center"] { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; align-items: center; margin: 1rem 0; }
.docs-content div[align="center"] img { display: inline-block; margin: 0.25rem; }
.docs-content div[align="center"] p { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; align-items: center; }
.docs-content img[src*="shields.io"], .docs-content img[src*="badge"] { display: inline-block; height: 22px; margin: 0.25rem; vertical-align: middle; }
.inline-icon { display: inline-block; vertical-align: middle; margin-right: 0.35rem; color: #E23744; font-size: 1em; }`;

const sanitizeHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  ["script", "iframe", "object", "embed", "form"].forEach((tag) => {
    const els = div.getElementsByTagName(tag);
    while (els.length > 0) els[0].parentNode.removeChild(els[0]);
  });
  let result = div.innerHTML;
  result = replaceEmojisWithIcons(result);
  return result;
};

const highlightCode = (code) => {
  let h = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  h = h.replace(/(\/\/.*$)/gm, '<span class="code-comment">$1</span>');
  h = h.replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|new|this|true|false|null|undefined|require|module|extends|implements|interface|type|enum|public|private|protected|static|readonly|abstract|override)\b/g, '<span class="code-keyword">$1</span>');
  h = h.replace(/\b(\d+\.?\d*)\b/g, '<span class="code-number">$1</span>');
  return h;
};

const DeveloperInfo = () => (
  <div className="developer-section">
    {/* Header */}
    <div className="dev-header">
      <div className="dev-avatar">AP</div>
      <div>
        <h2>Adarsh Priydarshi</h2>
        <p className="dev-title">Full Stack Developer</p>
      </div>
    </div>

    {/* Bio */}
    <div className="dev-bio">
      <p>Passionate full-stack developer with expertise in MERN stack, cloud technologies, and building scalable web applications. I love creating production-ready applications that solve real-world problems.</p>
    </div>

    {/* Connect Links */}
    <h3 className="dev-section-title"><FaUsers /> Connect With Me</h3>
    <div className="link-buttons">
      <a href="https://github.com/adarsh-priydarshi-5646" target="_blank" rel="noopener noreferrer" className="dev-link github"><FaGithub /> GitHub</a>
      <a href="https://www.linkedin.com/in/adarsh-p1/" target="_blank" rel="noopener noreferrer" className="dev-link linkedin"><FaLinkedin /> LinkedIn</a>
      <a href="mailto:priydarshiadarsh3@gmail.com" className="dev-link email"><FaEnvelope /> Email</a>
    </div>

    {/* Tech Stack */}
    <h3 className="dev-section-title"><FaCode /> Languages & Frameworks</h3>
    <div className="tech-grid">
      <div className="tech-item"><SiJavascript color="#F7DF1E" /><span>JavaScript</span></div>
      <div className="tech-item"><SiTypescript color="#3178C6" /><span>TypeScript</span></div>
      <div className="tech-item"><SiPython color="#3776AB" /><span>Python</span></div>
      <div className="tech-item"><SiReact color="#61DAFB" /><span>React</span></div>
      <div className="tech-item"><SiNextdotjs color="#000000" /><span>Next.js</span></div>
      <div className="tech-item"><SiNodedotjs color="#339933" /><span>Node.js</span></div>
      <div className="tech-item"><SiExpress color="#000000" /><span>Express</span></div>
      <div className="tech-item"><SiVite color="#646CFF" /><span>Vite</span></div>
      <div className="tech-item"><SiTailwindcss color="#06B6D4" /><span>Tailwind</span></div>
      <div className="tech-item"><SiRedux color="#764ABC" /><span>Redux</span></div>
      <div className="tech-item"><SiSocketdotio color="#010101" /><span>Socket.IO</span></div>
      <div className="tech-item"><SiGraphql color="#E10098" /><span>GraphQL</span></div>
    </div>

    {/* Databases */}
    <h3 className="dev-section-title"><FaDatabase /> Databases</h3>
    <div className="tech-grid">
      <div className="tech-item"><SiMongodb color="#47A248" /><span>MongoDB</span></div>
      <div className="tech-item"><SiPostgresql color="#4169E1" /><span>PostgreSQL</span></div>
      <div className="tech-item"><SiMysql color="#4479A1" /><span>MySQL</span></div>
      <div className="tech-item"><SiRedis color="#DC382D" /><span>Redis</span></div>
      <div className="tech-item"><SiFirebase color="#FFCA28" /><span>Firebase</span></div>
    </div>

    {/* DevOps & Cloud */}
    <h3 className="dev-section-title"><FaCloud /> DevOps & Cloud</h3>
    <div className="tech-grid">
      <div className="tech-item"><SiDocker color="#2496ED" /><span>Docker</span></div>
      <div className="tech-item"><SiKubernetes color="#326CE5" /><span>Kubernetes</span></div>
      <div className="tech-item"><FaAws color="#FF9900" /><span>AWS</span></div>
      <div className="tech-item"><SiGooglecloud color="#4285F4" /><span>GCP</span></div>
      <div className="tech-item"><SiVercel color="#000000" /><span>Vercel</span></div>
      <div className="tech-item"><SiRender color="#46E3B7" /><span>Render</span></div>
      <div className="tech-item"><SiJenkins color="#D24939" /><span>Jenkins</span></div>
      <div className="tech-item"><SiGithubactions color="#2088FF" /><span>GitHub Actions</span></div>
      <div className="tech-item"><SiNginx color="#009639" /><span>Nginx</span></div>
      <div className="tech-item"><SiLinux color="#FCC624" /><span>Linux</span></div>
    </div>

    {/* AI/ML & Data Science */}
    <h3 className="dev-section-title"><FaLightbulb /> AI/ML & Data Science</h3>
    <div className="tech-grid">
      <div className="tech-item"><SiTensorflow color="#FF6F00" /><span>TensorFlow</span></div>
      <div className="tech-item"><SiPytorch color="#EE4C2C" /><span>PyTorch</span></div>
      <div className="tech-item"><SiNumpy color="#013243" /><span>NumPy</span></div>
      <div className="tech-item"><SiPandas color="#150458" /><span>Pandas</span></div>
      <div className="tech-item"><FaChartLine color="#E23744" /><span>Data Analysis</span></div>
      <div className="tech-item"><FaCogs color="#6B7280" /><span>ML Models</span></div>
    </div>

    {/* Tools */}
    <h3 className="dev-section-title"><FaTools /> Tools & Others</h3>
    <div className="tech-grid">
      <div className="tech-item"><SiGit color="#F05032" /><span>Git</span></div>
      <div className="tech-item"><FaGithub color="#181717" /><span>GitHub</span></div>
      <div className="tech-item"><SiPostman color="#FF6C37" /><span>Postman</span></div>
      <div className="tech-item"><SiJest color="#C21325" /><span>Jest</span></div>
      <div className="tech-item"><SiFigma color="#F24E1E" /><span>Figma</span></div>
      <div className="tech-item"><VscCode color="#007ACC" /><span>VS Code</span></div>
      <div className="tech-item"><SiStripe color="#008CDD" /><span>Stripe</span></div>
      <div className="tech-item"><SiJsonwebtokens color="#000000" /><span>JWT</span></div>
      <div className="tech-item"><FaBuilding color="#6B7280" /><span>System Design</span></div>
      <div className="tech-item"><FaCode color="#6B7280" /><span>DSA</span></div>
    </div>

    {/* About Project */}
    <h3 className="dev-section-title"><FaRocket /> About BiteDash</h3>
    <div className="dev-project">
      <p>BiteDash is a production-ready food delivery platform demonstrating enterprise-level development skills. Built from scratch with modern technologies and best practices.</p>
      
      <h4><FaCogs /> Key Features</h4>
      <div className="feature-list">
        <div className="feature-item">
          <FaShieldAlt />
          <div>
            <strong>Secure Authentication</strong>
            <p>JWT tokens, Google OAuth, HttpOnly cookies, rate limiting</p>
          </div>
        </div>
        <div className="feature-item">
          <FaGlobe />
          <div>
            <strong>Real-time Updates</strong>
            <p>Live order tracking, instant notifications via Socket.IO</p>
          </div>
        </div>
        <div className="feature-item">
          <FaChartLine />
          <div>
            <strong>Payment Integration</strong>
            <p>Stripe checkout, secure payment processing</p>
          </div>
        </div>
        <div className="feature-item">
          <FaMobile />
          <div>
            <strong>Responsive Design</strong>
            <p>Mobile-first approach, works on all devices</p>
          </div>
        </div>
      </div>
    </div>

    {/* Deployment */}
    <h3 className="dev-section-title"><FaCloud /> Deployment</h3>
    <div className="deployment-cards">
      <div className="deploy-card">
        <h5><SiVercel color="#000" /> Frontend</h5>
        <p>Hosted on Vercel with global CDN</p>
        <a href="https://bitedash-food.vercel.app" target="_blank" rel="noopener noreferrer">bitedash-food.vercel.app</a>
      </div>
      <div className="deploy-card">
        <h5><SiRender color="#46E3B7" /> Backend</h5>
        <p>Hosted on Render with auto-deploy</p>
        <a href="https://food-delivery-full-stack-app-3.onrender.com" target="_blank" rel="noopener noreferrer">onrender.com</a>
      </div>
    </div>

    {/* Stats */}
    <h3 className="dev-section-title"><FaTools /> Project Stats</h3>
    <div className="dev-stats">
      <div className="stat-card"><span className="stat-number">17+</span><span className="stat-label">Pages</span></div>
      <div className="stat-card"><span className="stat-number">30+</span><span className="stat-label">APIs</span></div>
      <div className="stat-card"><span className="stat-number">62</span><span className="stat-label">Tests</span></div>
      <div className="stat-card"><span className="stat-number">15+</span><span className="stat-label">Libraries</span></div>
    </div>
  </div>
);

export default function Documentation() {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("introduction");
  const [activeDoc, setActiveDoc] = useState("technical");
  const contentRef = useRef(null);

  const navItems = {
    technical: [
      { id: "introduction", label: "Introduction", icon: <FaBook />, docs: null },
      { id: "overview", label: "Overview", icon: <FaCheckCircle />, docs: null },
      { id: "architecture", label: "Architecture", icon: <FaBuilding />, docs: null },
      { id: "frontend-guide", label: "Frontend Guide", icon: <SiReact />, docs: "https://react.dev" },
      { id: "backend-guide", label: "Backend Guide", icon: <SiNodedotjs />, docs: "https://nodejs.org/docs" },
      { id: "database-models", label: "Database Models", icon: <SiMongodb />, docs: "https://www.mongodb.com/docs" },
      { id: "api-reference", label: "API Reference", icon: <FaPlug />, docs: "https://expressjs.com/en/api.html" },
      { id: "real-time-events", label: "Real-Time Events", icon: <SiSocketdotio />, docs: "https://socket.io/docs" },
      { id: "state-management", label: "State Management", icon: <SiRedux />, docs: "https://redux-toolkit.js.org" },
      { id: "performance", label: "Performance", icon: <FaTachometerAlt />, docs: null },
      { id: "deployment", label: "Deployment", icon: <FaCloud />, docs: null },
      { id: "summary", label: "Summary", icon: <FaClipboardList />, docs: null },
    ],
    techstack: [
      { id: "introduction", label: "Introduction", icon: <FaBook />, docs: null },
      { id: "current-capacity", label: "Current Capacity", icon: <FaTachometerAlt />, docs: null },
      { id: "optimization-levels", label: "Optimization Levels", icon: <FaBolt />, docs: null },
      { id: "frontend-tech-stack", label: "Frontend Tech Stack", icon: <SiReact />, docs: "https://react.dev" },
      { id: "backend-tech-stack", label: "Backend Tech Stack", icon: <SiNodedotjs />, docs: "https://nodejs.org/docs" },
      { id: "security-implementation", label: "Security", icon: <FaShieldAlt />, docs: "https://owasp.org/www-project-web-security-testing-guide" },
      { id: "caching-strategy", label: "Caching Strategy", icon: <FaMemory />, docs: null },
      { id: "devops-cicd", label: "DevOps & CI/CD", icon: <FaCogs />, docs: "https://docs.github.com/en/actions" },
      { id: "current-architecture", label: "Current Architecture", icon: <FaBuilding />, docs: null },
      { id: "future-scaling-awsk8s", label: "Future Scaling", icon: <FaRocket />, docs: "https://kubernetes.io/docs" },
      { id: "enterprise-features-missing", label: "Enterprise Features", icon: <FaBoxOpen />, docs: null },
      { id: "summary", label: "Summary", icon: <FaClipboardList />, docs: null },
    ],
    interview: [
      { id: "how-to-use-this-guide", label: "How to Use This Guide", icon: <FaBook />, docs: null },
      { id: "project-overview-questions", label: "Project Overview", icon: <FaLightbulb />, docs: null },
      { id: "architecture-system-design", label: "Architecture & Design", icon: <FaBuilding />, docs: null },
      { id: "authentication-security", label: "Authentication & Security", icon: <FaLock />, docs: null },
      { id: "real-time-features-socketio", label: "Real-Time Features", icon: <SiSocketdotio />, docs: null },
      { id: "geospatial-features", label: "Geospatial Features", icon: <FaMapMarkerAlt />, docs: null },
      { id: "payment-integration", label: "Payment Integration", icon: <FaCreditCard />, docs: null },
      { id: "frontend-architecture-react", label: "Frontend Architecture", icon: <SiReact />, docs: null },
      { id: "deployment-devops", label: "Deployment & DevOps", icon: <FaRocket />, docs: null },
      { id: "debugging-problem-solving", label: "Debugging & Problem Solving", icon: <FaWrench />, docs: null },
      { id: "performance-optimization", label: "Performance & Optimization", icon: <FaTachometerAlt />, docs: null },
      { id: "learning-growth-questions", label: "Learning & Growth", icon: <FaBook />, docs: null },
      { id: "behavioral-questions", label: "Behavioral Questions", icon: <FaUsers />, docs: null },
      { id: "final-preparation-tips", label: "Final Preparation Tips", icon: <FaCheckCircle />, docs: null },
    ],
    developer: [{ id: "developer", label: "Developer Profile", icon: <FaUsers />, docs: null }],
  };

  const currentNavItems = navItems[activeDoc];

  useEffect(() => {
    if (activeDoc === "developer") {
      setSections({ developer: { title: "Developer", html: "" } });
      setActiveSection("developer");
      setLoading(false);
      return;
    }
    marked.setOptions({ gfm: true, breaks: false });
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const docFile = activeDoc === "technical" 
          ? "/docs/technical-documentation.md" 
          : activeDoc === "techstack"
          ? "/docs/tech-stack-deep-dive.md"
          : "/docs/interview-preparation.md";
        const res = await fetch(docFile);
        const text = await res.text();
        const parts = text.split(/^## /m);
        const sectionMap = {};
        parts.forEach((part, i) => {
          if (!part.trim()) return;
          if (i === 0) {
            const lines = part.split("\n");
            const titleLine = lines.find(l => l.startsWith("# "));
            const title = titleLine ? titleLine.replace(/^#\s*/, "").trim() : "Introduction";
            const content = lines.filter(l => !l.startsWith("# ")).join("\n").trim();
            sectionMap["introduction"] = { title, html: sanitizeHtml(marked.parse(content)) };
            return;
          }
          const lines = part.split("\n");
          const rawTitle = lines[0].trim();
          const content = lines.slice(1).join("\n").trim();
          const cleanTitle = rawTitle.replace(/[^\w\s&/()-]/g, "").trim();
          let id = cleanTitle.toLowerCase()
            .replace(/&/g, "-")
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
          sectionMap[id] = { title: cleanTitle || rawTitle, html: sanitizeHtml(marked.parse(content)) };
        });
        setSections(sectionMap);
        setActiveSection(currentNavItems[0]?.id || "introduction");
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch docs", err);
        setLoading(false);
      }
    };
    fetchDocs();
  }, [activeDoc]);

  useEffect(() => {
    if (!contentRef.current) return;
    const processCodeBlocks = () => {
      contentRef.current.querySelectorAll("pre").forEach(pre => {
        if (pre.parentElement?.classList.contains("code-wrapper")) return;
        const code = pre.querySelector("code");
        if (!code) return;
        
        const wrapper = document.createElement("div");
        wrapper.className = "code-wrapper";
        const header = document.createElement("div");
        header.className = "code-header-inline";
        const langMatch = code.className.match(/language-(\w+)/);
        const lang = langMatch ? langMatch[1] : "code";
        
        const langSpan = document.createElement("span");
        langSpan.className = "code-lang-inline";
        langSpan.textContent = lang;
        
        const copyBtn = document.createElement("button");
        copyBtn.className = "copy-btn-inline";
        copyBtn.textContent = "Copy";
        copyBtn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(code.textContent);
            copyBtn.textContent = "Copied!";
            setTimeout(() => { copyBtn.textContent = "Copy"; }, 2000);
          } catch (e) {
            console.error("Copy failed", e);
          }
        };
        
        header.appendChild(langSpan);
        header.appendChild(copyBtn);
        
        const originalText = code.textContent;
        code.innerHTML = highlightCode(originalText);
        
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
      });
    };
    
    setTimeout(processCodeBlocks, 100);
  }, [sections, activeSection]);

  const navigateToSection = (id) => { setActiveSection(id); setIsSidebarOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const currentIndex = currentNavItems.findIndex(item => item.id === activeSection);
  const prevSection = currentIndex > 0 ? currentNavItems[currentIndex - 1] : null;
  const nextSection = currentIndex < currentNavItems.length - 1 ? currentNavItems[currentIndex + 1] : null;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 rounded-full border-2 border-gray-900 border-r-transparent animate-spin"></div>
        <p className="mt-4 text-sm text-gray-600">Loading documentation...</p>
      </div>
    </div>
  );

  const sidebarClass = "fixed lg:sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-72 bg-white border-r border-gray-200 overflow-y-auto z-40 transition-transform duration-200 " + (isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50">
        <div className="h-full px-4 flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-md">
              {isSidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
            <a href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/BiteDash.png" alt="BiteDash Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">BiteDash Docs</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://bitedash-food.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E23744] text-white text-sm font-medium rounded-lg hover:bg-[#c92f3c] transition-colors">
              <FaRocket size={12} />
              Live App
            </a>
            <a href="https://github.com/adarsh-priydarshi-5646/Food-Delivery-Full-Stack-App" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900"><FaGithub size={20} /></a>
          </div>
        </div>
      </header>
      <div className="flex pt-14">
        <aside className={sidebarClass}>
          <div className="p-4">
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-6">
              <button onClick={() => setActiveDoc("technical")} className={"flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition-all " + (activeDoc === "technical" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600")}>Technical</button>
              <button onClick={() => setActiveDoc("techstack")} className={"flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition-all " + (activeDoc === "techstack" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600")}>Tech Stack</button>
              <button onClick={() => setActiveDoc("interview")} className={"flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition-all " + (activeDoc === "interview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600")}>Interview</button>
              <button onClick={() => setActiveDoc("developer")} className={"flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition-all " + (activeDoc === "developer" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600")}>Developer</button>
            </div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">{activeDoc === "technical" ? "Documentation" : activeDoc === "techstack" ? "Deep Dive" : activeDoc === "interview" ? "Interview Q&A" : "About"}</p>
            <ul className="space-y-0.5">
              {currentNavItems.map(item => (
                <li key={item.id}>
                  <button onClick={() => navigateToSection(item.id)} className={"w-full text-left px-3 py-2 rounded-md text-[13px] transition-colors flex items-center gap-2 " + (activeSection === item.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50")}>
                    <span className="text-[#E23744]">{item.icon}</span>
                    {item.label}
                    {item.docs && <FaExternalLinkAlt size={10} className="ml-auto text-gray-400" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/20 z-30 lg:hidden" />}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {activeDoc === "developer" ? <DeveloperInfo /> : sections[activeSection] ? (
              <div>
                <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
                  <a href="/" className="hover:text-blue-600">Home</a>
                  <FaChevronRight size={10} className="text-gray-400" />
                  <span className="text-gray-400">Docs</span>
                  <FaChevronRight size={10} className="text-gray-400" />
                  <span className="text-gray-900">{sections[activeSection].title}</span>
                </nav>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-[#E23744]">{currentNavItems.find(i => i.id === activeSection)?.icon}</span>
                    {sections[activeSection].title}
                  </h1>
                  {currentNavItems.find(i => i.id === activeSection)?.docs && (
                    <a 
                      href={currentNavItems.find(i => i.id === activeSection)?.docs} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      <FaBook size={14} />
                      Official Docs
                      <FaExternalLinkAlt size={10} />
                    </a>
                  )}
                </div>
                <article ref={contentRef} className="docs-content" dangerouslySetInnerHTML={{ __html: sections[activeSection].html }} />
                <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
                  {prevSection ? <button onClick={() => navigateToSection(prevSection.id)} className="group text-left"><span className="text-xs text-gray-500 block mb-1">← Previous</span><span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">{prevSection.label}</span></button> : <div />}
                  {nextSection && <button onClick={() => navigateToSection(nextSection.id)} className="group text-right"><span className="text-xs text-gray-500 block mb-1">Next →</span><span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">{nextSection.label}</span></button>}
                </div>
              </div>
            ) : <div className="text-center py-16"><p className="text-gray-500">Section not found.</p></div>}
          </div>
        </main>
      </div>
      <style>{styles}</style>
    </div>
  );
}
