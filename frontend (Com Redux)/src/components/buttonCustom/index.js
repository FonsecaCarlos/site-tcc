import React from 'react';
import './style.css'

export default props => (
    <button { ...props } className={`buttonCustom ${props.className}`} >
        { props.label }
    </button>
)