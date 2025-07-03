import Link from 'next/link';

export default function NavDashboard() {
    return (
        <div className="relative">
            <h1 className="text-4xl font-bold">Menu</h1>

            <div className="flex flex-col gap-5 my-8">
                <Link href="/" className="text-2xl font-mono">
                    Relógio
                </Link>
                <Link href="/dashboard" className="text-2xl font-mono">
                    Dashboard
                </Link>
                <Link href="/about" className="text-2xl font-mono">
                    Sobre
                </Link>
            </div>
        </div>
    );
}
