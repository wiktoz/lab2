const Error = ({err}) => {
    return (
        <div className="flex flex-col gap-1 align-center loader-box">
            <div className="title">Error</div>
            <div className="artist">{err}</div>
        </div>
    )
}

export default Error