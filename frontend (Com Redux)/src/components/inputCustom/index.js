import React from 'react'
import './style.css'
import If from '../operator/if'

export default props => (
    <If test={!props.hide}>
        <input { ...props } { ...props.input }
            className='inputCustom'
            placeholder={props.placeholder}
            readOnly={props.readOnly}
            type={props.type} />
    </If>
)