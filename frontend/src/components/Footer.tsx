import Link from 'next/link';

const Footer = () => {
    return (
        <>
            <div className="py-10 flex justify-center items-center">
                <div className="container text-sm">
                    <div className="flex flex-wrap justify-center mb-8 text-slate-400">
                        <Link href='/create' className="mx-4 hover:text-slate-200 mb-4 hover:underline underline-offset-4">Create Assessment</Link>
                        <Link href='/library' className="mx-4 hover:text-slate-200 mb-4 hover:underline underline-offset-4">My Library</Link>
                        <Link href='/user' className="mx-4 hover:text-slate-200 mb-4 hover:underline underline-offset-4">My User Account</Link>
                        <Link href='/contact' className="mx-4 hover:text-slate-200 mb-4 hover:underline underline-offset-4">Contact Us</Link>
                        <Link href='/pricing' className="mx-4 hover:text-slate-200 mb-4 hover:underline underline-offset-4">Pricing</Link>
                        <Link href='/privacy-policy' className="mx-4 hover:text-slate-200 mb-4 hover:underline underline-offset-4">Privacy Policy</Link>
                        <Link href='/fair-usage' className="mx-4 hover:text-slate-200 mb-4 hover:underline underline-offset-4">Terms of Fair Usage</Link>
                        <Link href='/terms-service' className="mx-4 hover:text-slate-200 mb-4 hover:underline underline-offset-4">Terms of Service</Link>
                        <Link href='/refunds-cancellations' className="mx-4 hover:text-slate-200 mb-4 hover:underline underline-offset-4">Refunds and Cancellations</Link>
                    </div>
                    <p className="text-center text-slate-500">&copy; 2023 QuizzipIO, All Rights Reserved</p>
                </div>
            </div>
        </>
    )
}

export default Footer