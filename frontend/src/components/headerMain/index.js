import React, {Component} from 'react'

import './style.css'
import SearchImg from '../../images/search.png'
import AddImg from '../../images/add.png'

class HeaderMain extends Component {

    constructor(props) {
        super(props)
        this.state = {
            search: ''
        }
        this.pesquisar = this.pesquisar.bind(this)
        this.updateSearch = this.updateSearch.bind(this)
    }

    pesquisar = () => {
        console.log(`pesquisar(${this.state.search})`)
    }

    updateSearch = (e) => {
        const search = e.target.value
        this.setState({search})
    }

    render(){
        return ( 
            <header className='header-main'>
                <h2 className='header'>{this.props.name}</h2>
                
                <div className='header header-historias'>
                    <div className='header-left'>
                        <input className='header-search' onChange={(e) => this.updateSearch(e)}
                            placeholder='Pesquisar'/>
                        <input type='image' src={SearchImg} alt='Pesquisar' width='20'
                            onClick={() => this.pesquisar()} />
                    </div>
                    <div className='header-left header-button'>
                        <button>Histórias públicas</button>
                        <button>Histórias compartilhadas comigo</button>
                        <button>Minhas histórias</button>
                        <input type='image' src={AddImg} alt='Adicionar história' width='20'
                            height='20' onClick={() => this.pesquisar()} />
                    </div>
                </div>
            </header>
         )
    }
}
 
export default HeaderMain