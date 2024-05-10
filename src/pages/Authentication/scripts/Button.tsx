import React from 'react';

interface ButtonProps {
    name: string;
    id: string;
    type: "button" | "submit" | "reset";
    content: string;
    link: string;
    target: string;
    p: string;
    span: string;
    disabled?: boolean; // Add disabled prop as optional
}



const Button: React.FC<ButtonProps> = (props) => {
    return (
        <div className="button-box">
            <button className="button" name={props.name} id={props.id} type={props.type}>{props.content}</button>
            <a href={props.link} target={props.target}><p>{props.p}<span> {props.span}</span></p></a>
        </div>
    );
}

export default Button;
