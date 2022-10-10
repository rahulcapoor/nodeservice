function fetch_retry(url, options, noOfRetry = 3) {
    return fetch(url, options).then(res => res.json()).catch(function(error) {
        if (noOfRetry === 1) throw error;
        return fetch_retry(url, options, noOfRetry - 1);
    });
}

const request = ( url, headers, params = {}, method = 'GET' ) => {
    let options = {
        redirect: 'follow',
        method,
        headers: headers
    };
    if ( 'GET' === method ) {
        url += '?' + ( new URLSearchParams( params ) ).toString();
    } 
    
    return fetch_retry( url, options ).then( response => response.json() );
};
const get = ( url, headers, params ) => request( url, headers, params, 'GET' );

module.exports = { get};