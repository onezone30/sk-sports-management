import { Link } from "react-router-dom";

const links = [
    {
        href: '#',
        label: 'Privacy Policy'
    },
    {
        href: '#',
        label: 'Terms of Service'
    },
    {
        href: '#',
        label: 'Contact Support'
    }
]

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white py-12 px-4">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
                <p className="text-sm text-slate-500">
                    © 2026 SK Sports Management. All rights reserved.
                </p>
                <div className="flex gap-6">
                    {links.map((link, index) => (
                        <Link key={index} to={link.href} className="text-sm font-medium text-slate-600 hover:text-blue-600">
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}