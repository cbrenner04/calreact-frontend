import moment from 'moment';

export var formatDate = function(d) {
  return(d ? moment(d).format('MMMM DD YYYY, h:mm:ss a') : '')
}
