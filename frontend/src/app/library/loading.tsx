import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Loading() {
    return (
        <div className="flex justify-center items-center">  
            <div className="container">
                <Skeleton count={10} className="w-1/3" baseColor="#0f172a" highlightColor="#334155"/>
            </div>
        </div>
    ) 
}