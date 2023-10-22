type question = {
    question: string,
    answer: string,
    choices?: string[]
}

type props = {
    question: question,
    showAnswers: boolean
}

const question = ({question, showAnswers}: props) => {
    return (
        <div className="mb-5 bg-gray-800 rounded-lg p-4">
            <p className="mb-2">{question.question}</p>
            {
                question.choices
                ?
                question.choices.map((choice:string, i) => {
                    return <p className="ml-4" key={i}><span>{i+1}. </span>{choice}</p>
                })
                :
                null 
            }
            {showAnswers ? <strong className="mt-2 block italic">{question.answer}</strong> : null}
        </div>
    )
}

export default question