import LegalPage from "@/components/LegalPage";

const Terms = () => (
  <LegalPage
    title="Terms & Conditions"
    crumbLabel="Terms & Conditions"
    updatedOn="August 10, 2026"
    intro="The rules that govern your use of the Glam Aura platform."
    sections={[
      {
        heading: "1. Acceptance of Terms",
        body: (
          <p>
            By creating an account or booking a service through Glam Aura, you agree to be bound by these
            Terms & Conditions. If you do not agree, please do not use the platform.
          </p>
        ),
      },
      {
        heading: "2. Bookings & Appointments",
        body: (
          <p>
            Appointments are subject to stylist and branch availability. Bookings may be cancelled free of
            charge up to 1 hour before the scheduled time; cancellations after this window may not be
            refunded. Glam Aura reserves the right to reschedule appointments in exceptional circumstances.
          </p>
        ),
      },
      {
        heading: "3. Payments & Pricing",
        body: (
          <p>
            Prices displayed at the time of booking or purchase are final unless a valid coupon or offer
            applies. Glam Aura reserves the right to update pricing for future bookings at any time.
          </p>
        ),
      },
      {
        heading: "4. User Accounts",
        body: (
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all
            activity under your account. Notify us immediately of any unauthorized use.
          </p>
        ),
      },
      {
        heading: "5. Loyalty Points",
        body: (
          <p>
            Loyalty points are earned on completed bookings and orders and may be redeemed per the terms
            shown in your dashboard. Points have no cash value and may expire or be forfeited if the
            account is inactive for an extended period.
          </p>
        ),
      },
      {
        heading: "6. Limitation of Liability",
        body: (
          <p>
            Glam Aura is not liable for indirect or consequential damages arising from use of the platform,
            to the maximum extent permitted by applicable law.
          </p>
        ),
      },
      {
        heading: "7. Governing Law",
        body: <p>These terms are governed by the laws of India, without regard to conflict-of-law principles.</p>,
      },
    ]}
  />
);

export default Terms;
