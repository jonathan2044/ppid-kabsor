import { PapuaPattern, PapuaBorder } from '../PapuaPattern'

export default function PapuaPatternExample() {
  return (
    <div className="space-y-4 p-4 bg-card">
      <div className="relative h-32 bg-primary rounded-md overflow-hidden">
        <PapuaPattern className="absolute inset-0 text-gold" opacity={0.15} />
        <div className="relative z-10 flex items-center justify-center h-full text-primary-foreground font-semibold">
          Papua Pattern Overlay
        </div>
      </div>
      <PapuaBorder />
    </div>
  )
}
