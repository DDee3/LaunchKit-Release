export function AuthFormDivider() {
  return (
    <div className="relative my-6 font-mono">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
        <span className="bg-zinc-950 px-2 text-zinc-500">
          Or authenticate with
        </span>
      </div>
    </div>
  );
}
