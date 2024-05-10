
export default function Image(props: { imageLink: string | undefined; altImage: string | undefined; }){
    return(
        <img src={props.imageLink} alt={props.altImage}/>
    )
}