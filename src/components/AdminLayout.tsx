import { useEffect, useState, ReactNode } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Briefcase, Users, Award, FileText, Settings, LogOut, Mail, LayoutDashboard, Trophy, Camera, MessageSquare, Star, FolderOpen, GraduationCap, HelpCircle, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const adminLinks = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Courses", path: "/admin/courses", icon: BookOpen },
  { label: "Services", path: "/admin/services", icon: Briefcase },
  { label: "Team", path: "/admin/team", icon: Users },
  { label: "Certificates", path: "/admin/certificates", icon: Award },
  { label: "Blogs", path: "/admin/blogs", icon: FileText },
  { label: "Applications", path: "/admin/applications", icon: Mail },
  { label: "Inquiries", path: "/admin/inquiries", icon: MessageSquare },
  { label: "Student Stories", path: "/admin/student-stories", icon: Star },
  { label: "Projects", path: "/admin/projects", icon: FolderOpen },
  { label: "Trainers", path: "/admin/trainers", icon: GraduationCap },
  { label: "FAQs", path: "/admin/faqs", icon: HelpCircle },
  { label: "Sample Certificates", path: "/admin/sample-certificates", icon: Image },
  { label: "Achievements", path: "/admin/achievements", icon: Trophy },
  { label: "Success Gallery", path: "/admin/success-gallery", icon: Camera },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin/login");
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="HACKADEMIC" className="h-8 w-8 object-contain" />
            <span className="font-heading font-bold text-lg text-foreground">
              HACK<span className="text-primary">ACADEMIC</span>
            </span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === link.path
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
