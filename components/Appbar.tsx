import Link from "next/link"

export const Appbar = () => {
    return <div>
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    EthWallet Pro
                </Link>
                <nav className="flex items-center space-x-4">
                <Link href="/" className="text-sm font-medium hover:underline">
                    Home
                </Link>
                <Link href="/about" className="text-sm font-medium hover:underline">
                    About
                </Link>
                </nav>
            </div>
        </header>
    </div>
} 