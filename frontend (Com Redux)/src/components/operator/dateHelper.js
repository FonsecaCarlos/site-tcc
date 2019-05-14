const dataParaTexto = (data) => {
    return `${data.getDate()}/${(data.getMonth() + 1)}/${data.getFullYear()}`;

}

const textoParaData = (texto) => {

    // ----- Fail Fast => Falha rápida
    if (!/\d{4}-\d{2}-\d{2}/.test(texto))
        throw new Error('Deve estar no formato aaaa-mm-dd');
    
    return new Date(texto)
}


export { dataParaTexto, textoParaData }