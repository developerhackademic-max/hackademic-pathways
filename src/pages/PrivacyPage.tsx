import { PublicLayout } from "@/components/PublicLayout";
import { motion } from "framer-motion";

const PrivacyPage = () => (
  <PublicLayout>
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 1, 2026</p>

          <div className="prose prose-sm max-w-none space-y-6 text-foreground/80">
            <h2 className="text-xl font-heading font-semibold text-foreground">1. Introduction</h2>
            <p>HACKADEMIC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">2. Information We Collect</h2>
            <p><strong>Personal Information:</strong> We may collect personal information that you voluntarily provide, including but not limited to: name, email address, phone number, postal address, educational background, and payment information.</p>
            <p><strong>Usage Data:</strong> We automatically collect certain information when you access our website, including your IP address, browser type, operating system, referring URLs, pages viewed, and the dates/times of your visits.</p>
            <p><strong>Cookies and Tracking:</strong> We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">3. How We Use Your Information</h2>
            <p>We use the collected information to: (a) provide, maintain, and improve our services; (b) process course enrollments and payments; (c) send administrative information, updates, and marketing communications; (d) respond to your inquiries and provide customer support; (e) analyze usage trends and improve our website; (f) issue and verify certificates; (g) comply with legal obligations.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">4. Information Sharing and Disclosure</h2>
            <p>We do not sell your personal information to third parties. We may share your information with: (a) service providers who assist us in operating our website and delivering services; (b) law enforcement or government agencies when required by law; (c) business partners for joint offerings with your consent; (d) in connection with a merger, acquisition, or sale of assets.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">5. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information, including encryption, access controls, and secure data storage. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">6. Data Retention</h2>
            <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Certificate records are retained indefinitely for verification purposes.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">7. Your Rights</h2>
            <p>You have the right to: (a) access your personal information; (b) correct inaccurate data; (c) request deletion of your data; (d) opt out of marketing communications; (e) withdraw consent where applicable; (f) lodge a complaint with a supervisory authority.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">8. Children's Privacy</h2>
            <p>Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child without parental consent, we will take steps to delete that information.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">9. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">10. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
            <p>Email: support@hackademic.in<br />Phone: +91 7668116055</p>
          </div>
        </motion.div>
      </div>
    </section>
  </PublicLayout>
);

export default PrivacyPage;
