import Link from 'next/link';

export default function NavDashboard() {
    return (
        <nav>
            <h1 className="text-4xl font-bold mb-8">Menu</h1>

            <div className="flex flex-col gap-5 text-lg">
                <Link href="/" className="font-mono hover:underline">
                    Relógio
                </Link>
                <Link href="/dashboard" className="font-mono hover:underline">
                    Dashboard
                </Link>
                <Link href="/about" className="font-mono hover:underline">
                    Sobre
                </Link>
            </div>
        </nav>
    );
}
