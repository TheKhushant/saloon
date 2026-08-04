import { sanitizePhoneDigits } from "@/lib/validators";

interface PhoneInputProps {
  id?: string;
  value: string; // holds only the 10-digit number, no country code
  onChange: (digits: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

const BLOCK_KEYS = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];

const PhoneInput = ({ id, value, onChange, placeholder = "Enter your Phone Number", className = "", error }: PhoneInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(sanitizePhoneDigits(e.target.value));
  };

  const blockNonDigit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^\d$/.test(e.key) && !BLOCK_KEYS.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div
      className={`flex items-stretch rounded-xl border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 ${
        error ? "border-red-500" : "border-border"
      } ${className}`}
    >
      <span className="flex items-center px-3 text-sm font-medium text-muted-foreground bg-muted border-r border-border select-none shrink-0">
        +91
      </span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        onKeyDown={blockNonDigit}
        onPaste={(e) => {
          e.preventDefault();
          const pasted = sanitizePhoneDigits(e.clipboardData.getData("text"));
          onChange(pasted);
        }}
        placeholder={placeholder}
        maxLength={10}
        className="flex-1 min-w-0 px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
};

export default PhoneInput;
