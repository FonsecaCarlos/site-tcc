import React from 'react';
import './style.css'

export default props => (
    <button className="buttonCustom" { ...props } >
        { props.label }
    </button>
)