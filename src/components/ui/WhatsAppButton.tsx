import { motion } from 'framer-motion';

export function WhatsAppButton() {
  const phoneNumber = "556999650890"; // Número oficial
  const message = "Olá! Gostaria de falar sobre assistência técnica.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#1ebe57] transition-colors group"
      aria-label="Falar no WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path d="M12.031 0C5.385 0 0 5.383 0 12.029c0 2.124.553 4.195 1.604 6.01L.067 23.553l5.656-1.485c1.748.955 3.714 1.458 5.714 1.458h.004c6.645 0 12.03-5.383 12.03-12.03S18.676 0 12.031 0zm.004 21.52c-1.796 0-3.553-.483-5.093-1.396l-.365-.216-3.784.993.993-3.69-.236-.376C2.56 15.195 2.016 13.633 2.016 12.03 2.016 6.496 6.505 2.01 12.036 2.01 14.717 2.01 17.21 3.054 19.106 4.953c1.897 1.897 2.94 4.417 2.94 7.098 0 5.533-4.49 10.02-10.01 10.02v-.001zm5.502-7.533c-.302-.151-1.785-.881-2.062-.981-.277-.1-.478-.151-.679.151-.201.301-.782.981-.958 1.182-.176.201-.353.226-.655.075-2.083-1.042-3.489-1.921-4.809-3.64-.176-.231-.019-.357.132-.507.135-.135.302-.352.453-.528.151-.176.201-.301.302-.502.1-.201.05-.377-.025-.528-.075-.151-.679-1.637-.93-2.241-.243-.588-.491-.508-.679-.517-.176-.008-.377-.008-.578-.008-.201 0-.528.075-.805.377-.277.301-1.056 1.031-1.056 2.515s1.082 2.917 1.233 3.118c.151.201 2.127 3.245 5.153 4.549 1.954.84 2.662.906 3.654.767.842-.118 2.585-1.056 2.948-2.078.363-1.022.363-1.897.254-2.078-.109-.181-.411-.281-.713-.432z" />
      </svg>
    </motion.a>
  );
}
