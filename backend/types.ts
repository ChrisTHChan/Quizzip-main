export type transcriptPiece = {
    text: string,
    duration: number,
    offset: number
}

export type question = {
        question: string,
        answer: string,
        choices?: string[]
}

export type contentFormatState = 'youtubeURL' | 'text' | 'pdf' | 'doc' | 'ppt'