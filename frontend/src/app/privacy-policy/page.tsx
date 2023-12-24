import Footer from "@/components/Footer"

export default function PrivacyPolicy() {

    return (
      <>
        <div className="py-10 flex justify-center items-center">
          <div className="container">
            <div className="mb-16 container w-11/12 mx-auto leading-loose">
              <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-10">Privacy<span className="text-blue-500"> Policy.</span></h2>
              <p className=" mb-4">The privacy of your data — and it is your data, not ours! — is a big deal to us. In this policy, we lay out: what data we collect and why; how your data is handled; and your rights to your data. We promise we never sell your data: never have, never will. This policy applies to QuizzipIO.com</p>
              <p className=" mb-4">Our guiding principle is to collect only what we need. Here’s what that means in practice:</p>
              <p className="font-semibold mb-4">Identity & access</p>
              <p className=" mb-4">When you sign up for a QuizzipIO product, we typically ask for identifying information such as your name and email address. That’s just so you can personalize your new account, and we can send you invoices, updates, or other essential information. We’ll never sell your personal info to third parties.</p>
              <p className="font-semibold mb-4">Billing information</p>
              <p className=" mb-4">When you pay for a QuizzipIO product, we ask for your credit card and billing address. That’s so we can charge you for service, calculate taxes due, and send you invoices. Your credit card is passed directly to our payment processor and doesn’t ever go through our servers. We store a record of the payment transaction, including the last 4 digits of the credit card number and as-of billing address, for account history, invoicing, and billing support. We store your billing address to calculate any sales tax due in the United States or VAT in the EU, to detect fraudulent credit card transactions, and to print on your invoices.</p>
              <p className="font-semibold mb-4">Website interactions</p>
              <p className=" mb-4">When you browse our marketing pages or applications, your browser automatically shares certain information such as which operating system and browser version you are using. We track that information, along with the pages you are visiting, page load timing, and which website referred you for statistical purposes like conversion rates and to test new designs. We sometimes track specific link clicks to help inform some design decisions. These web analytics data are tied to your IP address and user account if applicable and you are signed into our Services. Other web analytics we utilize are described further in the Cookies and Do Not Track section.</p>
              <p className="font-semibold mb-4">Data Protection</p>
              <p className=" mb-4">Every file you have uploaded to our system is parsed to temporary cache and sent to our trained AI model to create your questions. When your questions are created successfully cache is flushed and your document completely removed from our system. We do not store any of your data to create your questions! QuizzipIO is a highly secure and reliable platform that places utmost importance on the safety and privacy of its users. QuizzipIO implemented stringent security measures to protect user data and ensure a safe user experience. QuizzipIO follows industry-standard encryption protocols to safeguard all communication between users and the platform. This ensures that any data transmitted during interactions, such as personal information or answers to quiz questions, is encrypted and remains confidential.</p>
              <p className="font-semibold mb-4">Security</p>
              <p className=" mb-4">The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>
              <p className="font-semibold mb-4">Cookies and Do Not Track</p>
              <p className=" mb-4">We do use persistent first-party cookies to store certain preferences, make it easier for you to use our applications, and support some in-house analytics. We partner with Google for some marketing activities. If you are coming to QuizzipIO from a Google ad, and are in the United States, Google will send a cookie to your browser to determine whether you visited quizzipio.com because of a particular advertisement you viewed. This enables us to evaluate the effectiveness of these ads. A cookie is a piece of text stored by your browser. It may help remember login information and site preferences. It might also collect information such as your browser type, operating system, web pages visited, duration of visit, content viewed, and other click-stream data. You can adjust cookie retention settings in your own browser. To learn more about cookies, including how to view which cookies have been set and how to manage and delete them, please visit: www.allaboutcookies.org. At this time, our sites and applications do not respond to Do Not Track beacons sent by browser plugins.</p>
              <p className="font-semibold mb-4">Changes and Questions</p>
              <p className=" mb-4">We may update this policy as needed to comply with relevant regulations and reflect any new practices. If you have any questions, comments, or concerns about this privacy policy, your data, or your rights with respect to your information, please get in touch by emailing us at quizzipio@gmail.com and we’ll be happy to answer them!</p>
            </div>
          </div>
        </div>
        <Footer/>
      </>
    )
}