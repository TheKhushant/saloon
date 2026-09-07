import LegalPage from "@/components/LegalPage";

const RefundPolicy = () => (
  <LegalPage
    title="Refund & Cancellation Policy"
    crumbLabel="Refund & Cancellation"
    updatedOn="August 10, 2026"
    intro="How cancellations, refunds, and returns are handled at Glam Aura."
    sections={[
      {
        heading: "1. Appointment Cancellations",
        body: (
          <p>
            Appointments can be cancelled free of charge up to 1 hour before the scheduled time from your
            dashboard. Cancellations made within the 1-hour window are non-refundable, as the slot is
            reserved exclusively for you.
          </p>
        ),
      },
      {
        heading: "2. No-Shows",
        body: (
          <p>
            If you do not arrive for a confirmed appointment without cancelling in advance, the booking
            amount (where prepaid) is forfeited.
          </p>
        ),
      },
      {
        heading: "3. Product Returns",
        body: (
          <p>
            Unopened, unused products may be returned within 7 days of delivery for a full refund. Opened
            or used items are not eligible for return unless defective.
          </p>
        ),
      },
      {
        heading: "4. Refund Timeline",
        body: (
          <p>
            Approved refunds are processed to the original payment method within 5–7 business days,
            depending on your bank or payment provider.
          </p>
        ),
      },
      {
        heading: "5. Contact Us",
        body: (
          <p>
            For any refund or cancellation query, reach out at hello@glamaura.com or through the Contact
            page — our team typically responds within 24 hours.
          </p>
        ),
      },
    ]}
  />
);

export default RefundPolicy;
