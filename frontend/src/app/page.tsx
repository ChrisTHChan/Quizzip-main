import PrimaryButton from '@/components/primaryButton';
import Link from 'next/link'
import Image from 'next/image';
import ss1 from '../../public/images/ss1.png';
import ss2 from '../../public/images/ss2.png'

export default function Home() {

  return (
    <>
      <div className="py-10 flex justify-center items-center">
        <div className="container">

          <div className="mb-16 container w-11/12 md:w-3/5 xl:w-2/5 mx-auto">
            <h2 className="text-xl font-semibold text-center mb-4">Quickly create assessments from any educational content.</h2>
            <h3 className="text-6xl font-extrabold text-center mb-4">Get back <span className="text-blue-500">hours of your day.</span></h3>
            <h4 className="text-center mb-4 text-slate-400">Quizzip is a tool that accurately and intelligently creates learning assessments based on the educational content you feed it.</h4>
            <div className="w-full flex justify-center">
              <Link className="inline-block mx-auto" href="/create"><PrimaryButton>Get Started</PrimaryButton></Link>
            </div>
          </div>

          <div className="flex gap-4 mb-48">
            <div className="h-auto w-10/12 mx-auto rounded border-2 border-slate-700">
              <Image alt="a test" src={ss1} className="object-contain h-full"/>
            </div>
          </div>

          <div className="mb-48">
            <p className="text-center mb-16 text-slate-400 text-sm font-semibold uppercase">Made for educators, businesses, and students everywhere.</p>
            <div className="w-full md:flex md:w-10/12 mx-auto mb-2 px-6 md:px-0 gap-16 justify-between">
              <div className="md:w-1/3">
                <p className="font-semibold mb-4">Educators</p>
                <p className="text-slate-300 text-sm leading-loose">Elevate your teaching with AI-powered quiz, assessment, and exam generation. Save time on content creation, grading, and enhance student engagement.</p>
                <Link href="/create" className="block my-4 md:hidden"><button className="text-sm font-semibold text-blue-400 hover:underline underline-offset-8">Get Started &#8594;</button></Link>
              </div>
              <div className="md:w-1/3">
                <p className="font-semibold mb-4">Businesses</p>
                <p className="text-slate-300 text-sm leading-loose">Create assessments in no time to boost knowledge and evaluate skills. Whether it's for delivering trainings, developing courses, or certification - we've got you covered.</p>
                <Link href="/create" className="block my-4 md:hidden"><button className="text-sm font-semibold text-blue-400 hover:underline underline-offset-8">Get Started &#8594;</button></Link>
              </div>
              <div className="md:w-1/3">
                <p className="font-semibold mb-4">Students</p>
                <p className="text-slate-300 text-sm leading-loose">Learn smarter. Enjoy AI-generated quizzes, flashcards, and notes tailored to your unique learning needs. Save time, boost retention, and ace your exams with ease.</p>
                <Link href="/create" className="block my-4 md:hidden"><button className="text-sm font-semibold text-blue-400 hover:underline underline-offset-8">Get Started &#8594;</button></Link>
              </div>
            </div>
            <div className="hidden md:flex w-10/12 mx-auto gap-16 justify-between">
              <div className="w-1/3"><Link href="/create"><button className="text-sm font-semibold text-blue-400 hover:underline underline-offset-8">Get Started &#8594;</button></Link></div>
              <div className="w-1/3"><Link href="/create" className="w-1/3"><button className="text-sm font-semibold text-blue-400 hover:underline underline-offset-8">Get Started &#8594;</button></Link></div>
              <div className="w-1/3"><Link href="/create" className="w-1/3"><button className="text-sm font-semibold text-blue-400 hover:underline underline-offset-8">Get Started &#8594;</button></Link></div>
            </div>
          </div>

          <div className="px-6">
            fjdklafmdkalfdla
          </div>

        </div>
      </div>
    </>
  )
}