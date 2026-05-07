export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 px-6 lg:px-16 py-10 mt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-display font-semibold text-[#0a0a0a]">Dilraj Grewal</p>
          <p className="text-sm text-zinc-400 mt-1">
            Data science student · UC San Diego
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <a
            href="https://larper.co"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0a0a0a] transition-colors duration-200"
          >
            LARPER ↗
          </a>
          <a
            href="https://www.linkedin.com/in/dilraj-singh-grewal"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0a0a0a] transition-colors duration-200"
          >
            LinkedIn ↗
          </a>
          <a
            href="mailto:dgrewal2004@gmail.com"
            className="hover:text-[#0a0a0a] transition-colors duration-200"
          >
            Email
          </a>
        </div>
      </div>

      <p className="text-xs font-mono text-zinc-300 mt-10">
        © {new Date().getFullYear()} Dilraj Grewal
      </p>
    </footer>
  );
}
