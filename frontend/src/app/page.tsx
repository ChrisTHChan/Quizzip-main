import PrimaryButton from '@/components/primaryButton';
import Link from 'next/link'
import Image from 'next/image';
import ss1 from '../../public/images/ss1.png';
import ss2 from '../../public/images/ss2.png'
import chromeLogo from '../../public/images/chrome-logo.svg'
import pdfLogo from '../../public/images/pdf-logo.svg'
import pptLogo from '../../public/images/ppt-logo.svg'
import wordLogo from '../../public/images/word-logo.svg'
import youtubeLogo from '../../public/images/youtube-logo.svg'

export default function Home() {

  return (
    <>
      <div className="py-10 flex justify-center items-center">
        <div className="container">

          <div className="mb-16 container w-11/12 md:w-3/5 xl:w-2/5 mx-auto">
            <h2 className="text-xl font-semibold text-center mb-4">Quickly create assessments from any digital content.</h2>
            <h3 className="text-6xl font-extrabold text-center mb-4">Get back <span className="text-blue-500">hours of your day.</span></h3>
            <h4 className="text-center mb-4 text-slate-400">Quizzip is a tool that accurately and intelligently creates learning assessments from any educational digital content you feed it.</h4>
            <div className="w-full flex justify-center">
              <Link className="inline-block mx-auto" href="/create"><PrimaryButton>Get Started</PrimaryButton></Link>
            </div>
          </div>

          <div className="flex gap-4 mb-48">
            <div className="h-auto w-10/12 mx-auto rounded border-2 border-slate-700">
              <Image alt="quizzip create screen" src={ss1} className="object-contain h-full"/>
            </div>
          </div>

          <div className="mb-48">
            <p className="text-center mb-16 text-slate-400 text-lg font-semibold uppercase">Made for educators, businesses, and students everywhere.</p>
            <div className="w-full md:flex md:w-10/12 mx-auto mb-2 px-6 md:px-0 gap-16 justify-between">
              <div className="md:w-1/3 md:mb-0 mb-10">
                <p className="font-semibold mb-4">Educators</p>
                <p className="text-slate-300 text-sm leading-loose">Elevate your teaching with AI-powered quiz, assessment, and exam generation. Save time on content creation, grading, and enhance student engagement.</p>
                <Link href="/create" className="block my-4 md:hidden"><button className="text-sm font-semibold text-blue-400 hover:underline underline-offset-8">Get Started &#8594;</button></Link>
              </div>
              <div className="md:w-1/3 md:mb-0 mb-10">
                <p className="font-semibold mb-4">Businesses</p>
                <p className="text-slate-300 text-sm leading-loose">Create assessments in no time to boost knowledge and evaluate skills. Whether it's for delivering trainings, developing courses, or certification - we've got you covered.</p>
                <Link href="/create" className="block my-4 md:hidden"><button className="text-sm font-semibold text-blue-400 hover:underline underline-offset-8">Get Started &#8594;</button></Link>
              </div>
              <div className="md:w-1/3 md:mb-0 mb-10">
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

          <div className="px-6 md:px-0 mb-48 w-full">
            <div className="w-full md:w-10/12 mx-auto flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-1/2 flex flex-wrap justify-center">
                <Image alt="google chrome" src={chromeLogo} className="object-contain w-1/3"/>
                <Image alt="pdf" src={pdfLogo} className="object-contain w-1/3"/>
                <Image alt="powerpoint" src={pptLogo} className="object-contain w-1/3"/>
                <Image alt="word document" src={wordLogo} className="object-contain w-1/3"/>
                <Image alt="youtube" src={youtubeLogo} className="object-contain w-1/3"/>
              </div>
              <div className="w-full lg:w-1/2">
                <h3 className="text-6xl font-extrabold mb-8">Assessments from<span className="text-blue-500"> any digital content.</span></h3>
                <p className="mb-8 text-slate-300 leading-loose"><span className="font-semibold">Versatile.</span> From files like PDF's, Word Documents, and Powerpoints, to audio content like youtube videos, you can use any content source to create your assessments.</p>
                <p className="mb-8 text-slate-300 leading-loose"><span className="font-semibold">Cuztomizable.</span> Adjust the length of your tests by changing the number of questions, the difficulty level, and the required answer detail.</p>
                <Link className="inline-block mx-auto" href="/create"><PrimaryButton>Get Started</PrimaryButton></Link>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-0 mb-48 w-full">
            <div className="w-full md:w-10/12 mx-auto flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-1/2">
                <h3 className="text-6xl font-extrabold mb-8">Save tests and<span className="text-blue-500"> publish for use.</span></h3>
                <p className="mb-8 text-slate-300 leading-loose"><span className="font-semibold">Record.</span> Save any generated assessments to your personal library for a historical record of all your tests for later use and re-use.</p>
                <p className="mb-8 text-slate-300 leading-loose"><span className="font-semibold">Publish.</span> View, search, publish and delete assessments as needed. Export your tests to various file types for easy sharing and printing for your end users.</p>
                <Link className="inline-block mx-auto" href="/create"><PrimaryButton>Get Started</PrimaryButton></Link>
              </div>
              <div className="w-full lg:w-1/2 rounded border-2 border-slate-700 px-4 pb-4">
                <Image alt="quizzip create screen" src={ss2} className="object-contain h-full"/>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-0 mb-48 w-full">
            <h3 className="text-6xl font-extrabold mb-16 text-center">See what <span className="text-blue-500">our users say.</span></h3>
            <div className=" w-full md:w-10/12 mx-auto flex flex-col lg:flex-row divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-slate-700">
              <div className="lg:w-1/2 lg:mr-12 mb-8 lg:mb-0 text-slate-300">
                <div className="flex flex-col h-full justify-between text-center">
                  <p className="leading-loose mb-8">Making multiple-choice tests to see if my kids have read the given articles is something I dislike doing. QuizzipIO was excellent. It was as simple as uploading the article, creating questions, exporting them, reviewing the questions, and eliminating those that I didn't want to use. It was really simple!</p>
                  <div>
                    <p className="mb-2">- Melanie Esbert</p>
                    <p className="font-bold">Parent & Tutor</p>
                  </div>
                </div>
              </div>
              <div className="pt-8 lg:pt-0 lg:w-1/2 lg:pl-12 text-slate-300">
                <div className="flex flex-col h-full justify-between text-center">
                  <p className="leading-loose mb-8">QuizzipIO has helped me as a classroom teacher by saving me hours of preparation time when creating questions for my students. The AI question generator provides me with a wide range of options, which I then manually choose the best ones for my kids based on how well they align with my curriculum.</p>
                  <div>
                    <p className="mb-2">- Gary Millsner</p>
                    <p className="font-bold">Classroom Teacher</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}