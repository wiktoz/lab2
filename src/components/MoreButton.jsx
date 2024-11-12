import { FaArrowRightLong, FaCheck } from "react-icons/fa6"

const MoreButton = ({more, done}) => {
    return (
        <>
        {
            done ?
            <div className="flex flex-row gap-02">
                <div className="flex align-center">
                    <FaCheck/>
                </div>
                <div>
                    You're all caught up
                </div>
            </div> :

            <div onClick={() => more()} className="more-button inline-flex flex-row gap-02">
                <div>
                    show more
                </div>
                <div className="flex align-center">
                    <FaArrowRightLong/>
                </div>
            </div>
        }
        </>
    )
}

export default MoreButton