import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "../ui/navigation-menu";

import skLogo from '../../assets/sk_logo.png';
import { useEffect, useState } from "react";


const links = [
    {
        href: '/',
        label: 'Home'
    },
    {
        href: '/about',
        label: 'About'
    },
    {
        href: '/contact',
        label: 'Contact'
    }
]

export default function AppNav() {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
                <Link to="/" className="font-bold text-gray-900">
                    <img
                        src={skLogo}
                        alt="SK Sports Logo"
                        className="h-10 w-auto object-contain"
                    />
                </Link>

                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList className="justify-end">
                        {links.map((link) => (
                            <NavigationMenuItem key={link.href}>
                                <NavigationMenuLink asChild>
                                    <Link to={link.href} className="px-3 py-2">
                                        {link.label}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                { user ? (
                    <Button onClick={handleLogout} size="sm" className="flex items-center gap-2">
                        Log Out
                    </Button>
                ) : (
                    <Link to="/login" className="flex items-center gap-2">
                        <Button size="sm">
                            Log In
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
}
