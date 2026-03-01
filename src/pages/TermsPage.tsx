import { PublicLayout } from "@/components/PublicLayout";
import { motion } from "framer-motion";

const TermsPage = () => (
  <PublicLayout>
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-8">Terms and Conditions</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 1, 2026</p>

          <div className="prose prose-sm max-w-none space-y-6 text-foreground/80">
            <h2 className="text-xl font-heading font-semibold text-foreground">1. Agreement to Terms</h2>
            <p>By accessing and using the HACKADEMIC website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">2. Description of Services</h2>
            <p>HACKADEMIC provides cybersecurity education, training courses, certification programs, and related professional services. Our services include but are not limited to online and offline training, security audits, corporate training, and certification verification.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">3. User Accounts</h2>
            <p>When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">4. Intellectual Property Rights</h2>
            <p>All content on this website, including text, graphics, logos, images, course materials, videos, and software, is the property of HACKADEMIC and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">5. Course Enrollment and Payment</h2>
            <p>By enrolling in a course, you agree to pay all applicable fees. All payments are non-refundable unless otherwise stated in our refund policy. We reserve the right to modify course pricing at any time. Access to course materials is granted for the duration specified at the time of enrollment.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">6. Certification</h2>
            <p>Certificates are issued upon successful completion of course requirements. HACKADEMIC reserves the right to revoke certificates if obtained through fraudulent means. Certificate verification is available through our online verification system.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">7. User Conduct</h2>
            <p>You agree not to: (a) use our services for any unlawful purpose; (b) attempt to gain unauthorized access to our systems; (c) share course materials with unauthorized individuals; (d) engage in any activity that disrupts or interferes with our services; (e) use knowledge gained from our courses for malicious purposes.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">8. Limitation of Liability</h2>
            <p>HACKADEMIC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">9. Privacy</h2>
            <p>Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding your personal data.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">10. Modifications to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through our website. Your continued use of our services after any modifications constitutes acceptance of the updated terms.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">11. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.</p>

            <h2 className="text-xl font-heading font-semibold text-foreground">12. Contact Information</h2>
            <p>If you have any questions about these Terms and Conditions, please contact us at support@hackademic.in.</p>
          </div>
        </motion.div>
      </div>
    </section>
  </PublicLayout>
);

export default TermsPage;
