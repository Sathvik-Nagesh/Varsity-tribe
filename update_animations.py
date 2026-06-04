import re

with open('src/components/ui/Animations.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("import confetti from 'canvas-confetti';", "")

replacement = """
export function GoalCelebration({ 
  trigger, 
  duration = 3000 
}: { 
  trigger: boolean; 
  duration?: number;
}) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (trigger) {
      const colors = ['#387ED1', '#2D7A4F', '#FFB020', '#E5484D', '#8A2BE2'];
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  if (!trigger || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 20,
            x: p.x + (Math.random() - 0.5) * 200,
            opacity: [1, 1, 0],
            rotate: Math.random() * 360
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}
    </div>
  );
}
"""

code = re.sub(r'export function GoalCelebration.*?return null; // This component doesn\'t render any DOM elements\n\}', replacement, code, flags=re.DOTALL)

with open('src/components/ui/Animations.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
