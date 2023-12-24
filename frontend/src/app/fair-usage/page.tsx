import Footer from "@/components/Footer"

export default function FairUsage() {

    return (
      <>
        <div className="py-10 flex justify-center items-center">
          <div className="container">
            <div className="mb-16 container w-11/12 md:w-4/5 xl:w-2/5 mx-auto leading-loose">
              <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-10">Terms of <span className="text-blue-500">Fair Usage Policy.</span></h2>
              <p className="text-center mb-4">To prevent abuse, we may throttle and limit accounts with unusually high usage in an automated process. If you believe that we have taken this action in error, please contact us, and we may be able to remove the restriction.</p>
              <p className="text-center mb-4">To avoid overloading our systems, all accounts across all plans are limited dynamically on a per-minute, per-hour and per-month basis. This way, if you haven&APOS;t used the product much the previous hour, or month, you will have a higher allowance. We also have various bot prevention measures in place. Most users won&APOS;t encounter these limits. If you do, please wait a minute before trying again.</p>
              <p className="text-center mb-4">The rate limit is determined dynamically and may change. Higher-tier plans receive faster speeds and higher rate limits. Sharing your email and password or reselling access to your account violates our terms of service and may result in immediate cancellation without a refund.</p>
              <p className="text-center mb-4">This policy is subject to change and we reserve the right to update it without notice at any time.</p>
              <p className="text-center mb-4">We strive to ensure QuizzipIO&APOS;s sustainability while providing the best possible service to our users. We&APOS;ll continue to monitor usage and update our policies as needed to ensure that QuizzipIO remains accessible and affordable for everyone.</p>
            </div>
          </div>
        </div>
        <Footer/>
      </>
    )
}