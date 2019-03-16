import React from 'react';

class ButtonCustom extends React.Component {
    render() {
        return (
            <button className="" {...this.props} >
                {this.props.label}
            </button>
        ); 
    }
}

export default ButtonCustom;