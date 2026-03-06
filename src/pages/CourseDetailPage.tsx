import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ArrowLeft, Download, CheckCircle, Clock, Shield, BookOpen, Award, Users, Briefcase, Star, Wrench, FolderOpen, GraduationCap, Quote, Zap, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import courseCyber from "@/assets/course-cyber-security.jpg";
import courseVapt from "@/assets/course-vapt.jpg";
import courseCcna from "@/assets/course-ccna.jpg";
import courseThreat from "@/assets/course-threat-intel.jpg";
import courseGraphic from "@/assets/course-graphic-design.jpg";
import coursePython from "@/assets/course-python.jpg";
import courseRhcsa from "@/assets/course-rhcsa.jpg";
import toolsBg from "@/assets/tools-bg.jpg";
import projectsBg from "@/assets/projects-bg.jpg";

const courseImages: Record<string, string> = {
  "cyber-security": courseCyber,
  vapt: courseVapt,
  "ccna-network-security": courseCcna,
  "threat-intelligence": courseThreat,
  "graphic-designing": courseGraphic,
  python: coursePython,
  rhcsa: courseRhcsa,
};

const courseTools: Record<string, string[]> = {
  "cyber-security": ["Kali Linux", "Wireshark", "Metasploit", "Nmap", "Burp Suite", "John The Ripper", "Sqlmap", "Snort", "Nessus"],
  vapt: ["Burp Suite", "OWASP ZAP", "Nmap", "Metasploit", "Nikto", "Sqlmap", "Wireshark", "Nessus"],
  "ccna-network-security": ["Cisco Packet Tracer", "GNS3", "Wireshark", "PuTTY", "SolarWinds", "Nmap"],
  "threat-intelligence": ["MISP", "Maltego", "Shodan", "VirusTotal", "TheHive", "Splunk", "Wireshark"],
  python: ["Python 3", "VS Code", "Jupyter Notebook", "PyCharm", "Git", "Docker"],
  "graphic-designing": ["Adobe Photoshop", "Illustrator", "Figma", "Canva", "InDesign", "After Effects"],
  rhcsa: ["Red Hat Enterprise Linux", "VirtualBox", "VMware", "Ansible", "Bash", "Systemd"],
};

const toolEmojis: Record<string, string> = {
  "Kali Linux": "🐧", "Wireshark": "🦈", "Metasploit": "💉", "Nmap": "🗺️", "Burp Suite": "🔥",
  "John The Ripper": "🔓", "Sqlmap": "💾", "Snort": "🐷", "Nessus": "🛡️", "OWASP ZAP": "⚡",
  "Nikto": "🕷️", "Cisco Packet Tracer": "📡", "GNS3": "🌐", "PuTTY": "🖥️", "SolarWinds": "☀️",
  "MISP": "🎯", "Maltego": "🕸️", "Shodan": "👁️", "VirusTotal": "🦠", "TheHive": "🐝",
  "Splunk": "📊", "Python 3": "🐍", "VS Code": "💻", "Jupyter Notebook": "📓", "PyCharm": "🔧",
  "Git": "🌳", "Docker": "🐳", "Adobe Photoshop": "🎨", "Illustrator": "✏️", "Figma": "🖌️",
  "Canva": "🎭", "InDesign": "📐", "After Effects": "🎬", "Red Hat Enterprise Linux": "🎩",
  "VirtualBox": "📦", "VMware": "☁️", "Ansible": "⚙️", "Bash": "🐚", "Systemd": "🔄",
};

// Course-specific fallback data
const courseProjects: Record<string, { title: string; desc: string }[]> = {
  "cyber-security": [
    { title: "Phishing Simulation Setup", desc: "Design and execute realistic phishing campaigns to test organizational awareness" },
    { title: "Network Intrusion Detection", desc: "Set up and configure IDS/IPS systems to detect malicious network activity" },
    { title: "Malware Analysis Lab", desc: "Analyze real-world malware samples in a sandboxed environment" },
    { title: "Security Audit Report", desc: "Conduct a full security audit and produce a professional report" },
    { title: "Incident Response Drill", desc: "Simulate a breach and execute an incident response plan" },
    { title: "SIEM Dashboard Setup", desc: "Configure a SIEM tool to monitor and alert on security events" },
  ],
  vapt: [
    { title: "Web App Penetration Test", desc: "Find and exploit OWASP Top 10 vulnerabilities in web applications" },
    { title: "Network Vulnerability Scan", desc: "Perform comprehensive network scans and create remediation plans" },
    { title: "API Security Testing", desc: "Test REST APIs for authentication, injection, and access control flaws" },
    { title: "Mobile App Security Audit", desc: "Assess Android/iOS apps for data leakage and insecure storage" },
    { title: "Red Team Exercise", desc: "Plan and execute a simulated red team engagement" },
    { title: "Exploit Development", desc: "Write custom exploits for known vulnerabilities in a lab environment" },
  ],
  "ccna-network-security": [
    { title: "Enterprise Network Design", desc: "Design a scalable network for a medium-sized enterprise" },
    { title: "VLAN & Routing Config", desc: "Configure VLANs, inter-VLAN routing, and dynamic routing protocols" },
    { title: "Firewall Configuration Lab", desc: "Set up and configure ASA firewalls with access control lists" },
    { title: "VPN Tunnel Setup", desc: "Establish site-to-site and remote access VPN connections" },
    { title: "Network Troubleshooting", desc: "Diagnose and resolve complex network connectivity issues" },
    { title: "Wireless Network Security", desc: "Secure a wireless network with WPA3 and 802.1X authentication" },
  ],
  "threat-intelligence": [
    { title: "Threat Intelligence Report", desc: "Gather and analyze threat data to produce actionable intelligence reports" },
    { title: "IOC Hunting Lab", desc: "Use threat feeds to hunt for indicators of compromise in network logs" },
    { title: "Dark Web Monitoring", desc: "Monitor dark web forums for leaked credentials and threat actor activity" },
    { title: "APT Attribution Analysis", desc: "Analyze TTPs to attribute cyber attacks to threat actor groups" },
    { title: "Threat Landscape Assessment", desc: "Create a threat landscape assessment for a specific industry" },
    { title: "MITRE ATT&CK Mapping", desc: "Map attack techniques to the MITRE ATT&CK framework" },
  ],
  python: [
    { title: "Web Scraper Bot", desc: "Build an automated web scraper using BeautifulSoup and Selenium" },
    { title: "REST API Development", desc: "Create a full-featured REST API with Flask/FastAPI" },
    { title: "Data Analysis Dashboard", desc: "Analyze datasets and build interactive visualizations with Pandas" },
    { title: "Chat Application", desc: "Build a real-time chat application using WebSockets" },
    { title: "Automation Scripts", desc: "Create scripts to automate repetitive system administration tasks" },
    { title: "ML Prediction Model", desc: "Train and deploy a machine learning model for predictions" },
  ],
  "graphic-designing": [
    { title: "Brand Identity Package", desc: "Design a complete brand identity including logo, colors, and typography" },
    { title: "Social Media Campaign", desc: "Create a cohesive social media campaign with posts and stories" },
    { title: "UI/UX Mobile App Design", desc: "Design a mobile app interface with wireframes and prototypes" },
    { title: "Product Packaging Design", desc: "Create eye-catching packaging designs for consumer products" },
    { title: "Motion Graphics Reel", desc: "Produce animated graphics and motion design for digital media" },
    { title: "Website Landing Page", desc: "Design a high-converting landing page with visual hierarchy" },
  ],
  rhcsa: [
    { title: "Server Deployment Lab", desc: "Install and configure Red Hat Enterprise Linux servers from scratch" },
    { title: "User & Permission Management", desc: "Set up user accounts, groups, and file permission policies" },
    { title: "Storage Management", desc: "Configure LVM, partitions, and network file systems" },
    { title: "Service Configuration", desc: "Set up Apache, DNS, NFS, and other essential services" },
    { title: "Shell Scripting Automation", desc: "Write Bash scripts to automate server maintenance tasks" },
    { title: "System Security Hardening", desc: "Apply SELinux policies and firewall rules for server hardening" },
  ],
};

const courseStories: Record<string, { name: string; role: string; quote: string }[]> = {
  "cyber-security": [
    { name: "Rahul S.", role: "Security Analyst at TCS", quote: "HACKADEMIC's hands-on training helped me crack my first cybersecurity role within 3 months." },
    { name: "Priya M.", role: "SOC Analyst at Wipro", quote: "The practical lab sessions and industry tools experience made all the difference in interviews." },
    { name: "Amit K.", role: "Penetration Tester", quote: "Best cybersecurity training with real-world projects and excellent mentorship." },
  ],
  vapt: [
    { name: "Vikram R.", role: "VAPT Engineer at Deloitte", quote: "The practical pen-testing labs gave me confidence to handle real client engagements." },
    { name: "Sneha P.", role: "Security Consultant", quote: "Learned advanced exploitation techniques that I now use daily in my assessments." },
    { name: "Arjun D.", role: "Bug Bounty Hunter", quote: "Thanks to HACKADEMIC, I've earned over ₹5L in bug bounties within 6 months." },
  ],
  "ccna-network-security": [
    { name: "Karan T.", role: "Network Engineer at Infosys", quote: "The Cisco labs and hands-on routing exercises prepared me perfectly for the CCNA exam." },
    { name: "Deepa N.", role: "NOC Analyst", quote: "From zero networking knowledge to a full-time role in just 4 months!" },
    { name: "Rohan M.", role: "Network Admin at HCL", quote: "The practical troubleshooting skills I learned here are invaluable at my workplace." },
  ],
  "threat-intelligence": [
    { name: "Meera J.", role: "Threat Analyst at IBM", quote: "The OSINT and threat hunting modules were exactly what I needed for my career pivot." },
    { name: "Sanjay V.", role: "CTI Analyst", quote: "HACKADEMIC taught me to think like an adversary – essential for threat intelligence." },
    { name: "Pooja S.", role: "Security Researcher", quote: "The MITRE ATT&CK framework training here was more practical than any online course." },
  ],
  python: [
    { name: "Ankit G.", role: "Python Developer at Zoho", quote: "Went from complete beginner to building production-ready APIs in 3 months." },
    { name: "Divya R.", role: "Data Analyst", quote: "The data analysis projects helped me land a great role immediately after the course." },
    { name: "Nikhil P.", role: "Automation Engineer", quote: "I automated 80% of my team's repetitive tasks using skills learned at HACKADEMIC." },
  ],
  "graphic-designing": [
    { name: "Ishita M.", role: "UI/UX Designer at Flipkart", quote: "The design thinking approach and portfolio projects were key to getting hired." },
    { name: "Ravi K.", role: "Freelance Designer", quote: "Started earning ₹50K/month freelancing within 2 months of completing the course." },
    { name: "Tanvi S.", role: "Brand Designer", quote: "The Adobe suite mastery and real client projects gave me a professional edge." },
  ],
  rhcsa: [
    { name: "Suresh B.", role: "Linux Admin at Amazon", quote: "Cleared RHCSA certification on the first attempt thanks to the lab-intensive training." },
    { name: "Kavita D.", role: "DevOps Engineer", quote: "The Linux fundamentals here built a strong foundation for my DevOps career." },
    { name: "Manish T.", role: "System Administrator", quote: "The hands-on server management labs replicated real production environments perfectly." },
  ],
};

const courseTrainers: Record<string, { name: string; title: string; exp: string }[]> = {
  "cyber-security": [
    { name: "Mr. Rajesh Kumar", title: "CEH Certified Trainer", exp: "10+" },
    { name: "Ms. Anita Sharma", title: "CISSP Professional", exp: "8+" },
    { name: "Mr. Vikash Singh", title: "Security Researcher", exp: "12+" },
  ],
  vapt: [
    { name: "Mr. Arun Patel", title: "OSCP Certified Expert", exp: "9+" },
    { name: "Ms. Neha Gupta", title: "Web App Security Lead", exp: "7+" },
    { name: "Mr. Deepak Verma", title: "Red Team Specialist", exp: "11+" },
  ],
  "ccna-network-security": [
    { name: "Mr. Sunil Mehta", title: "CCNP Certified Trainer", exp: "12+" },
    { name: "Ms. Rekha Joshi", title: "Network Architect", exp: "10+" },
    { name: "Mr. Pankaj Yadav", title: "Cisco Specialist", exp: "8+" },
  ],
  "threat-intelligence": [
    { name: "Mr. Sameer Khan", title: "CTI Lead", exp: "10+" },
    { name: "Ms. Swati Mishra", title: "OSINT Specialist", exp: "7+" },
    { name: "Mr. Rajan Nair", title: "Malware Analyst", exp: "9+" },
  ],
  python: [
    { name: "Mr. Abhishek Roy", title: "Python Developer Lead", exp: "8+" },
    { name: "Ms. Megha Kapoor", title: "Data Science Trainer", exp: "6+" },
    { name: "Mr. Kunal Saxena", title: "Full Stack Developer", exp: "10+" },
  ],
  "graphic-designing": [
    { name: "Mr. Siddharth Bose", title: "Senior UI/UX Designer", exp: "9+" },
    { name: "Ms. Ritika Chauhan", title: "Adobe Certified Expert", exp: "7+" },
    { name: "Mr. Gaurav Tiwari", title: "Brand Design Lead", exp: "8+" },
  ],
  rhcsa: [
    { name: "Mr. Harish Reddy", title: "RHCE Certified Trainer", exp: "11+" },
    { name: "Ms. Pallavi Iyer", title: "Linux System Architect", exp: "9+" },
    { name: "Mr. Aman Khanna", title: "DevOps Specialist", exp: "7+" },
  ],
};

// Course-specific benefits
const courseBenefitsMap: Record<string, typeof benefitsData> = {
  "cyber-security": [
    { title: "CEH Certification Prep", icon: Award, color: "from-amber-500/20 to-amber-500/5", points: ["Aligned with EC-Council CEH syllabus", "Practice exams included", "Certification voucher assistance"] },
    { title: "Live Cyber Range Labs", icon: Wrench, color: "from-blue-500/20 to-blue-500/5", points: ["24/7 access to virtual labs", "Simulate real attack scenarios", "Use Kali Linux, Metasploit, Burp Suite"] },
    { title: "SOC Analyst Ready", icon: GraduationCap, color: "from-green-500/20 to-green-500/5", points: ["SIEM dashboard training", "Log analysis & monitoring", "Incident response drills"] },
    { title: "Expert Ethical Hackers", icon: Target, color: "from-purple-500/20 to-purple-500/5", points: ["Learn from CEH/OSCP professionals", "1-on-1 mentoring sessions", "Industry networking"] },
    { title: "Flexible Batches", icon: Zap, color: "from-cyan-500/20 to-cyan-500/5", points: ["Weekday & weekend options", "Online + offline modes", "1 year+ LMS access"] },
    { title: "100% Placement Support", icon: TrendingUp, color: "from-rose-500/20 to-rose-500/5", points: ["Resume & LinkedIn optimization", "Mock interviews with HR", "Direct company referrals"] },
  ],
  vapt: [
    { title: "OSCP Aligned Training", icon: Award, color: "from-amber-500/20 to-amber-500/5", points: ["Hands-on penetration testing labs", "Buffer overflow & exploit dev", "OWASP Top 10 mastery"] },
    { title: "Bug Bounty Skills", icon: Wrench, color: "from-blue-500/20 to-blue-500/5", points: ["HackerOne & Bugcrowd methodology", "Web & API security testing", "Real vulnerability discovery"] },
    { title: "Report Writing", icon: GraduationCap, color: "from-green-500/20 to-green-500/5", points: ["Professional VAPT reports", "Risk scoring & remediation", "Client presentation skills"] },
    { title: "Red Team Training", icon: Target, color: "from-purple-500/20 to-purple-500/5", points: ["Advanced exploitation techniques", "Social engineering simulations", "Post-exploitation tactics"] },
    { title: "Lab-Intensive", icon: Zap, color: "from-cyan-500/20 to-cyan-500/5", points: ["70% practical, 30% theory", "CTF challenges weekly", "HackTheBox integration"] },
    { title: "Career in Pentesting", icon: TrendingUp, color: "from-rose-500/20 to-rose-500/5", points: ["Pentest firm referrals", "Freelancing guidance", "Bug bounty earning support"] },
  ],
  "ccna-network-security": [
    { title: "CCNA Certification", icon: Award, color: "from-amber-500/20 to-amber-500/5", points: ["Full Cisco CCNA 200-301 prep", "Practice exams & dumps", "Certification guidance"] },
    { title: "Cisco Lab Access", icon: Wrench, color: "from-blue-500/20 to-blue-500/5", points: ["Packet Tracer & GNS3 labs", "Real Cisco router/switch config", "Enterprise network simulation"] },
    { title: "Network Design", icon: GraduationCap, color: "from-green-500/20 to-green-500/5", points: ["VLAN & routing protocols", "Network architecture planning", "Troubleshooting methodology"] },
    { title: "Security Focus", icon: Target, color: "from-purple-500/20 to-purple-500/5", points: ["Firewall & ACL configuration", "VPN setup & management", "Network security best practices"] },
    { title: "Hands-On Labs", icon: Zap, color: "from-cyan-500/20 to-cyan-500/5", points: ["Daily lab assignments", "Real hardware experience", "Network simulation projects"] },
    { title: "NOC/Network Careers", icon: TrendingUp, color: "from-rose-500/20 to-rose-500/5", points: ["Network engineer placements", "NOC analyst opportunities", "IT infrastructure roles"] },
  ],
  python: [
    { title: "Python Certification", icon: Award, color: "from-amber-500/20 to-amber-500/5", points: ["PCEP/PCAP aligned content", "Project-based assessment", "Portfolio certification"] },
    { title: "Full-Stack Python", icon: Wrench, color: "from-blue-500/20 to-blue-500/5", points: ["Django & Flask frameworks", "REST API development", "Database integration (SQL & NoSQL)"] },
    { title: "Data Science Intro", icon: GraduationCap, color: "from-green-500/20 to-green-500/5", points: ["Pandas & NumPy libraries", "Data visualization with Matplotlib", "Basic ML with Scikit-learn"] },
    { title: "Automation Skills", icon: Target, color: "from-purple-500/20 to-purple-500/5", points: ["Web scraping with BeautifulSoup", "Task automation scripts", "File & system management"] },
    { title: "Project-Based Learning", icon: Zap, color: "from-cyan-500/20 to-cyan-500/5", points: ["5+ real projects included", "GitHub portfolio building", "Code review sessions"] },
    { title: "Developer Careers", icon: TrendingUp, color: "from-rose-500/20 to-rose-500/5", points: ["Python developer placements", "Freelancing opportunities", "Interview DSA prep"] },
  ],
  "graphic-designing": [
    { title: "Adobe Certification", icon: Award, color: "from-amber-500/20 to-amber-500/5", points: ["Adobe Certified Associate prep", "Professional portfolio creation", "Design certificate"] },
    { title: "Complete Adobe Suite", icon: Wrench, color: "from-blue-500/20 to-blue-500/5", points: ["Photoshop, Illustrator, InDesign", "Figma & Canva Pro", "After Effects basics"] },
    { title: "Brand Design", icon: GraduationCap, color: "from-green-500/20 to-green-500/5", points: ["Logo & identity design", "Color theory & typography", "Brand guidelines creation"] },
    { title: "UI/UX Design", icon: Target, color: "from-purple-500/20 to-purple-500/5", points: ["Wireframing & prototyping", "User research methods", "Mobile-first design"] },
    { title: "Creative Projects", icon: Zap, color: "from-cyan-500/20 to-cyan-500/5", points: ["Real client projects", "Social media campaigns", "Print & digital media"] },
    { title: "Design Careers", icon: TrendingUp, color: "from-rose-500/20 to-rose-500/5", points: ["UI/UX designer placements", "Freelancing startup guide", "Portfolio website creation"] },
  ],
  rhcsa: [
    { title: "RHCSA Certification", icon: Award, color: "from-amber-500/20 to-amber-500/5", points: ["Red Hat EX200 exam aligned", "Practice exam environment", "Certification voucher assist"] },
    { title: "Linux Server Labs", icon: Wrench, color: "from-blue-500/20 to-blue-500/5", points: ["RHEL 9 hands-on labs", "Server deployment practice", "Cloud VM access included"] },
    { title: "System Administration", icon: GraduationCap, color: "from-green-500/20 to-green-500/5", points: ["User & group management", "Storage & LVM configuration", "Service management with systemd"] },
    { title: "Security Hardening", icon: Target, color: "from-purple-500/20 to-purple-500/5", points: ["SELinux policy management", "Firewalld configuration", "SSH & access controls"] },
    { title: "Shell Scripting", icon: Zap, color: "from-cyan-500/20 to-cyan-500/5", points: ["Bash scripting automation", "Cron jobs & scheduling", "System monitoring scripts"] },
    { title: "Linux Admin Careers", icon: TrendingUp, color: "from-rose-500/20 to-rose-500/5", points: ["Linux admin placements", "DevOps pathway guidance", "Cloud engineering prep"] },
  ],
};

// Default curriculum for courses without modules in DB
const defaultCurriculum: Record<string, string[]> = {
  "cyber-security": ["Introduction to Cybersecurity", "Networking Fundamentals", "Operating System Security", "Cryptography & PKI", "Web Application Security", "Network Security & Firewalls", "Ethical Hacking Methodology", "Vulnerability Assessment", "Penetration Testing", "Malware Analysis", "Incident Response", "SIEM & Log Analysis", "Cloud Security", "Mobile Security", "IoT Security", "Cyber Law & Compliance", "Security Audit & Governance", "Career Preparation & Soft Skills"],
  vapt: ["VAPT Introduction & Methodology", "Information Gathering & Recon", "Network Scanning with Nmap", "Vulnerability Scanning", "Web App Testing (OWASP Top 10)", "SQL Injection & XSS", "Authentication & Session Attacks", "API Security Testing", "Burp Suite Mastery", "Metasploit Framework", "Post Exploitation", "Privilege Escalation", "Wireless Network Testing", "Mobile App Security", "VAPT Report Writing", "Remediation Strategies"],
  "ccna-network-security": ["Network Fundamentals", "OSI & TCP/IP Models", "Ethernet & Switching", "VLANs & Inter-VLAN Routing", "IP Addressing & Subnetting", "Static & Dynamic Routing", "OSPF Configuration", "Network Security Concepts", "Access Control Lists (ACLs)", "NAT & PAT", "VPN Technologies", "Wireless Networking", "Network Automation Basics", "QoS Fundamentals", "Network Troubleshooting", "CCNA Exam Preparation"],
  "threat-intelligence": ["Intro to Threat Intelligence", "Cyber Threat Landscape", "OSINT Techniques", "Dark Web Monitoring", "Threat Actor Profiling", "MITRE ATT&CK Framework", "Indicators of Compromise", "Threat Hunting Methodology", "SIEM & Log Analysis", "Malware Triage", "Threat Intelligence Platforms", "Report Writing & Sharing", "Incident Response Integration", "Geopolitical Cyber Threats", "Threat Modeling", "CTI Career Preparation"],
  python: ["Python Basics & Setup", "Variables, Data Types & Operators", "Control Flow & Loops", "Functions & Modules", "Object-Oriented Programming", "File Handling", "Error Handling & Debugging", "Data Structures", "Regular Expressions", "Web Scraping", "Database Connectivity", "Flask Web Framework", "REST API Development", "Data Analysis with Pandas", "Visualization with Matplotlib", "Introduction to Machine Learning", "Automation Scripts", "Project: Full-Stack App"],
  "graphic-designing": ["Design Thinking & Principles", "Color Theory & Typography", "Adobe Photoshop Fundamentals", "Advanced Photoshop Techniques", "Adobe Illustrator Basics", "Vector Design & Logo Creation", "Layout Design with InDesign", "Figma UI/UX Design", "Wireframing & Prototyping", "Brand Identity Design", "Social Media Graphics", "Print Design & Prepress", "Motion Graphics Basics", "Portfolio Development", "Client Communication", "Freelancing & Career Guide"],
  rhcsa: ["Linux Introduction & Installation", "File System & Navigation", "User & Group Management", "File Permissions & ACLs", "Vi/Vim Editor", "Package Management (YUM/DNF)", "Process Management", "Service Management (systemd)", "Disk Partitioning & LVM", "File Systems & Mounting", "Networking Configuration", "Firewalld & Security", "SELinux Administration", "Shell Scripting Basics", "Cron Jobs & Automation", "Troubleshooting & Recovery", "RHCSA Exam Preparation"],
};

const benefitsData = [
  { title: "Recognized Certification", icon: Award, color: "from-amber-500/20 to-amber-500/5", points: ["Gain credentials that boost your career prospects", "Earn industry-recognized certifications", "Showcase verified skills to employers"] },
  { title: "Practical Training", icon: Wrench, color: "from-blue-500/20 to-blue-500/5", points: ["Learn through hands-on lab environments", "Work on real-world scenarios", "Master industry standard tools"] },
  { title: "Career Growth", icon: GraduationCap, color: "from-green-500/20 to-green-500/5", points: ["100% placement assistance", "Resume building workshops", "Mock interviews and career guidance"] },
  { title: "Expert Mentorship", icon: Target, color: "from-purple-500/20 to-purple-500/5", points: ["Learn from certified professionals", "One-on-one doubt clearing sessions", "Industry networking opportunities"] },
  { title: "Flexible Learning", icon: Zap, color: "from-cyan-500/20 to-cyan-500/5", points: ["Online & offline modes available", "Weekend batches for working professionals", "1 year+ LMS access"] },
  { title: "Industry Ready", icon: TrendingUp, color: "from-rose-500/20 to-rose-500/5", points: ["Real-world project portfolio", "Soft skills & personality development", "Interview preparation sessions"] },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [inquiryForm, setInquiryForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").eq("slug", slug).single();
      return data;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["course-projects", course?.id],
    queryFn: async () => {
      const { data } = await supabase.from("course_projects").select("*").eq("course_id", course!.id).order("sort_order");
      return data || [];
    },
    enabled: !!course?.id,
  });

  const { data: stories } = useQuery({
    queryKey: ["student-stories", course?.id],
    queryFn: async () => {
      const { data } = await supabase.from("student_stories").select("*").eq("course_id", course!.id).order("sort_order");
      return data || [];
    },
    enabled: !!course?.id,
  });

  const { data: trainers } = useQuery({
    queryKey: ["expert-trainers"],
    queryFn: async () => {
      const { data } = await supabase.from("expert_trainers").select("*").order("sort_order");
      return data || [];
    },
  });

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("course_inquiries").insert([{ ...inquiryForm, course_id: course?.id }]);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Inquiry Submitted!", description: "We'll get back to you soon." });
      setInquiryForm({ full_name: "", email: "", phone: "", message: "" });
    }
  };

  if (isLoading) return <PublicLayout><div className="flex items-center justify-center min-h-[60vh]"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div></PublicLayout>;
  if (!course) return <PublicLayout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Course not found</p></div></PublicLayout>;

  const rawModules = course.modules;
  const modules: string[] = Array.isArray(rawModules) ? rawModules.map(String) : [];
  const tools = courseTools[course.slug] || ["Kali Linux", "Wireshark", "Metasploit", "Nmap", "Burp Suite"];
  const fallbackProjects = courseProjects[course.slug] || courseProjects["cyber-security"];
  const fallbackStories = courseStories[course.slug] || courseStories["cyber-security"];
  const fallbackTrainers = courseTrainers[course.slug] || courseTrainers["cyber-security"];

  const courseHighlights = [
    { icon: Briefcase, value: "100%", label: "Job Assistance" },
    { icon: BookOpen, value: `${modules.length}+`, label: "Modules" },
    { icon: Wrench, value: `${tools.length}+`, label: "Tools" },
    { icon: Users, value: "15", label: "PDP Sessions" },
    { icon: FolderOpen, value: "5+", label: "Projects" },
    { icon: Clock, value: "1yr+", label: "LMS Access" },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={courseImages[course.slug] || courseCyber} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/70" />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(hsl(var(--primary)/0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.4) 1px, transparent 1px)", backgroundSize: "50px 50px" }} animate={{ backgroundPosition: ["0px 0px", "50px 50px"] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} />
          {[...Array(10)].map((_, i) => (
            <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-primary/40" style={{ left: `${10 + i * 9}%`, top: `${15 + (i % 4) * 22}%` }} animate={{ y: [-20, 20, -20], opacity: [0.1, 0.6, 0.1], scale: [0.5, 1.5, 0.5] }} transition={{ repeat: Infinity, duration: 2.5 + i * 0.3 }} />
          ))}
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Link to="/courses" className="inline-flex items-center gap-1 text-primary mb-4 hover:underline text-sm"><ArrowLeft className="h-4 w-4" /> Back to Courses</Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }} className="inline-block mb-3 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
                <span className="text-primary text-xs font-semibold">🔥 Most Popular Program</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4" style={{ color: "white" }}>{course.title}</motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{course.description?.substring(0, 200)}...</motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-6 mb-6">
                {course.duration && (
                  <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.8)" }}>
                    <Clock className="h-5 w-5 text-primary" /><div><p className="text-xs opacity-70">Duration</p><p className="font-bold">{course.duration}</p></div>
                  </div>
                )}
                <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.8)" }}><BookOpen className="h-5 w-5 text-primary" /><div><p className="text-xs opacity-70">Mode</p><p className="font-bold">Online/Offline</p></div></div>
                <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.8)" }}><Shield className="h-5 w-5 text-primary" /><div><p className="text-xs opacity-70">Level</p><p className="font-bold">Beginner to Advanced</p></div></div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex gap-3">
                <Link to={`/apply/${course.slug}`}><Button size="lg" className="gap-2"><Zap className="h-4 w-4" /> Enroll Now</Button></Link>
                {course.brochure_url && (
                  <a href={course.brochure_url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 gap-2"><Download className="h-4 w-4" /> Get Brochure</Button>
                  </a>
                )}
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.85, rotateY: 10 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10 relative">
                <img src={courseImages[course.slug] || courseCyber} alt={course.title} className="w-full h-72 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/40 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Highlights */}
      <section className="relative -mt-10 z-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl border border-border shadow-xl p-8">
            <h2 className="text-center font-heading font-bold text-2xl text-foreground mb-8">Course <span className="text-primary">Highlights</span></h2>
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {courseHighlights.map((h) => (
                <motion.div key={h.label} variants={itemVariants} whileHover={{ scale: 1.08, y: -5 }} className="text-center cursor-default">
                  <motion.div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}><h.icon className="h-7 w-7 text-primary" /></motion.div>
                  <div className="text-2xl font-heading font-bold text-foreground">{h.value}</div>
                  <div className="text-xs text-muted-foreground">{h.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Course Curriculum */}
      {modules.length > 0 && (
        <Section>
          <SectionTitle subtitle="Curriculum" title="Course Curriculum" description="Comprehensive modules designed by industry experts" />
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {modules.map((mod, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.03, x: 8 }} className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-default">
                <motion.div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors" whileHover={{ rotate: 360 }} transition={{ duration: 0.4 }}>
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </motion.div>
                <span className="text-sm text-foreground">{mod}</span>
              </motion.div>
            ))}
          </motion.div>
        </Section>
      )}

      {/* Benefits */}
      <Section className="bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 5 }} />
          <motion.div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1.3, 1, 1.3] }} transition={{ repeat: Infinity, duration: 7 }} />
        </div>
        <div className="relative z-10">
          <SectionTitle subtitle="Why Join" title="Benefits of this Program" description="What makes HACKADEMIC's training stand out from the rest" />
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefitsData.map((benefit) => (
              <motion.div key={benefit.title} variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} className="bg-card rounded-2xl border border-border p-7 hover:shadow-xl hover:border-primary/30 transition-all group">
                <motion.div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-5`} whileHover={{ rotate: 15, scale: 1.1 }}>
                  <benefit.icon className="h-7 w-7 text-primary" />
                </motion.div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-4 group-hover:text-primary transition-colors">{benefit.title}</h3>
                <ul className="space-y-2.5">
                  {benefit.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />{p}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Industry Standard Tools */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"><img src={toolsBg} alt="" className="w-full h-full object-cover" /></div>
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 6 }} />
        </div>
        <div className="relative z-10">
          <SectionTitle subtitle="Master" title="Industry Standard Tools" description="Get hands-on experience with the tools used by professionals worldwide" />
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {tools.map((tool) => (
              <motion.div key={tool} variants={itemVariants} whileHover={{ scale: 1.12, y: -8, rotate: 2 }} className="bg-card rounded-xl border border-border px-6 py-4 flex items-center gap-3 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all cursor-default">
                <motion.span className="text-2xl" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: Math.random() * 2 }}>{toolEmojis[tool] || "🔧"}</motion.span>
                <span className="font-medium text-foreground text-sm">{tool}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Real World Projects */}
      <Section className="bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"><img src={projectsBg} alt="" className="w-full h-full object-cover" /></div>
        <div className="relative z-10">
          <SectionTitle subtitle="Hands-On" title="Real World Projects" description="Build practical skills through industry-relevant projects" />
          {(projects && projects.length > 0) ? (
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {projects.map((project) => (
                <motion.div key={project.id} variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group">
                  {project.image_url && (<div className="overflow-hidden"><img src={project.image_url} alt={project.title} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500" /></div>)}
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {fallbackProjects.map((p) => (
                <motion.div key={p.title} variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:border-primary/30 transition-all group cursor-default">
                  <motion.div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <FolderOpen className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </Section>

      {/* Student Stories */}
      <Section>
        <SectionTitle subtitle="Testimonials" title="Our Student Stories" description="Hear from students who transformed their careers with HACKADEMIC" />
        {(stories && stories.length > 0) ? (
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stories.map((story) => (
              <motion.div key={story.id} variants={itemVariants} whileHover={{ y: -8 }} className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:border-primary/30 transition-all relative group">
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4 group-hover:text-primary/40 transition-colors" />
                <div className="flex items-center gap-3 mb-4">
                  {story.image_url ? (
                    <img src={story.image_url} alt={story.student_name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"><Users className="h-6 w-6 text-primary" /></div>
                  )}
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{story.student_name}</h4>
                    <p className="text-xs text-muted-foreground">{story.designation} {story.company && `at ${story.company}`}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">"{story.testimonial}"</p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {fallbackStories.map((s) => (
              <motion.div key={s.name} variants={itemVariants} whileHover={{ y: -8 }} className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:border-primary/30 transition-all relative group cursor-default">
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4 group-hover:text-primary/40 transition-colors" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"><Star className="h-5 w-5 text-primary" /></div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{s.name}</h4>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">"{s.quote}"</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Section>

      {/* Expert Trainers */}
      <Section className="bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 6 }} />
        </div>
        <div className="relative z-10">
          <SectionTitle subtitle="Faculty" title="Our Expert Trainers" description="Learn from certified professionals with years of industry experience" />
          {(trainers && trainers.length > 0) ? (
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {trainers.map((trainer) => (
                <motion.div key={trainer.id} variants={itemVariants} whileHover={{ y: -10, scale: 1.03 }} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group">
                  {trainer.image_url ? (
                    <div className="overflow-hidden"><img src={trainer.image_url} alt={trainer.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"><GraduationCap className="h-16 w-16 text-primary/30" /></div>
                  )}
                  <div className="p-5 text-center">
                    <h3 className="font-heading font-semibold text-foreground">{trainer.name}</h3>
                    <p className="text-sm text-primary">{trainer.designation}</p>
                    {trainer.experience_years && (<p className="text-xs text-muted-foreground mt-1">{trainer.experience_years}+ years experience</p>)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {fallbackTrainers.map((t) => (
                <motion.div key={t.name} variants={itemVariants} whileHover={{ y: -10, scale: 1.03 }} className="bg-card rounded-2xl border border-border p-8 text-center hover:shadow-xl hover:border-primary/30 transition-all cursor-default">
                  <motion.div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-4" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                    <GraduationCap className="h-10 w-10 text-primary" />
                  </motion.div>
                  <h3 className="font-heading font-semibold text-foreground">{t.name}</h3>
                  <p className="text-sm text-primary">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.exp} years experience</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </Section>

      {/* Inquire Now */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 8 }} />
          <motion.div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1.2, 1, 1.2] }} transition={{ repeat: Infinity, duration: 6 }} />
        </div>
        <div className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionTitle subtitle="Get Started" title="Inquire Now" description="Take the first step towards your career" center={false} />
              <div className="space-y-3 mt-4">
                {["Expert Career Guidance", "Free Demo Classes", "Flexible Timings", "100% Placement Support"].map((item, i) => (
                  <motion.div key={item} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}><CheckCircle className="h-5 w-5 text-primary flex-shrink-0" /></motion.div>
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30, rotateY: 5 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} viewport={{ once: true }}>
              <form onSubmit={handleInquiry} className="bg-card rounded-2xl border border-border p-8 space-y-4 shadow-xl">
                <h3 className="font-heading font-bold text-xl text-foreground mb-2">Request Information</h3>
                <Input placeholder="Full Name *" value={inquiryForm.full_name} onChange={(e) => setInquiryForm({ ...inquiryForm, full_name: e.target.value })} required />
                <Input placeholder="Email *" type="email" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} required />
                <Input placeholder="Phone *" value={inquiryForm.phone} onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })} required />
                <Textarea placeholder="Message (optional)" value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} rows={3} />
                <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Submitting..." : "Submit Inquiry"}</Button>
              </form>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        <motion.div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} animate={{ backgroundPosition: ["0px 0px", "30px 30px"] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-heading font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Link to={`/apply/${course.slug}`}><Button size="lg" variant="secondary" className="gap-2">Apply Now <ArrowLeft className="h-4 w-4 rotate-180" /></Button></Link>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
