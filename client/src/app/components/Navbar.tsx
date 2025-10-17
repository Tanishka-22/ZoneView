'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
	{ label: 'Dashboard', href: '/' },
	{ label: 'Projects', href: '/projects' },
	{ label: 'Analytics', href: '/analytics' },
	{ label: 'Settings', href: '/settings' },
];

export default function Navbar() {
	const pathname = usePathname();

	return (
		<header className="border-b shadow-sm bg-white sticky top-0 z-50">
			<div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
				<Link href="/" className="text-xl font-bold text-blue-600">
					ZoneView
				</Link>
				<nav className="flex gap-6 items-center">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'text-sm font-medium hover:text-blue-600 transition-colors',
								pathname === item.href ? 'text-blue-600' : 'text-muted-foreground'
							)}
						>
							{item.label}
						</Link>
					))}
				</nav>
				{/* <Input type="text" placeholder="Search projects..." className="w-[200px] md:w-[300px]" /> */}
			</div>
		</header>
	);
}