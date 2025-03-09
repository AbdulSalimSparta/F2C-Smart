import React from "react";
import '../styles/Login.css'; 

function Button(props){
   return (
    <button  onClick={props.checkClicked} type={props.type} id={props.id} name={props.name} >{props.text}</button>
   );
}

export default Button;