import Card from "./_components/Card"

export default function Pricing() {

    return (
      <>
        <div className="py-10 flex justify-center items-center">
          <div className="container">
            <div className="mb-16 container w-11/12 md:w-4/5 xl:w-5/12 mx-auto">
              <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-4">Upgrade your account and get <span className="text-blue-500">unlimited access.</span></h2>
              <h3 className="text-center mb-4 text-slate-500">Free users get <span className="font-extrabold">3 free generations a month</span>. Upgrade your account to a monthly subscription to get more generations and more features!</h3>
              <div className="flex gap-4 flex-col sm:flex-row">
                <Card
                    header="Basic Plan"
                    price={0}
                    includeButton={false}
                    listItems={['Access to all sources of generation.', 'Up to 3 questions per question type.', 'Up to 3 assessment generations per month.', 'Medium sized content sources and file uploads.', 'Quick and responsive customer support.']}
                />
                <Card
                    header="Unlimited Plan"
                    headerClasses="text-blue-500"
                    price={4}
                    includeButton={true}
                    listItems={['Access to all sources of generation.', 'Up to 15 questions per question type.', 'Up to 30 assessment generations per month.', 'Large sized content sources and file uploads.', 'Quick and responsive customer support.', 'Virtual hugs from the Quizzip Team!']}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }