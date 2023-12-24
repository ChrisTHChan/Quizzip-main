import Footer from "@/components/Footer"

export default function RefundsAndCancellations() {

    return (
      <>
        <div className="py-10 flex justify-center items-center">
          <div className="container">
            <div className="mb-16 container w-11/12 md:w-4/5 xl:w-2/5 mx-auto leading-loose">
              <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-10">Refunds and <span className="text-blue-500">Cancellations Policy.</span></h2>
              <p className="text-center mb-4">We understand that flexibity is important when it comes to digital purchases. Therefore, we offer a straightforward refund policy for our AI quiz generator product.</p>
              <p className="text-center mb-4">Eligibility for Refund: You can request a refund for any QuizzipIO subscription purchase for any reason, provided that:</p>
              <div className="mb-4 text-center">
                <p className="font-semibold">The refund request is made within 14 days of the purchase date.</p>
                <p className="font-semibold">You have generated fewer than 10 assessments with your account since the date of purchase.</p>
                <p className="font-semibold">You have not used multiple accounts to sign up and abuse our free plan.</p>
                <p className="font-semibold">You have not shared your account login with others.</p>
              </div>
              <p className="text-center mb-4">How to Request a Refund: To initiate a refund, please contact our support team via our help center or via quizzipio@gmail.com. We will process your refund request promptly.</p>
              <p className="text-center mb-4">Refund Processing: Once your refund is approved, we will issue a full refund of your purchase. The refund will be credited through the same payment method used for the purchase. In the event that we&APOS;re unable to process a refund through your initial payment method, we&APOS;ll arrange an alternative method with you. Refunds can take 5-10 business days to process.</p>
              <p className="text-center mb-4">Abuse of Refund Policy: We monitor refund requests to identify any patterns that may suggest abuse of our refund policy. Quizgecko reserves the right to refuse a refund request if abuse is suspected.</p>
            </div>
          </div>
        </div>
        <Footer/>
      </>
    )
}