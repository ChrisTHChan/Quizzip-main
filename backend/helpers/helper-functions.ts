import { YoutubeTranscript } from 'youtube-transcript'
import { transcriptPiece } from '../types';
import openAI from 'openai'

const openai = new openAI({
   apiKey: process.env.OPEN_AI_KEY,
});

export const generateQuestions = async (questionType: 'multiple choice' | 'short answer' | 'true or false', transcript: string, difficultyLevel: string) => {    

   const systemSetting = `
       You are assigned to write questions.

       You must use the following JSON format to create the question:
       [
           {
               "question": "the question", 
               "answer": "the answer to the question"
           }
       ]

       For multiple choice questions, use the following JSON format:
       [
           {
               "question": "the first question", 
               "choices": [
                   "first choice",
                   "second choice",
                   "third choice",
                   "fourth choice"
               ],
               "answer": "the correct choice"
           }
       ]
   `.trim()

   const completionString = `
       create one ${difficultyLevel} level question in ${questionType} format.
       The question should be thought provoking.
       The question should allow the person answering to apply their knowledge.
       Multiple choice questions should have multiple plausible answers.
       Provide detailed answers for short answer questions.
   `.trim();
   
   const completion = await openai.chat.completions.create({
       messages: [
           { role: "system", content: systemSetting },
           { role: "user", content: `Use the following information: ${transcript}.` },
           { role: "user", content: completionString }
       ],
       model: "gpt-3.5-turbo",
   });

   let question: string = completion.choices[0].message.content as string;
   
   return question;
}

export const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export const splitString = (str: string, num: number) => {
    const len = str.length / num;
    const creds = str.split("").reduce((acc: any, val) => {
       let { res, currInd } = acc;
       if(!res[currInd] || res[currInd].length < len){
          res[currInd] = (res[currInd] || "") + val;
       }else{
          res[++currInd] = val;
       };
       return { res, currInd };
    }, {
       res: [],
       currInd: 0
    });
    return creds.res;
}

export const fetchTranscript = async (videoUrl: string) => {
   let transcriptString: string = '';
   const transcript = await YoutubeTranscript.fetchTranscript(videoUrl)
   
   transcript.forEach((transcriptPiece: transcriptPiece) => {
       transcriptString += ` ${transcriptPiece.text}`;
   })

   return transcriptString;
}