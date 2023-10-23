import Form from '../components/form';

export default function Home() {

  return (
    <>
      <div className="py-10 flex justify-center items-center">
        <div className="container">
          <div className="mb-16 container w-11/12 md:w-3/5 xl:w-2/5 mx-auto">
            <h2 className="text-xl font-semibold text-center mb-4">Easily create assessments from any source.</h2>
            <h3 className="text-6xl font-extrabold text-center mb-4">Get back <span className="text-blue-500">hours of your day.</span></h3>
            <h4 className="text-center mb-4 text-slate-500">Quizzip is a tool that accurately and intelligently creates learning assessments based on the educational content you feed it.</h4>
          </div>
          <Form/>
        </div>
      </div>
    </>
  )
}