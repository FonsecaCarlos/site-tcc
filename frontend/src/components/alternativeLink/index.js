import React, { Component } from 'react'

import likedImage from '../../images/liked.png'
import likeImage from '../../images/like.png'

class AlternativeLink extends Component {
    render() {
        const { likes, liked, title, author } = this.props.alternativeText
        
        return (
            <div onClick={this.props.onClick} className='read-header-alternativeLink'>
                <span>{likes}</span>
                <img src={liked ? likedImage : likeImage}
                            alt={liked ? 'Descurtir' : 'Curtir'} />
                <p>{ title }</p>
                <p>Autor(a): <strong> { author }</strong> </p>
            </div>
        )
    }
}

export default AlternativeLink