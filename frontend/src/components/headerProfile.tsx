import Link from 'next/link';
import PrimaryButton from './primaryButton';
import SecondaryButton from './secondaryButton';

const HeaderProfile = () => {
    return (
        <>
            <Link href='register'><SecondaryButton extra_classes="px-4 mr-4 ">Register</SecondaryButton></Link>
            <Link href='sign-in'><PrimaryButton extra_classes="px-4">Sign In</PrimaryButton></Link>
        </>
    )
}

export default HeaderProfile