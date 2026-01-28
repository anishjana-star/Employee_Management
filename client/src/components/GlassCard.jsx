import { motion } from "framer-motion";


export default function GlassCard({ children }) {
return (
<motion.div
whileHover={{ scale: 1.02 }}
className="glass p-6 shadow-xl"
>
{children}
</motion.div>
);
}