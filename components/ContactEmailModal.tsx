import { useEffect, useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactEmailModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setQuestion("");
      setError(null);
    }
  }, [isOpen]);

   useEffect(() => {
  if (!isOpen) return;

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  document.addEventListener("keydown", handleEsc);

  return () => {
    document.removeEventListener("keydown", handleEsc);
  };
}, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!question.trim()) {
      return "Please write your question.";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    // Build message to send to Telegram
    const message = encodeURIComponent(
      `📩 New Contact Form Message\n\nEmail: ${email}\n\nQuestion:\n${question}`
    );

    // Replace with your bot or username
    const telegramUrl = `https://t.me/neat_affiliates?start=${message}`;

    window.open(telegramUrl, "_blank");

    onClose();
  };

 


  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-start"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="bg-white shadow-xl relative p-6 animate-slideInLeft
                    rounded-2xl
                    w-full max-w-[360px] mx-auto
                    md:w-[380px] md:mx-0"
        role="dialog"
        style={{ marginTop: "40px", marginBottom: "20px", borderRadius: "20px", ...(window.innerWidth >= 768 && { marginLeft: "20px" }) }}
        aria-modal="true"
        aria-labelledby="contact-support-title"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h3 id="contact-support-title" className="text-xl font-bold mb-1 text-center">
          Contact Support
        </h3>

        <p className="text-center text-gray-600 mb-5">
          Fill the form below and we will receive your message on Telegram.
        </p>
        <p className="font-bold text-center text-gray-400 mb-2">
          Bluffbet, Vidavegas and Jackburst have their own support channels.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your question <span className="text-red-600">*</span>
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 h-28 resize-vertical focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Write your question here…"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Send Message on Telegram 💬
          </button>
        </form>
      </div>
    </div>
  );
}
