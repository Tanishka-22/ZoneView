'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Sun, Moon, BarChart3, MapPin, Settings, Home } from 'lucide-react';

const navItems = [
	{ label: 'Dashboard', href: '/', icon: Home },
	{ label: 'Projects', href: '/projects', icon: BarChart3 },
	{ label: 'Analytics', href: '/analytics', icon: BarChart3 },
	{ label: 'Settings', href: '/settings', icon: Settings },
];

export default function Navbar() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const theme = localStorage.getItem('theme');
		const isDarkMode = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
		setIsDark(isDarkMode);
		document.documentElement.classList.toggle('dark', isDarkMode);
	}, []);

	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);
		document.documentElement.classList.toggle('dark', newIsDark);
		localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
	};

	return (
		<header className="border-b shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 animate-fade-in">
			<div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
				<Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary hover-lift transition-all">
					<MapPin className="h-6 w-6" />
					<span>ZoneView</span>
				</Link>

				{/* Desktop Nav */}
				<nav className="hidden md:flex gap-1 items-center">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift',
									isActive
										? 'bg-primary text-primary-foreground shadow-md'
										: 'text-muted-foreground hover:text-foreground hover:bg-accent'
								)}
							>
								<Icon className="h-4 w-4" />
								{item.label}
							</Link>
						);
					})}
				</nav>

				{/* Theme Toggle & Mobile Menu */}
				<div className="flex items-center gap-2">
					<button
						onClick={toggleTheme}
						className="p-2 rounded-lg hover:bg-accent transition-colors"
						aria-label="Toggle theme"
					>
						{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
					</button>

					<button
						className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
						onClick={() => setIsOpen(!isOpen)}
						aria-label="Toggle menu"
					>
						{isOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>
			</div>

			{/* Mobile Nav */}
			{isOpen && (
				<div className="md:hidden border-t bg-background/95 backdrop-blur animate-slide-up">
					<nav className="flex flex-col px-4 py-2 space-y-1">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200',
										isActive
											? 'bg-primary text-primary-foreground'
											: 'text-muted-foreground hover:text-foreground hover:bg-accent'
									)}
									onClick={() => setIsOpen(false)}
								>
									<Icon className="h-4 w-4" />
									{item.label}
								</Link>
							);
						})}
					</nav>
				</div>
			)}
		</header>
	);
}

