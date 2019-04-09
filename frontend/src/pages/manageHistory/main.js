import React, { Component } from 'react'

import HeaderMain from '../../components/headerMain'
import CardMain from '../../components/cardMain'
import './style.css'

class MainHistory extends Component {
    
    constructor(props) {
        super(props)
        this.state = {  }
    }

    render() { 
        const text = `Era uma vez, um grupo de três amigos que sempre andavam sempre juntos, 
        certo dia eles decidiram que iriam fazer uma viagem para um lugar distante. Um deles 
        era muito esperto, seu nome era João. Ele sonhava com a ilusão de poder viajar no tempo, 
        seus amigos sombavam de sua cada dizendo:
        - Para de ser tonto João, kkkkkk`
        return ( 
            <div className='main-wrapper'>
                <HeaderMain name={'Carlos Fonseca'} email={'carlos.fonseca@novaandradina.org'} />
                <div className='main-cards'>
                    <CardMain title='Os viajantes do tempo'
                        author='Carlos Fonseca'
                        text={`${text.substring(0, 200)} ...`}
                        createdAt='06/04/2019'/>
                    <CardMain title='Os viajantes do tempo'
                        author='Carlos Fonseca'
                        text={`${text.substring(0, 200)} ...`}
                        createdAt='06/04/2019'/>
                    <CardMain title='Os viajantes do tempo'
                        author='Carlos Fonseca'
                        text={`${text.substring(0, 200)} ...`}
                        createdAt='06/04/2019'/>
                    <CardMain title='Os viajantes do tempo'
                        author='Carlos Fonseca'
                        text={`${text.substring(0, 200)} ...`}
                        createdAt='06/04/2019'/>
                </div>
            </div>
         )
    }
}
 
export default MainHistory