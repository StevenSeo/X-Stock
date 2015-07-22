function getPeriod(type) {
    
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    var past_dd, past_mm, past_yyyy;

    if (type === '1m') {
        today.setMonth(today.getMonth()-1);
    }
    else if (type === '6m') {
        today.setMonth(today.getMonth()-6);
    }
    else if (type === '1y') {
        today.setMonth(today.getMonth()-12);
    }
    
    past_dd = today.getDate();
    past_mm = today.getMonth()+1; //January is 0!
    past_yyyy = today.getFullYear();
        
    return past_yyyy+'_'+past_mm+'_'+past_dd+'_'+yyyy+'_'+mm+'_'+dd;
}
