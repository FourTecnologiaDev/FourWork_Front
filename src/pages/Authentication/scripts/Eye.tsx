export default function Eye(props: { css?: any; isPasswordVisible?: any; togglePasswordVisibility?: any; }) {
    const { isPasswordVisible, togglePasswordVisibility } = props;

    return (
        <span
            style={props.css}
            onClick={togglePasswordVisibility}
            className="MdOutlineVisibility "
        >
            {isPasswordVisible ? 'Eye' : 'Eye'}
        </span>
    );
}
