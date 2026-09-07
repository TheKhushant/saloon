import LegalPage from "@/components/LegalPage";

const PrivacyPolicy = () => (
  <LegalPage
    title="Privacy Policy"
    crumbLabel="Privacy Policy"
    updatedOn="August 10, 2026"
    intro="How Glam Aura collects, uses, and protects your information."
    sections={[
      {
        heading: "1. Information We Collect",
        body: (
          <p>
            We collect information you provide directly — such as your name, email, phone number, and
            appointment preferences — when you create an account, book a service, or purchase a product.
            We also collect basic usage data (pages visited, device type) to improve the experience.
          </p>
        ),
      },
      {
        heading: "2. How We Use Your Information",
        body: (
          <p>
            Your information is used to process bookings and orders, send appointment reminders and
            confirmations, personalize recommendations, and respond to support requests. We do not sell
            your personal information to third parties.
          </p>
        ),
      },
      {
        heading: "3. Data Storage & Security",
        body: (
          <p>
            We apply reasonable technical and organizational measures to protect your data against
            unauthorized access, alteration, or loss. No online service can guarantee absolute security,
            so we encourage you to use a strong, unique password for your account.
          </p>
        ),
      },
      {
        heading: "4. Cookies",
        body: (
          <p>
            We use cookies and similar technologies to keep you signed in, remember your preferences, and
            understand how the site is used. You can control cookies through your browser settings.
          </p>
        ),
      },
      {
        heading: "5. Your Rights",
        body: (
          <p>
            You may access, correct, or request deletion of your personal information at any time from
            your account settings, or by contacting us at hello@glamaura.com.
          </p>
        ),
      },
      {
        heading: "6. Changes to This Policy",
        body: (
          <p>
            We may update this policy periodically. Material changes will be communicated via email or an
            in-app notice before they take effect.
          </p>
        ),
      },
    ]}
  />
);

export default PrivacyPolicy;
